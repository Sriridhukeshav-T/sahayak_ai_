export interface ExtractedGoalTokens {
  rawInput: string;
  projectType: string;
  purpose: string;
  loanRequirement: number;
  projectCost: number;
  income: number;
  state?: string;
  district?: string;
  confidenceScore: number;
  extractedFields: {
    label: string;
    value: string;
    key: string;
  }[];
}

// Common Indian number parsing helper (supports English, Hindi, Tamil, Malayalam terms)
export function parseIndianAmount(text: string): number | null {
  const clean = text.toLowerCase().replace(/,/g, '').trim();

  // Pattern: X lakh / लाख / लख / லட்சம் / ലക്ഷം
  const lakhMatch = clean.match(/([\d.]+)\s*(?:lakh|lakhs|lac|lacs|l|लाख|लख|லட்சம்|லட்சங்கள்|ലക്ഷം)\b/i);
  if (lakhMatch) {
    const num = parseFloat(lakhMatch[1]);
    if (!isNaN(num)) return Math.round(num * 100000);
  }

  // Words for 1, 1.2, 2, 5 lakh directly in devanagari/indic
  if (clean.includes('1.2 लाख') || clean.includes('1.2 லட்சம்') || clean.includes('1.2 ലക്ഷം')) return 120000;
  if (clean.includes('1 लाख') || clean.includes('1 லட்சம்') || clean.includes('1 ലക്ഷം') || clean.includes('ഒരു ലക്ഷം') || clean.includes('ஒரு லட்சம்') || clean.includes('एक लाख')) return 100000;
  if (clean.includes('2 लाख') || clean.includes('2 லட்சம்') || clean.includes('2 ലക്ഷം')) return 200000;
  if (clean.includes('6 लाख') || clean.includes('6 லட்சம்') || clean.includes('6 ലക്ഷം')) return 600000;
  if (clean.includes('50 हज़ार') || clean.includes('50 हजार') || clean.includes('50 ஆயிரம்') || clean.includes('50 ആയിരം')) return 50000;

  // Pattern: X k or X thousand / हज़ार / ஆயிரம் / ആയിരം
  const thousandMatch = clean.match(/([\d.]+)\s*(?:thousand|k|हज़ार|हजार|ஆயிரம்|ആയിരം)\b/i);
  if (thousandMatch) {
    const num = parseFloat(thousandMatch[1]);
    if (!isNaN(num)) return Math.round(num * 1000);
  }

  // Pattern: X crore / करोड़ / கோடி / കോടി
  const croreMatch = clean.match(/([\d.]+)\s*(?:crore|crores|cr|करोड़|கோடி|കോടി)\b/i);
  if (croreMatch) {
    const num = parseFloat(croreMatch[1]);
    if (!isNaN(num)) return Math.round(num * 10000000);
  }

  // Plain digits (e.g. 120000 or ₹120000)
  const plainMatch = clean.match(/(?:rs\.?|inr|₹|रु|ரூ|രൂ)?\s*(\d{4,9})/i);
  if (plainMatch) {
    const num = parseInt(plainMatch[1], 10);
    if (!isNaN(num)) return num;
  }

  return null;
}

