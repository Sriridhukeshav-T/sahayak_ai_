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

// Common Indian number parsing helper (e.g. 1.2 lakh, 50k, 5,00,000, 3.2 L, etc.)
export function parseIndianAmount(text: string): number | null {
  const clean = text.toLowerCase().replace(/,/g, '').trim();

  // Pattern: X lakh or X.Y lakh or X lac or X L
  const lakhMatch = clean.match(/([\d.]+)\s*(?:lakh|lakhs|lac|lacs|l)\b/);
  if (lakhMatch) {
    const num = parseFloat(lakhMatch[1]);
    if (!isNaN(num)) return Math.round(num * 100000);
  }

  // Pattern: X k or X thousand
  const thousandMatch = clean.match(/([\d.]+)\s*(?:thousand|k)\b/);
  if (thousandMatch) {
    const num = parseFloat(thousandMatch[1]);
    if (!isNaN(num)) return Math.round(num * 1000);
  }

  // Pattern: X crore or X cr
  const croreMatch = clean.match(/([\d.]+)\s*(?:crore|crores|cr)\b/);
  if (croreMatch) {
    const num = parseFloat(croreMatch[1]);
    if (!isNaN(num)) return Math.round(num * 10000000);
  }

  // Plain digits (e.g. 120000 or ₹120000)
  const plainMatch = clean.match(/(?:rs\.?|inr|₹)?\s*(\d{4,9})/);
  if (plainMatch) {
    const num = parseInt(plainMatch[1], 10);
    if (!isNaN(num)) return num;
  }

  return null;
}

export function extractGoalFromNaturalLanguage(input: string): ExtractedGoalTokens {
  const lower = input.toLowerCase();

  // 1. Detect Project Type
  let projectType = 'Micro Enterprise';
  if (lower.includes('tailor') || lower.includes('sewing') || lower.includes('boutique') || lower.includes('garment') || lower.includes('stitching') || lower.includes('dressmaker')) {
    projectType = 'Tailoring';
  } else if (lower.includes('tractor') || lower.includes('harvester') || lower.includes('custom hire') || lower.includes('rotavator') || lower.includes('sprayer') || lower.includes('farm implement')) {
    projectType = 'Agricultural Equipment';
  } else if (lower.includes('education') || lower.includes('m.tech') || lower.includes('b.tech') || lower.includes('degree') || lower.includes('college') || lower.includes('fees') || lower.includes('university') || lower.includes('mbbs')) {
    projectType = 'Higher Education';
  } else if (lower.includes('dairy') || lower.includes('cow') || lower.includes('buffalo') || lower.includes('cattle') || lower.includes('milch') || lower.includes('milk')) {
    projectType = 'Dairy Farming';
  } else if (lower.includes('weave') || lower.includes('loom') || lower.includes('handloom') || lower.includes('khadi') || lower.includes('saree')) {
    projectType = 'Handloom Weaving';
  } else if (lower.includes('potter') || lower.includes('clay') || lower.includes('terracotta')) {
    projectType = 'Pottery';
  } else if (lower.includes('solar') || lower.includes('renewable') || lower.includes('pv panel')) {
    projectType = 'Solar Micro-Grid';
  } else if (lower.includes('auto') || lower.includes('e-rickshaw') || lower.includes('three wheeler') || lower.includes('electric auto')) {
    projectType = 'Electric Auto';
  } else if (lower.includes('food') || lower.includes('spice') || lower.includes('bakery') || lower.includes('flour mill') || lower.includes('chips')) {
    projectType = 'Food Processing';
  } else if (lower.includes('shop') || lower.includes('retail') || lower.includes('kirana') || lower.includes('store')) {
    projectType = 'Retail Shop';
  }

  // 2. Detect Purpose / Goal
  let purpose = 'Start a business';
  if (lower.includes('expand') || lower.includes('grow') || lower.includes('scale')) {
    purpose = 'Expand existing business';
  } else if (lower.includes('study') || lower.includes('college') || lower.includes('degree') || lower.includes('course') || lower.includes('education')) {
    purpose = 'Higher education';
  } else if (lower.includes('farm') || lower.includes('crop') || lower.includes('agriculture')) {
    purpose = 'Agricultural enterprise';
  } else if (lower.includes('start') || lower.includes('new shop') || lower.includes('open')) {
    purpose = 'Start a business';
  }

  // 3. Extract Loan Amount
  let loanRequirement = 120000;
  // Look for phrases like "need 1.2 lakh", "require 6 lakh", "loan of 3 lakh", "need ₹1,20,000"
  const loanContextMatch = lower.match(/(?:need|require|requirement|want|loan\s*of|borrow)\s*([^\.,;]+)/);
  if (loanContextMatch) {
    const parsed = parseIndianAmount(loanContextMatch[1]);
    if (parsed) loanRequirement = parsed;
  } else {
    // Fallback search any amount in sentence
    const anyAmt = parseIndianAmount(lower);
    if (anyAmt) loanRequirement = anyAmt;
  }

  // 4. Extract Annual Income
  let income = 320000;
  const incomeContextMatch = lower.match(/(?:earn|income|salary|make|revenue|family\s*income|annual)\s*(?:is|about|around|of)?\s*([^\.,;]+)/);
  if (incomeContextMatch) {
    const parsed = parseIndianAmount(incomeContextMatch[1]);
    if (parsed) income = parsed;
  }

  // Project cost estimate (defaults to 1.25x loan requirement if not explicitly given)
  const projectCost = Math.round(loanRequirement * 1.25);

  // Confidence heuristic
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

// Sample Voice Prompts for quick one-click voice testing
export const SAMPLE_VOICE_PROMPTS = [
  'I want to start a small tailoring shop. I need ₹1.2 lakh and my annual family income is ₹3.2 lakh.',
  'I want to purchase agricultural equipment for custom hiring in Thanjavur. I need ₹6 lakh loan and our annual income is ₹4.2 lakh.',
  'I am looking for an education loan of ₹6 lakh for M.Tech biotechnology. Annual family income is ₹2.8 lakh.',
  'I need a micro-loan of ₹50,000 to set up a vegetable and fruit vending stall.',
  'We are a women SHG planning to start an organic spice grinding unit needing ₹2.5 lakh credit.'
];
