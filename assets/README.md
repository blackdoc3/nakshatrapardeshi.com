# Android icon and splash assets

Run this from the repository root after `npm install`:

```bash
npm run assets:create
```

That creates simple `NC` PNG source assets in this folder:

- `icon-only.png`
- `icon-foreground.png`
- `icon-background.png`
- `splash.png`
- `splash-dark.png`

Then, after the Android project has been generated with `npm run cap:add:android`, run:

```bash
npm run assets:generate
npm run cap:sync
```

This uses Capacitor Assets to place the generated launcher icon and splash assets into the Android project.

The generated PNG files are intentionally ignored by Git because they can be recreated from `scripts/generate-nc-assets.mjs`.
