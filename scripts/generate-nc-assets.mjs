import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const outDir = path.resolve('assets');
fs.mkdirSync(outDir, { recursive: true });

const colors = {
  green: [15, 107, 79, 255],
  greenDark: [23, 71, 54, 255],
  beige: [247, 244, 238, 255],
  white: [255, 255, 255, 255],
  transparent: [0, 0, 0, 0],
};

function createCanvas(width, height, fill = colors.beige) {
  const pixels = new Uint8Array(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) pixels.set(fill, i);
  return { width, height, pixels };
}

function setPixel(canvas, x, y, color) {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
  const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
  canvas.pixels.set(color, index);
}

function rect(canvas, x, y, w, h, color) {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(canvas.width, Math.ceil(x + w));
  const y1 = Math.min(canvas.height, Math.ceil(y + h));
  for (let yy = y0; yy < y1; yy++) {
    for (let xx = x0; xx < x1; xx++) setPixel(canvas, xx, yy, color);
  }
}

function circle(canvas, cx, cy, radius, color) {
  const r2 = radius * radius;
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) setPixel(canvas, x, y, color);
    }
  }
}

function drawN(canvas, x, y, w, h, color) {
  const t = Math.round(w * 0.18);
  rect(canvas, x, y, t, h, color);
  rect(canvas, x + w - t, y, t, h, color);
  for (let yy = 0; yy < h; yy++) {
    const progress = yy / h;
    const xx = x + t * 0.55 + progress * (w - t * 2.1);
    rect(canvas, xx, y + yy, t * 1.08, 2, color);
  }
}

function drawC(canvas, x, y, w, h, color) {
  const t = Math.round(w * 0.18);
  rect(canvas, x, y, w, t, color);
  rect(canvas, x, y, t, h, color);
  rect(canvas, x, y + h - t, w, t, color);
  rect(canvas, x + w - t * 0.6, y, t * 0.6, t, color);
  rect(canvas, x + w - t * 0.6, y + h - t, t * 0.6, t, color);
}

function drawLogo(canvas, scale = 1, color = colors.white) {
  const size = Math.min(canvas.width, canvas.height) * scale;
  const h = size * 0.54;
  const y = canvas.height / 2 - h / 2;
  const gap = size * 0.065;
  const letterW = (size - gap) / 2;
  const x = canvas.width / 2 - size / 2;
  drawN(canvas, x, y, letterW, h, color);
  drawC(canvas, x + letterW + gap, y, letterW, h, color);
}

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(canvas) {
  const { width, height, pixels } = canvas;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    Buffer.from(pixels.buffer, y * width * 4, width * 4).copy(raw, rowStart + 1);
  }
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function save(name, canvas) {
  fs.writeFileSync(path.join(outDir, name), encodePng(canvas));
  console.log(`created assets/${name}`);
}

const icon = createCanvas(1024, 1024, colors.green);
circle(icon, 512, 512, 430, colors.greenDark);
drawLogo(icon, 0.68, colors.white);
save('icon-only.png', icon);

const foreground = createCanvas(1024, 1024, colors.transparent);
drawLogo(foreground, 0.62, colors.green);
save('icon-foreground.png', foreground);

const background = createCanvas(1024, 1024, colors.beige);
save('icon-background.png', background);

const splash = createCanvas(2732, 2732, colors.beige);
circle(splash, 1366, 1366, 420, colors.green);
drawLogo(splash, 0.26, colors.white);
save('splash.png', splash);

const splashDark = createCanvas(2732, 2732, colors.greenDark);
circle(splashDark, 1366, 1366, 420, colors.beige);
drawLogo(splashDark, 0.26, colors.green);
save('splash-dark.png', splashDark);