export function extractGoalFromNaturalLanguage(input: string): ExtractedGoalTokens {
  const lower = input.toLowerCase();

  // 1. Detect Project Type (Multilingual: EN, HI, TA, ML)
  let projectType = 'Micro Enterprise';
  if (
    lower.includes('tailor') || lower.includes('sewing') || lower.includes('boutique') ||
    lower.includes('garment') || lower.includes('stitching') || lower.includes('dressmaker') ||
    lower.includes('सिलाई') || lower.includes('दर्जी') || lower.includes('कपड़ा') ||
    lower.includes('தையல்') || lower.includes('ஆடை') || lower.includes('துணி') ||
    lower.includes('തയ്യൽ') || lower.includes('വസ്ത്രം')
  ) {
    projectType = 'Tailoring';
  } else if (
    lower.includes('tractor') || lower.includes('harvester') || lower.includes('custom hire') ||
    lower.includes('rotavator') || lower.includes('sprayer') || lower.includes('farm implement') ||
    lower.includes('कृषि') || lower.includes('खेती') || lower.includes('ट्रैक्टर') || lower.includes('उपकरण') ||
    lower.includes('விவசாயம்') || lower.includes('டிராக்டர்') || lower.includes('உபகரணம்') ||
    lower.includes('കൃഷി') || lower.includes('ട്രാക്ടർ') || lower.includes('ഉപകരണങ്ങൾ')
  ) {
    projectType = 'Agricultural Equipment';
  } else if (
    lower.includes('education') || lower.includes('m.tech') || lower.includes('b.tech') ||
    lower.includes('degree') || lower.includes('college') || lower.includes('fees') ||
    lower.includes('university') || lower.includes('mbbs') || lower.includes('study') ||
    lower.includes('शिक्षा') || lower.includes('पढ़ाई') || lower.includes('कॉलेज') ||
    lower.includes('கல்வி') || lower.includes('கல்லூரி') ||
    lower.includes('വിദ്യാഭ്യാസം') || lower.includes('കോളേജ്')
  ) {
    projectType = 'Higher Education';
  } else if (
    lower.includes('dairy') || lower.includes('cow') || lower.includes('buffalo') ||
    lower.includes('cattle') || lower.includes('milch') || lower.includes('milk') ||
    lower.includes('डेयरी') || lower.includes('दूध') || lower.includes('गाय') ||
    lower.includes('பால்பண்ணை') || lower.includes('மாடு') || lower.includes('பால்') ||
    lower.includes('ക്ഷീര') || lower.includes('പശു') || lower.includes('പാൽ')
  ) {
    projectType = 'Dairy Farming';
  } else if (
    lower.includes('weave') || lower.includes('loom') || lower.includes('handloom') ||
    lower.includes('khadi') || lower.includes('saree') || lower.includes('हथकरघा') ||
    lower.includes('கைத்தறி') || lower.includes('കൈത്തറി')
  ) {
    projectType = 'Handloom Weaving';
  } else if (
    lower.includes('potter') || lower.includes('clay') || lower.includes('terracotta') ||
    lower.includes('मिट्टी') || lower.includes('மண்பாண்ட') || lower.includes('മൺപാത്ര')
  ) {
    projectType = 'Pottery';
  } else if (
    lower.includes('solar') || lower.includes('renewable') || lower.includes('pv panel') ||
    lower.includes('सौर') || lower.includes('சூரிய') || lower.includes('സൗരോർജ്ജ')
  ) {
    projectType = 'Solar Micro-Grid';
  } else if (
    lower.includes('auto') || lower.includes('e-rickshaw') || lower.includes('three wheeler') ||
    lower.includes('electric auto') || lower.includes('रिक्शा') || lower.includes('ஆட்டோ') ||
    lower.includes('ഓട്ടോ')
  ) {
    projectType = 'Electric Auto';
  } else if (
    lower.includes('food') || lower.includes('spice') || lower.includes('bakery') ||
    lower.includes('flour mill') || lower.includes('chips') || lower.includes('मसाला') ||
    lower.includes('உணவு') || lower.includes('மசாலா') || lower.includes('ഭക്ഷണ')
  ) {
    projectType = 'Food Processing';
  } else if (
    lower.includes('shop') || lower.includes('retail') || lower.includes('kirana') ||
    lower.includes('store') || lower.includes('दुकान') || lower.includes('किराना') ||
    lower.includes('கடை') || lower.includes('மளிகை') || lower.includes('കട')
  ) {
    projectType = 'Retail Shop';
  }

  // 2. Detect Purpose / Goal
  let purpose = 'Start a business';
  if (lower.includes('expand') || lower.includes('grow') || lower.includes('scale') || lower.includes('बढ़ाना') || lower.includes('विस्तार') || lower.includes('விரிவுபடுத்த') || lower.includes('വ്യാപിപ്പിക്കുക')) {
    purpose = 'Expand existing business';
  } else if (lower.includes('study') || lower.includes('college') || lower.includes('degree') || lower.includes('course') || lower.includes('education') || lower.includes('पढ़ाई') || lower.includes('கல்வி') || lower.includes('വിദ്യാഭ്യാസം')) {
    purpose = 'Higher education';
  } else if (lower.includes('farm') || lower.includes('crop') || lower.includes('agriculture') || lower.includes('खेती') || lower.includes('விவசாயம்') || lower.includes('കൃഷി')) {
    purpose = 'Agricultural enterprise';
  } else if (lower.includes('start') || lower.includes('new shop') || lower.includes('open') || lower.includes('शुरू') || lower.includes('புதிய') || lower.includes('തുടങ്ങാൻ')) {
    purpose = 'Start a business';
  }

  // 3. Extract Loan Amount
  let loanRequirement = 120000;
  const loanContextMatch = lower.match(/(?:need|require|requirement|want|loan\s*of|borrow|ऋण|लोन|கடன்|വായ്പ)\s*([^\.,;]+)/i);
  if (loanContextMatch) {
    const parsed = parseIndianAmount(loanContextMatch[1]);
    if (parsed) loanRequirement = parsed;
  } else {
    const anyAmt = parseIndianAmount(lower);
    if (anyAmt) loanRequirement = anyAmt;
  }

  // 4. Extract Annual Income
  let income = 320000;
  const incomeContextMatch = lower.match(/(?:earn|income|salary|make|revenue|family\s*income|annual|आय|வருமானம்|വരുമാനം)\s*(?:is|about|around|of|है|ആണ്)?\s*([^\.,;]+)/i);
  if (incomeContextMatch) {
    const parsed = parseIndianAmount(incomeContextMatch[1]);
    if (parsed) income = parsed;
  }

  // Project cost estimate (defaults to 1.25x loan requirement)
  const projectCost = Math.round(loanRequirement * 1.25);

  let confidence = 85;
  if (projectType !== 'Micro Enterprise') confidence += 5;
  if (loanRequirement !== 120000) confidence += 5;

  const extractedFields = [
    { label: 'Project Type', value: projectType, key: 'projectType' },
    { label: 'Primary Goal', value: purpose, key: 'purpose' },
    { label: 'Loan Requirement', value: `₹${loanRequirement.toLocaleString('en-IN')}`, key: 'loanRequirement' },
    { label: 'Estimated Project Cost', value: `₹${projectCost.toLocaleString('en-IN')}`, key: 'projectCost' },
    { label: 'Annual Income', value: `₹${income.toLocaleString('en-IN')}`, key: 'income' }
  ];

  return {
    rawInput: input,
    projectType,
    purpose,
    loanRequirement,
    projectCost,
    income,
    confidenceScore: Math.min(98, confidence),
    extractedFields
  };
}

