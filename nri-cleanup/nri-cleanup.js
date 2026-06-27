const OWNER_EMAIL = 'nakshatrapardeshi@gmail.com';
const OWNER_WHATSAPP = '919881553633';

const form = document.querySelector('#nri-intake-form');
const resultCard = document.querySelector('#result-card');
const scoreValue = document.querySelector('#score-value');
const scoreGauge = document.querySelector('#score-gauge');
const scoreGaugeBand = document.querySelector('#score-gauge-band');
const scoreBand = document.querySelector('#score-band');
const recommendedProduct = document.querySelector('#recommended-product');
const safeExplanation = document.querySelector('#safe-explanation');
const summaryOutput = document.querySelector('#summary-output');
const copyButton = document.querySelector('#copy-summary');
const emailLink = document.querySelector('#email-summary');
const whatsappLink = document.querySelector('#whatsapp-summary');
const copyStatus = document.querySelector('#copy-status');

const formError = document.createElement('div');
formError.className = 'form-error';
formError.setAttribute('role', 'alert');
formError.setAttribute('aria-live', 'polite');
formError.hidden = true;
formError.style.cssText = 'margin:0 0 1rem;padding:1rem;border:1px solid rgba(200,132,47,.45);border-radius:16px;background:#fff3d6;color:#6a4616;font-weight:700;';
form.prepend(formError);

const accountTypeField = form.querySelector('input[name="account_types"]')?.closest('.field');
const dematConversionField = form.querySelector('input[name="demat_conversion"]')?.closest('.field');

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

function setGroupExclusive(name, exclusiveValues) {
  const inputs = [...form.querySelectorAll(`input[name="${name}"]`)];

  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;

      if (exclusiveValues.includes(input.value)) {
        inputs.forEach((other) => {
          if (other !== input) other.checked = false;
        });
        return;
      }

      inputs.forEach((other) => {
        if (exclusiveValues.includes(other.value)) other.checked = false;
      });
    });
  });
}

function isAccountTypeVisible() {
  const bankAccounts = getRadioValue('indian_bank_accounts');
  return bankAccounts === 'Yes' || bankAccounts === 'Not sure / inactive old accounts';
}

function shouldShowDematConversion() {
  const brokers = getCheckedValues('demat_brokers');
  return brokers.length > 0 && !(brokers.length === 1 && brokers[0] === 'None');
}

function setRadioValue(name, value) {
  form.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = input.value === value;
  });
}

function clearCheckboxGroup(name) {
  form.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = false;
  });
}

function updateConditionalFields() {
  if (accountTypeField) {
    const showAccountTypes = isAccountTypeVisible();
    accountTypeField.hidden = !showAccountTypes;
    accountTypeField.setAttribute('aria-hidden', String(!showAccountTypes));

    if (!showAccountTypes) {
      clearCheckboxGroup('account_types');
    }
  }

  if (dematConversionField) {
    const showDematConversion = shouldShowDematConversion();
    dematConversionField.hidden = !showDematConversion;
    dematConversionField.setAttribute('aria-hidden', String(!showDematConversion));

    form.querySelectorAll('input[name="demat_conversion"]').forEach((input) => {
      input.required = showDematConversion && input.value === 'Yes';
    });

    if (!showDematConversion) {
      setRadioValue('demat_conversion', 'Not applicable');
    } else if (getRadioValue('demat_conversion') === 'Not applicable') {
      setRadioValue('demat_conversion', '');
    }
  }
}

