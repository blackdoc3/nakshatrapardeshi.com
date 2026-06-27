const OWNER_EMAIL = 'nakshatrapardeshi@gmail.com';
const OWNER_WHATSAPP = '919881553633';
const isAndroidAppMode = new URLSearchParams(window.location.search).get('app') === 'android';

if (isAndroidAppMode) {
  document.body.classList.add('android-app-mode');
}

const form = document.querySelector('#nri-intake-form');
const resultCard = document.querySelector('#result-card');
const scoreValue = document.querySelector('#score-value');
const scoreGauge = document.querySelector('#score-gauge');
const scoreDashboard = document.querySelector('.score-dashboard');
const scoreLegend = document.querySelector('.score-legend');
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
  if (score <= 25) return '#2f9e44';
  if (score <= 50) return '#d6a329';
  if (score <= 75) return '#e67e22';
  return '#c0392b';
}

function initialiseScoreSafetyCopy() {
  if (scoreDashboard && !document.querySelector('.score-safety-note')) {
    const note = document.createElement('p');
    note.className = 'privacy-note score-safety-note';
    note.textContent = 'Based only on your answers. This is an admin complexity score only. It is not tax, legal, investment, accounting, financial, or compliance advice.';
    scoreDashboard.insertAdjacentElement('afterend', note);
  }

  if (scoreLegend) {
    const labels = [
      '0–25 Low admin complexity',
      '26–50 Moderate admin complexity',
      '51–75 High admin complexity',
      '76–100 Very high admin complexity',
    ];

    scoreLegend.querySelectorAll('span').forEach((span, index) => {
      const icon = span.querySelector('i');
      span.replaceChildren(icon, document.createTextNode(labels[index] || ''));
    });
  }
}

function updateScoreGauge(score, band) {
  if (!scoreGauge) return;
  const angle = Math.max(0, Math.min(score, 100)) * 3.6;
  scoreGauge.style.setProperty('--score-angle', `${angle}deg`);
  scoreGauge.style.setProperty('--score-color', getBandColor(score));
  scoreGauge.setAttribute('aria-label', `Money Mess Score ${score} out of 100. ${band}. Based only on your answers. Admin complexity score only.`);
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

function loadAndroidAppModeStyles() {
  if (!isAndroidAppMode || document.querySelector('link[data-android-app-mode]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/nri-cleanup/nri-cleanup-app-mode.css';
  link.dataset.androidAppMode = 'true';
  document.head.append(link);
}

function syncAndroidSelectedChoices() {
  if (!isAndroidAppMode) return;
  form.querySelectorAll('.choice').forEach((choice) => {
    const input = choice.querySelector('input');
    choice.classList.toggle('is-selected', Boolean(input?.checked));
  });
}

function scrollToTarget(target) {
  const element = document.querySelector(target);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initialiseAndroidAppMode() {
  if (!isAndroidAppMode) return;

  loadAndroidAppModeStyles();

  const firstHeroButton = document.querySelector('.hero-actions .button.primary');
  if (firstHeroButton) {
    firstHeroButton.textContent = 'Start Free Score';
    firstHeroButton.setAttribute('aria-label', 'Start Free Money Mess Score');
  }

  const header = document.querySelector('.site-header');
  if (header && !document.querySelector('.app-progress')) {
    const progress = document.createElement('nav');
    progress.className = 'app-progress';
    progress.setAttribute('aria-label', 'NRI Cleanup Desk app journey');
    progress.innerHTML = `
      <div class="app-progress-track">
        <a class="app-step is-active" href="#top" data-step-target="top">Welcome</a>
        <a class="app-step" href="#value" data-step-target="value">What you get</a>
        <a class="app-step" href="#options" data-step-target="options">Options</a>
        <a class="app-step" href="#intake" data-step-target="intake">Intake</a>
        <a class="app-step" href="#result-card" data-step-target="result-card">Result</a>
        <a class="app-step" href="#legal" data-step-target="legal">Legal</a>
      </div>`;
    header.insertAdjacentElement('afterend', progress);

    progress.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        scrollToTarget(link.getAttribute('href'));
      });
    });
  }

  if (!document.querySelector('.android-bottom-cta')) {
    const bottomBar = document.createElement('div');
    bottomBar.className = 'android-bottom-cta';
    bottomBar.innerHTML = `
      <div class="android-bottom-cta-inner">
        <div class="android-bottom-copy">
          <strong>Step 1 of 5</strong>
          <span>Free admin complexity score</span>
        </div>
        <a class="android-bottom-button" href="#intake">Start / Continue Intake</a>
      </div>`;
    document.body.append(bottomBar);

    bottomBar.querySelector('a')?.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToTarget('#intake');
    });
  }

  syncAndroidSelectedChoices();
  updateAndroidProgressState();

  const observedSections = ['top', 'value', 'options', 'intake', 'result-card', 'legal']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && observedSections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) updateAndroidProgressState(visible.target.id);
    }, { rootMargin: '-42% 0px -45% 0px', threshold: [0.1, 0.25, 0.5, 0.75] });

    observedSections.forEach((section) => observer.observe(section));
  }
}

function updateAndroidProgressState(activeId) {
  if (!isAndroidAppMode) return;
  const visibleResult = resultCard?.classList.contains('visible');
  const inferredId = activeId || (visibleResult ? 'result-card' : 'top');

  document.querySelectorAll('.app-step').forEach((step) => {
    step.classList.toggle('is-active', step.dataset.stepTarget === inferredId);
  });

  const stepMap = {
    top: ['Step 1 of 5', 'Free admin complexity score'],
    value: ['Step 2 of 5', 'See what you get'],
    options: ['Step 3 of 5', 'Choose your cleanup option'],
    intake: ['Step 4 of 5', 'Complete your intake'],
    'result-card': ['Step 5 of 5', 'Review and share summary'],
    legal: ['Legal', 'Service boundaries and privacy'],
  };

  const [label, helper] = stepMap[inferredId] || stepMap.top;
  const copy = document.querySelector('.android-bottom-copy');
  if (copy) {
    copy.querySelector('strong').textContent = label;
    copy.querySelector('span').textContent = helper;
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
  syncAndroidSelectedChoices();
});

initialiseScoreSafetyCopy();
updateConditionalFields();
initialiseAndroidAppMode();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateConditionalFields();
  syncAndroidSelectedChoices();

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
  updateAndroidProgressState('result-card');
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