// Multilingual Sample Voice Prompts by Language
export const SAMPLE_VOICE_PROMPTS_BY_LANG: Record<string, string[]> = {
  en: [
    'I want to start a small tailoring shop. I need ₹1.2 lakh and my annual family income is ₹3.2 lakh.',
    'I want to purchase agricultural equipment for custom hiring in Thanjavur. I need ₹6 lakh loan and our annual income is ₹4.2 lakh.',
    'I am looking for an education loan of ₹6 lakh for M.Tech biotechnology. Annual family income is ₹2.8 lakh.',
    'I need a micro-loan of ₹50,000 to set up a vegetable and fruit vending stall.',
    'We are a women SHG planning to start an organic spice grinding unit needing ₹2.5 lakh credit.'
  ],
  hi: [
    'मैं सिलाई और बुटीक की छोटी दुकान शुरू करना चाहती हूँ। मुझे ₹1.2 लाख ऋण चाहिए और पारिवारिक आय ₹3.2 लाख है।',
    'मुझे कस्टम हायरिंग के लिए कृषि उपकरण खरीदने हेतु ₹6 लाख का ऋण चाहिए और हमारी वार्षिक आय ₹4.2 लाख है।',
    'एम.टेक बायोटेक्नोलॉजी की पढ़ाई के लिए ₹6 लाख के शिक्षा ऋण की आवश्यकता है। वार्षिक आय ₹2.8 लाख है।',
    'सब्जी और फल की दुकान लगाने के लिए ₹50,000 का माइक्रो लोन चाहिए।',
    'हमारा महिला स्वयं सहायता समूह मसाला उद्योग शुरू करने हेतु ₹2.5 लाख ऋण चाहता है।'
  ],
  ta: [
    'நான் ஒரு சிறிய தையல் கடை தொடங்க விரும்புகிறேன். எனக்கு ₹1.2 லட்சம் கடன் தேவை, எனது குடும்ப ஆண்டு வருமானம் ₹3.2 லட்சம்.',
    'விவசாய உபகரணங்கள் வாங்குவதற்காக ₹6 லட்சம் கடன் தேவை, எங்கள் குடும்ப ஆண்டு வருமானம் ₹4.2 லட்சம்.',
    'எம்.டெக் பயோடெக்னாலஜி படிப்புக்காக ₹6 லட்சம் கல்வி கடன் தேவைப்படுகிறது. குடும்ப வருமானம் ₹2.8 லட்சம்.',
    'காய்கறி கடை அமைக்க எனக்கு ₹50,000 குறுங்கடன் தேவை.',
    'சுய உதவிக் குழு சார்பாக மசாலா பொடி தயாரிக்கும் தொழில் தொடங்க ₹2.5 லட்சம் கடன் தேவை.'
  ],
  ml: [
    'എനിക്ക് ഒരു ചെറിയ തയ്യൽ കട തുടങ്ങാൻ ആഗ്രഹമുണ്ട്. ₹1.2 ലക്ഷം വായ്പ ആവശ്യമുണ്ട്, കുടുംബ വാർഷിക വരുമാനം ₹3.2 ലക്ഷമാണ്.',
    'കാർഷിക ഉപകരണങ്ങൾ വാങ്ങുന്നതിനായി ₹6 ലക്ഷം വായ്പ ആവശ്യമുണ്ട്, കുടുംബ വാർഷിക വരുമാനം ₹4.2 ലക്ഷമാണ്.',
    'ഉപരിപഠനത്തിനായി ₹6 ലക്ഷം വിദ്യാഭ്യാസ വായ്പ ആവശ്യമുണ്ട്, കുടുംബ വാർഷിക വരുമാനം ₹2.8 ലക്ഷമാണ്.',
    'പച്ചക്കറി കട ആരംഭിക്കാൻ ₹50,000 മൈക്രോ ലോൺ വേണം.',
    'വനിതാ സ്വയംസഹായ സംഘത്തിന് സുഗന്ധവ്യഞ്ജന യൂണിറ്റ് ആരംഭിക്കാൻ ₹2.5 ലക്ഷം വായ്പ വേണം.'
  ]
};

export const SAMPLE_VOICE_PROMPTS = SAMPLE_VOICE_PROMPTS_BY_LANG.en;