function showFormError(message) {
  formError.textContent = message;
  formError.hidden = false;
  formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearFormError() {
  formError.textContent = '';
  formError.hidden = true;
}

function validateCustomGroups() {
  updateConditionalFields();

  if (isAccountTypeVisible() && getCheckedValues('account_types').length === 0) {
    showFormError('Please select at least one Indian bank account type, or choose “Not sure” / “None”.');
    accountTypeField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  if (getCheckedValues('demat_brokers').length === 0) {
    showFormError('Please select at least one demat/broker option, or choose “None” / “Not sure”.');
    form.querySelector('input[name="demat_brokers"]')?.closest('.field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  if (getCheckedValues('tax_documents').length === 0) {
    showFormError('Please select at least one tax/investment document option, or choose “None of these” / “Not sure”.');
    form.querySelector('input[name="tax_documents"]')?.closest('.field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  clearFormError();
  return true;
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

function getBandColor(score) {
  if (score <= 25) return '#0f6b4f';
  if (score <= 50) return '#9b7a33';
  if (score <= 75) return '#a86833';
  return '#8f3f38';
}

function updateScoreGauge(score, band) {
  if (!scoreGauge) return;
  const angle = Math.max(0, Math.min(score, 100)) * 3.6;
  scoreGauge.style.setProperty('--score-angle', `${angle}deg`);
  scoreGauge.style.setProperty('--score-color', getBandColor(score));
  scoreGauge.setAttribute('aria-label', `Money Mess Score ${score} out of 100. ${band}. Based only on your answers. Admin complexity score only.`);
  if (scoreGaugeBand) scoreGaugeBand.textContent = band.replace(' admin complexity', '');
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

function getAccountTypesSummary() {
  if (!isAccountTypeVisible()) return 'Not applicable';
  return getCheckedValues('account_types').join(', ') || 'Not provided';
}

function getDematConversionSummary() {
  if (!shouldShowDematConversion()) return 'Not applicable';
  return getRadioValue('demat_conversion') || 'Not provided';
}

function buildSummary(score, band, product, explanation) {
  const brokers = getCheckedValues('demat_brokers').join(', ') || 'Not provided';
  const taxDocs = getCheckedValues('tax_documents').join(', ') || 'Not provided';

  return `NRI Financial Cleanup Intake Summary\n\nName: ${getTextValue('full_name')}\nEmail: ${getTextValue('email')}\nWhatsApp: ${getTextValue('whatsapp')}\n\nSelected option: ${getRadioValue('selected_option')}\nUK status: ${getRadioValue('uk_status')}\nMoved to UK: ${getRadioValue('moved_to_uk')}\nBiggest reason: ${getRadioValue('biggest_reason')}\nBiggest worry: ${getTextValue('biggest_worry')}\n\nIndian bank accounts: ${getRadioValue('indian_bank_accounts')}\nAccount types: ${getAccountTypesSummary()}\nNRE/NRO understanding: ${getRadioValue('nre_nro_understanding')}\nDemat/broker accounts: ${brokers}\nDemat converted to NRI status: ${getDematConversionSummary()}\nMutual funds/SIPs: ${getRadioValue('mutual_funds_sips')}\nIndia tax/investment documents: ${taxDocs}\nFamily finance: ${getRadioValue('family_finance')}\n\nMoney Mess Score: ${score}/100\nScore band: ${band}\nRecommended product: ${product}\n\nSafe explanation: ${explanation}\n\nImportant: This is an admin complexity score only. It is not investment advice, tax advice, legal advice, accounting advice, financial advice, tax filing, or a compliance guarantee.`;
}

function buildWhatsAppSummary(score, band, product) {
  return `NRI Cleanup Intake\n\nName: ${getTextValue('full_name')}\nSelected option: ${getRadioValue('selected_option')}\nMoney Mess Score: ${score}/100\nScore band: ${band}\nRecommended product: ${product}\nBiggest worry: ${getTextValue('biggest_worry')}`;
}

function updateShareLinks(summary, whatsappSummary) {
  const emailSubject = encodeURIComponent('NRI Financial Cleanup Intake Summary');
  const emailBody = encodeURIComponent(summary);
  emailLink.href = `mailto:${OWNER_EMAIL}?subject=${emailSubject}&body=${emailBody}`;

  const whatsappText = encodeURIComponent(whatsappSummary);
  if (OWNER_WHATSAPP.startsWith('[')) {
    whatsappLink.href = `https://wa.me/?text=${whatsappText}`;
    whatsappLink.textContent = 'Share on WhatsApp';
  } else {
    whatsappLink.href = `https://wa.me/${OWNER_WHATSAPP}?text=${whatsappText}`;
    whatsappLink.textContent = 'WhatsApp me the summary';
  }
}

setGroupExclusive('account_types', ['None', 'Not sure']);
setGroupExclusive('demat_brokers', ['None', 'Not sure']);
setGroupExclusive('tax_documents', ['None of these', 'Not sure']);

form.querySelectorAll('input[name="indian_bank_accounts"], input[name="demat_brokers"]').forEach((input) => {
  input.addEventListener('change', updateConditionalFields);
});

form.addEventListener('change', () => {
  clearFormError();
});

updateConditionalFields();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateConditionalFields();

  if (!validateCustomGroups()) return;

  if (!form.checkValidity()) {
    showFormError('Please complete all required fields before calculating your Money Mess Score.');
    form.reportValidity();
    return;
  }

  const score = calculateScore();
  const band = getBand(score);
  const product = getRecommendedProduct(score);
  const explanation = getSafeExplanation(score);
  const summary = buildSummary(score, band, product, explanation);
  const whatsappSummary = buildWhatsAppSummary(score, band, product);

  scoreValue.textContent = score;
  updateScoreGauge(score, band);
  scoreBand.textContent = band;
  recommendedProduct.textContent = product;
  safeExplanation.textContent = explanation;
  summaryOutput.textContent = summary;
  updateShareLinks(summary, whatsappSummary);
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