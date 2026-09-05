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
}

export function generateAssistantResponse(
  userQuery: string,
  user: UserProfile,
  activeScheme: Scheme | null,
  allSchemes: Scheme[] = []
): AssistantMessage {
  const q = userQuery.toLowerCase().trim();

  let text = '';
  const suggestedActions: { label: string; action: string }[] = [];

  if (q.includes('best scheme') || q.includes('which scheme') || q.includes('recommend')) {
    if (activeScheme) {
      const match = calculateSchemeMatch(user, activeScheme);
      text = `Based on your profile as a ${user.projectType || 'entrepreneur'} in ${user.state} (annual income ₹${(user.income || 0).toLocaleString('en-IN')}), **${activeScheme.name}** is currently your highest match at **${match.totalScore}%**.\n\nKey reasons:\n${match.reasons.slice(0, 3).map(r => `• ${r}`).join('\n')}`;
      suggestedActions.push({ label: 'Check Affordability', action: 'affordability' });
      suggestedActions.push({ label: 'Find Nearest Partner', action: 'partners' });
    } else {
      text = `To find the best scheme for you, go to **Find My Scheme** or tell me what enterprise or study goal you want to pursue, your income, and how much funding you need!`;
      suggestedActions.push({ label: 'Open Find My Scheme', action: 'find_scheme' });
    }
  } else if (q.includes('why was this scheme') || q.includes('why recommended')) {
    if (activeScheme) {
      const match = calculateSchemeMatch(user, activeScheme);
      text = `**${activeScheme.name}** was matched with an explainable score of **${match.totalScore}/100**:\n\n` +
        `• **Income Compatibility**: ${match.incomeScore}/25\n` +
        `• **Loan Compatibility**: ${match.loanScore}/25\n` +
        `• **Project Alignment**: ${match.categoryScore}/20\n` +
        `• **Location & Partner Access**: ${match.locationScore}/15\n` +
        `• **Profile Eligibility**: ${match.profileScore}/15\n\n` +
        (match.improvementTips.length > 0 ? `💡 *Tip to improve score*: ${match.improvementTips[0]}` : `You have top-tier qualification for this program.`);
      suggestedActions.push({ label: 'View Comparison', action: 'compare' });
    } else {
      text = `Select or open any recommended scheme, and I will give you a detailed transparent breakdown of why you were matched!`;
    }
  } else if (q.includes('afford') || q.includes('can i borrow') || q.includes('how much can i borrow')) {
    const testLoan = user.loanRequirement || 120000;
    const aff = calculateAffordability({
      loanAmount: testLoan,
      interestRate: activeScheme ? activeScheme.interestRate : 4.5,
      tenureMonths: activeScheme ? activeScheme.tenureMonths : 36,
      annualHouseholdIncome: user.income,
      monthlyExpenses: user.monthlyExpenses,
      existingEMI: user.existingEMI,
      expectedMonthlyBusinessIncome: user.expectedBusinessIncome
    });

    text = `For a loan of ₹${testLoan.toLocaleString('en-IN')}, your estimated monthly EMI is **₹${aff.monthlyEmi.toLocaleString('en-IN')}**.\n\n` +
      `• **Status**: ${aff.headline}\n` +
      `• **Debt-to-Income**: ${aff.emiToIncomeRatio}%\n` +
      `• **Projected Net Monthly Surplus**: ₹${aff.monthlyDisposableSurplus.toLocaleString('en-IN')}\n\n` +
      `${aff.explanation}`;
    suggestedActions.push({ label: 'Adjust EMI Sliders', action: 'affordability' });
  } else if (q.includes('document') || q.includes('paper') || q.includes('what do i need')) {
    const docs = activeScheme ? activeScheme.requiredDocuments : ['Aadhaar Card', 'Income Certificate', 'Bank Passbook', 'Machinery Quotation'];
    text = `For ${activeScheme ? activeScheme.name : 'government concessional credit'}, the standard mandatory documents are:\n\n` +
      docs.map(d => `✓ **${d}**`).join('\n') +
      `\n\nYou can upload these in our **Document Readiness** section to verify digital readiness before submitting.`;
    suggestedActions.push({ label: 'Check Document Readiness', action: 'documents' });
  } else if (q.includes('emi') || q.includes('what is emi')) {
    text = `**EMI (Equated Monthly Installment)** is the fixed payment you make to the bank each month.\n\nIt consists of two parts:\n1. **Principal**: repaying the original amount you borrowed.\n2. **Interest**: the bank's concessional service fee.\n\nIn government schemes, interest is calculated on a **reducing balance**, meaning your interest goes down every time you make a payment!`;
    suggestedActions.push({ label: 'Financial Literacy Center', action: 'literacy' });
  } else if (q.includes('moratorium') || q.includes('grace period')) {
    const months = activeScheme ? activeScheme.moratoriumMonths : 6;
    text = `A **Moratorium** is a repayment holiday during the initial setup period (typically **${months} months** for this scheme).\n\nDuring this time, you do NOT have to pay EMIs. It gives you time to buy equipment, begin operations, and generate regular income before your first installment is due!`;
  } else if (q.includes('partner') || q.includes('where should i apply') || q.includes('bank')) {
    text = `You do not need to visit random bank branches! Sahayak AI evaluates **channel partner suitability** based on 5 factors: scheme support, distance, current backlog load, capacity, and average processing speed.\n\nCheck **Find My Partner** to see your top-ranked nearby branch on an interactive map.`;
    suggestedActions.push({ label: 'Find Channel Partner', action: 'partners' });
  } else if (q.includes('submit') || q.includes('what happens') || q.includes('track')) {
    text = `Once you submit your application through Sahayak AI:\n\n1. **ID Assigned**: You get an instant tracking ID (e.g. \`SAH-2026-XXXXX\`).\n2. **Document Check**: AI verifies completeness.\n3. **Routed to Partner**: Sent directly to the designated officer.\n4. **Appraisal & Sanction**: Field inspection and sanction letter.\n5. **Disbursement**: Loan credited to your account / equipment vendor.`;
    suggestedActions.push({ label: 'Track My Applications', action: 'applications' });
  } else {
    text = `Hello ${user.name}! I am **Sahayak**, your AI financial inclusion guide. I can help you find suitable concessional schemes, explain your match score, simulate whether an EMI fits your budget, or locate the fastest nearby channel partner.\n\nWhat would you like to explore?`;
    suggestedActions.push({ label: 'Which scheme is best for me?', action: 'best_scheme' });
    suggestedActions.push({ label: 'Can I afford this loan?', action: 'affordability' });
    suggestedActions.push({ label: 'What documents do I need?', action: 'documents' });
  }

  return {
    id: `MSG-${Date.now()}`,
    sender: 'sahayak',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions
  };
}
