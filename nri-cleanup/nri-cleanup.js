const OWNER_EMAIL = 'nakshatrapardeshi@gmail.com';
const OWNER_WHATSAPP = '[PASTE_WHATSAPP_NUMBER_WITH_COUNTRY_CODE]';

const form = document.querySelector('#nri-intake-form');
const resultCard = document.querySelector('#result-card');
const scoreValue = document.querySelector('#score-value');
const scoreBand = document.querySelector('#score-band');
const recommendedProduct = document.querySelector('#recommended-product');
const safeExplanation = document.querySelector('#safe-explanation');
const summaryOutput = document.querySelector('#summary-output');
const copyButton = document.querySelector('#copy-summary');
const emailLink = document.querySelector('#email-summary');
const whatsappLink = document.querySelector('#whatsapp-summary');
const copyStatus = document.querySelector('#copy-status');

function getCheckedValues(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}

function getRadioValue(name) {
  const selected = form.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : '';
}

function getTextValue(name) {
  const field = form.querySelector(`[name="${name}"]`);
  return field ? field.value.trim() : '';
}

function includesAny(values, excluded) {
  return values.some((value) => !excluded.includes(value));
}

function calculateScore() {
  let score = 0;
  const moved = getRadioValue('moved_to_uk');
  const bankAccounts = getRadioValue('indian_bank_accounts');
  const accountTypes = getCheckedValues('account_types');
  const nroNre = getRadioValue('nre_nro_understanding');
  const brokers = getCheckedValues('demat_brokers');
  const dematConversion = getRadioValue('demat_conversion');
  const funds = getRadioValue('mutual_funds_sips');
  const taxDocs = getCheckedValues('tax_documents');
  const family = getRadioValue('family_finance');
  const reason = getRadioValue('biggest_reason');

  if (moved === '1–2 years ago') score += 6;
  if (moved === '2–5 years ago') score += 8;
  if (moved === 'More than 5 years ago') score += 10;

  if (bankAccounts === 'Yes') score += 5;
  if (bankAccounts === 'Not sure / inactive old accounts') score += 8;
  if (accountTypes.includes('Resident savings account')) score += 10;

  if (nroNre === 'Somewhat') score += 4;
  if (nroNre === 'No') score += 8;

  if (includesAny(brokers, ['None'])) score += 8;
  if (dematConversion === 'No') score += 10;
  if (dematConversion === 'In progress') score += 5;
  if (dematConversion === 'Not sure') score += 10;

  if (funds === 'Yes, mutual funds and SIPs') score += 10;
  if (funds === 'Yes, mutual funds only') score += 7;
  if (funds === 'Yes, SIPs only') score += 8;
  if (funds === 'Not sure') score += 5;

  if (taxDocs.includes('None of these')) score += 10;
  if (taxDocs.includes('Not sure')) score += 8;

  if (family === 'Yes, regularly') score += 5;
  if (family === 'Sometimes') score += 3;
  if (family === 'Not sure') score += 4;

  if (reason === 'Demat/broker account confusion') score += 10;
  if (reason === 'NRE/NRO confusion') score += 8;
  if (reason === 'Mutual funds/SIPs confusion') score += 8;
  if (reason === 'UK tax/accountant questions') score += 8;
  if (reason === 'I am not sure, but I feel something may be messy') score += 8;

  return Math.min(score, 100);
}

function getBand(score) {
  if (score <= 25) return 'Low admin complexity';
  if (score <= 50) return 'Moderate admin complexity';
  if (score <= 75) return 'High admin complexity';
  return 'Very high admin complexity';
}

function getRecommendedProduct(score) {
  if (score <= 25) return 'Free NRI Money Mess Score';
  if (score <= 50) return '£20 Beta Mini Cleanup';
  if (score <= 75) return '£49 Founder Beta Full Audit';
  if (score <= 90) return '£99 Full NRI Cleanup';
  return '£199 Family + Investment Cleanup';
}

