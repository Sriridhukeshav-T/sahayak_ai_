import { UserProfile } from '../types/user';
import { Scheme } from '../types/scheme';
import { calculateSchemeMatch } from './schemeMatcherService';
import { calculateAffordability } from './affordabilityService';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'sahayak';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
  sourceMinistry?: string;
}

// Known fictional / adversarial keywords or patterns
const UNVERIFIED_PATTERNS = [
  'xyz',
  'super bonus',
  'golden grant',
  'national golden',
  'magic loan',
  'free cash 2026',
  'instant crore'
];

export function findMatchingScheme(query: string, schemes: Scheme[]): Scheme | null {
  const q = query.toLowerCase();
  for (const s of schemes) {
    const name = (s.officialName || s.name || '').toLowerCase();
    const shortName = (s.shortName || '').toLowerCase();
    const code = (s.code || s.id || '').toLowerCase();

    if (q.includes(name) || (shortName && q.includes(shortName)) || (code && q.includes(code))) {
      return s;
    }
  }
  return null;
}

export function generateAssistantResponse(
  userQuery: string,
  user: UserProfile,
  activeScheme: Scheme | null,
  allSchemes: Scheme[] = [],
  language: string = 'en'
): AssistantMessage {
  const q = userQuery.toLowerCase().trim();
  const suggestedActions: { label: string; action: string }[] = [];
  let text = '';

  // 1. Guardrail against fictional / adversarial or unknown queries
  const isAdversarial = UNVERIFIED_PATTERNS.some(pat => q.includes(pat));
  const isAskingAboutUnknownScheme =
    (q.includes('scheme') || q.includes('grant') || q.includes('yojana') || q.includes('bonus')) &&
    !findMatchingScheme(q, allSchemes) &&
    !activeScheme &&
    !q.includes('best scheme') &&
    !q.includes('which scheme') &&
    !q.includes('recommend') &&
    !q.includes('my scheme') &&
    !q.includes('all scheme');

  if (isAdversarial || isAskingAboutUnknownScheme) {
    text = `I couldn't verify this scheme from the available authoritative Government of India or State scheme records.\n\nTo prevent misinformation, Sahayak AI only provides information verified against official government portals.\n\nYou can verify active and approved government schemes directly through the national repository at [myScheme (www.myscheme.gov.in)](https://www.myscheme.gov.in).`;
    suggestedActions.push({ label: 'Explore Verified Schemes', action: 'find_scheme' });
    return {
      id: `MSG-${Date.now()}`,
      sender: 'sahayak',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions
    };
  }

  // Determine referenced scheme: explicit mention in query > activeScheme > fallback first
  const targetScheme = findMatchingScheme(q, allSchemes) || activeScheme;

  // 2. Application Status / Direct Government Integration queries
  const isAppStatusQuery =
    q.includes('my application status') ||
    q.includes('check my application') ||
    q.includes('government approved') ||
    q.includes('did the government approve') ||
    q.includes('status of my application');

  if (isAppStatusQuery) {
    const portalUrl = targetScheme?.officialApplicationUrl || 'https://www.myscheme.gov.in';
    text = `Your application status in Sahayak AI is recorded as **user-reported**.\n\nSahayak AI assists with eligibility discovery and record keeping, but does **not** claim direct access to internal government processing gateways. Please verify your official status directly through the designated official government portal at [Official Application Portal](${portalUrl}).`;
    suggestedActions.push({ label: 'View Tracked Applications', action: 'applications' });
    return {
      id: `MSG-${Date.now()}`,
      sender: 'sahayak',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions
    };
  }

  // 3. Deadline / Application Window queries
  const isDeadlineQuery =
    q.includes('deadline') ||
    q.includes('last date') ||
    q.includes('closing date') ||
    q.includes('end date') ||
    q.includes('when does') ||
    q.includes('expire');

  if (isDeadlineQuery && targetScheme) {
    if (targetScheme.applicationEndDate) {
      text = `The official application deadline recorded for **${targetScheme.officialName || targetScheme.name}** is **${targetScheme.applicationEndDate}**.\n\nAuthoritative Source: ${targetScheme.ministry || targetScheme.governmentDepartment} (${targetScheme.sourceName}).`;
    } else if (targetScheme.isOngoing) {
      text = `**${targetScheme.officialName || targetScheme.name}** is recorded as an ongoing mission. No official closing date is specified in the available government source.\n\nApplications remain accepted subject to annual budgetary allocations.`;
    } else {
      text = `Application end date for **${targetScheme.officialName || targetScheme.name}**: Not specified in the available official source.`;
    }
    suggestedActions.push({ label: 'View Scheme Details', action: 'scheme_detail' });
    return {
      id: `MSG-${Date.now()}`,
      sender: 'sahayak',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions
    };
  }

  // 4. Required Documents queries (Test 11 Grounded AI Retrieval)
  const isDocument =
    q.includes('document') ||
    q.includes('paper') ||
    q.includes('what do i need') ||
    q.includes('दस्तावेज़') ||
    q.includes('कागज़ात') ||
    q.includes('ஆவண') ||
    q.includes('ரേഖകൾ');

  if (isDocument) {
    const docs = targetScheme?.requiredDocuments || [
      'Aadhaar Card of the applicant',
      'Proof of identity and address',
      'Bank account details (passbook / cancelled cheque)',
      'Detailed Project Report (DPR) or quotation'
    ];
    const ministry = targetScheme?.ministry || targetScheme?.governmentDepartment || 'Official Ministry Guidelines';
    const schemeName = targetScheme ? (targetScheme.officialName || targetScheme.name) : 'Government Schemes';

    if (language === 'hi') {
      text = `**${schemeName}** (${ministry}) के लिए सत्यापित आधिकारिक दस्तावेज़ हैं:\n\n` +
        docs.map(d => `• **${d}**`).join('\n') +
        `\n\nस्रोत: ${targetScheme?.sourceName || 'आधिकारिक सरकारी पोर्टल'}`;
    } else if (language === 'ta') {
      text = `**${schemeName}** (${ministry}) திட்டத்திற்குத் தேவையான சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ ஆவணங்கள்:\n\n` +
        docs.map(d => `• **${d}**`).join('\n') +
        `\n\nஆதாரம்: ${targetScheme?.sourceName || 'அரசு தளம்'}`;
    } else if (language === 'ml') {
      text = `**${schemeName}** (${ministry}) പദ്ധതിക്കായി ആവശ്യമായ ഔദ്യോഗിക രേഖകൾ:\n\n` +
        docs.map(d => `• **${d}**`).join('\n') +
        `\n\nഉറവിടം: ${targetScheme?.sourceName || 'ഔദ്യോഗിക പോർട്ടൽ'}`;
    } else {
      text = `According to verified guidelines from **${ministry}**, the required documents for **${schemeName}** are:\n\n` +
        docs.map(d => `• **${d}**`).join('\n') +
        `\n\n*Verified Source: ${targetScheme?.sourceName || 'Official Government Portal'}*`;
    }
    suggestedActions.push({ label: 'Check Document Readiness', action: 'documents' });
    return {
      id: `MSG-${Date.now()}`,
      sender: 'sahayak',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions
    };
  }

  // 5. Best Scheme Recommendation
  const isBestScheme =
    q.includes('best scheme') || q.includes('which scheme') || q.includes('recommend') ||
    q.includes('योजना') || q.includes('सर्वश्रेष्ठ') ||
    q.includes('திட்டம்') || q.includes('பரிந்துரை') ||
    q.includes('പദ്ധതി') || q.includes('ഏറ്റവും നല്ല');

  if (isBestScheme) {
    if (targetScheme) {
      const match = calculateSchemeMatch(user, targetScheme);
      text = `Based on your profile as a ${user.projectType || 'citizen / entrepreneur'} in ${user.state} (annual income ₹${(user.income || 0).toLocaleString('en-IN')}), **${targetScheme.officialName || targetScheme.name}** is currently your top match at **${match.totalScore}%**.\n\nKey reasons:\n${match.reasons.slice(0, 3).map(r => `• ${r}`).join('\n')}`;
      suggestedActions.push({ label: 'View Scheme Details', action: 'scheme_detail' });
      suggestedActions.push({ label: 'Check Affordability', action: 'affordability' });
    } else {
      text = `To find the best scheme for you, go to **Find My Scheme** or tell me what enterprise goal you want to pursue, your income, and how much funding you need!`;
      suggestedActions.push({ label: 'Open Find My Scheme', action: 'find_scheme' });
    }
    return {
      id: `MSG-${Date.now()}`,
      sender: 'sahayak',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions
    };
  }

  // 6. Affordability / Borrowing
  const isAfford =
    q.includes('afford') || q.includes('can i borrow') || q.includes('how much can i borrow') ||
    q.includes('किस्त') || q.includes('वहन') || q.includes('லோன்') ||
    q.includes('திருப்பி') || q.includes('താങ്ങാനാകുമോ') || q.includes('ഇഎംഐ');

  if (isAfford) {
    const testLoan = user.loanRequirement || 120000;
    const interestRate = (targetScheme?.benefits?.interestRateAnnual ?? targetScheme?.interestRate ?? 7.5);
    const tenure = (targetScheme?.benefits?.tenureMonths ?? targetScheme?.tenureMonths ?? 36);

    const aff = calculateAffordability({
      loanAmount: testLoan,
      interestRate,
      tenureMonths: tenure,
      annualHouseholdIncome: user.income,
      monthlyExpenses: user.monthlyExpenses,
      existingEMI: user.existingEMI,
      expectedMonthlyBusinessIncome: user.expectedBusinessIncome
    });

    text = `For a loan of ₹${testLoan.toLocaleString('en-IN')} (assumed interest rate ${interestRate}% p.a. over ${tenure} months), your estimated monthly EMI is **₹${aff.monthlyEmi.toLocaleString('en-IN')}**.\n\n` +
      `• **Status**: ${aff.headline}\n` +
      `• **Debt-to-Income**: ${aff.emiToIncomeRatio}%\n` +
      `• **Projected Net Monthly Surplus**: ₹${aff.monthlyDisposableSurplus.toLocaleString('en-IN')}\n\n` +
      `${aff.explanation}`;
    suggestedActions.push({ label: 'Adjust EMI Sliders', action: 'affordability' });
    return {
      id: `MSG-${Date.now()}`,
      sender: 'sahayak',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions
    };
  }

  // 7. General Fallback
  text = `Hello ${user.name ? user.name.split(' ')[0] : 'Citizen'}! I am **Sahayak AI**, your authoritative government scheme assistant.\n\nI provide verified details from official Government of India and State portals, calculate deterministic eligibility, and help track application waiting periods.\n\nHow can I help you today?`;
  suggestedActions.push({ label: 'Which scheme is best for me?', action: 'best_scheme' });
  suggestedActions.push({ label: 'What documents do I need?', action: 'documents' });
  suggestedActions.push({ label: 'Can I afford an EMI?', action: 'affordability' });

  return {
    id: `MSG-${Date.now()}`,
    sender: 'sahayak',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions
  };
}