function getSafeExplanation(score) {
  if (score <= 25) {
    return 'Your India-side financial admin appears relatively simple based on your answers. This is only an admin complexity score, not a compliance, tax, legal, investment, accounting, or financial advice assessment.';
  }
  if (score <= 50) {
    return 'You appear to have a few areas worth organising, especially around documents, account status, or CA/accountant handoff. This does not mean something is wrong; it only shows admin complexity.';
  }
  if (score <= 75) {
    return 'Your India-side financial admin appears scattered enough to justify a structured cleanup. This is not tax, legal, investment, accounting, or financial advice.';
  }
  return 'Your answers suggest a high level of India-side financial admin complexity. A fuller cleanup may help you prioritise what to organise and what to ask qualified professionals. This does not determine compliance or tax liability.';
}

function buildSummary(score, band, product, explanation) {
  const accountTypes = getCheckedValues('account_types').join(', ') || 'Not provided';
  const brokers = getCheckedValues('demat_brokers').join(', ') || 'Not provided';
  const taxDocs = getCheckedValues('tax_documents').join(', ') || 'Not provided';

  return `NRI Financial Cleanup Intake Summary\n\nName: ${getTextValue('full_name')}\nEmail: ${getTextValue('email')}\nWhatsApp: ${getTextValue('whatsapp')}\n\nSelected option: ${getRadioValue('selected_option')}\nUK status: ${getRadioValue('uk_status')}\nMoved to UK: ${getRadioValue('moved_to_uk')}\nBiggest reason: ${getRadioValue('biggest_reason')}\nBiggest worry: ${getTextValue('biggest_worry')}\n\nIndian bank accounts: ${getRadioValue('indian_bank_accounts')}\nAccount types: ${accountTypes}\nNRE/NRO understanding: ${getRadioValue('nre_nro_understanding')}\nDemat/broker accounts: ${brokers}\nDemat converted to NRI status: ${getRadioValue('demat_conversion')}\nMutual funds/SIPs: ${getRadioValue('mutual_funds_sips')}\nIndia tax/investment documents: ${taxDocs}\nFamily finance: ${getRadioValue('family_finance')}\n\nMoney Mess Score: ${score}/100\nScore band: ${band}\nRecommended product: ${product}\n\nSafe explanation: ${explanation}\n\nImportant: This is an admin complexity score only. It is not investment advice, tax advice, legal advice, accounting advice, financial advice, tax filing, or a compliance guarantee.`;
}

function updateShareLinks(summary) {
  const emailSubject = encodeURIComponent('NRI Financial Cleanup Intake Summary');
  const emailBody = encodeURIComponent(summary);
  emailLink.href = `mailto:${OWNER_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

  const whatsappText = encodeURIComponent(summary);
  if (OWNER_WHATSAPP.startsWith('[')) {
    whatsappLink.href = `https://wa.me/?text=${whatsappText}`;
    whatsappLink.textContent = 'Share on WhatsApp';
  } else {
    whatsappLink.href = `https://wa.me/${OWNER_WHATSAPP}?text=${whatsappText}`;
    whatsappLink.textContent = 'WhatsApp me the summary';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const score = calculateScore();
  const band = getBand(score);
  const product = getRecommendedProduct(score);
  const explanation = getSafeExplanation(score);
  const summary = buildSummary(score, band, product, explanation);

  scoreValue.textContent = `${score}/100`;
  scoreBand.textContent = band;
  recommendedProduct.textContent = product;
  safeExplanation.textContent = explanation;
  summaryOutput.textContent = summary;
  updateShareLinks(summary);
  resultCard.classList.add('visible');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

copyButton.addEventListener('click', async () => {
  const text = summaryOutput.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'Summary copied. You can paste it into WhatsApp, email, or your CRM.';
  } catch (error) {
    copyStatus.textContent = 'Copy failed. Select the summary text manually and copy it.';
  }
});