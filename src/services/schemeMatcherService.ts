import { Scheme } from '../types/scheme';
import { ChannelPartner } from '../types/partner';
import { UserProfile } from '../types/user';
import { MatchBreakdown, SchemeMatchResult } from '../types/common';

export function calculateSchemeMatch(
  user: UserProfile,
  scheme: Scheme,
  allPartners: ChannelPartner[] = []
): MatchBreakdown {
  let incomeScore = 0;
  let loanScore = 0;
  let categoryScore = 0;
  let locationScore = 0;
  let profileScore = 0;

  const reasons: string[] = [];
  const warnings: string[] = [];
  const improvementTips: string[] = [];

  // 1. Income Compatibility (Max 25 pts)
  const income = user.income || 0;
  if (income >= scheme.minIncome && income <= scheme.maxIncome) {
    incomeScore = 25;
    reasons.push(`Annual household income (₹${income.toLocaleString('en-IN')}) fits within eligible range (₹${scheme.minIncome.toLocaleString('en-IN')} - ₹${scheme.maxIncome.toLocaleString('en-IN')}).`);
  } else if (income < scheme.minIncome) {
    incomeScore = 12;
    warnings.push(`Stated income (₹${income.toLocaleString('en-IN')}) is below typical preferred baseline (₹${scheme.minIncome.toLocaleString('en-IN')}).`);
    improvementTips.push('Adding guarantor or co-applicant income can bring you into the primary eligibility band.');
  } else if (income <= scheme.maxIncome * 1.20) {
    incomeScore = 15;
    warnings.push(`Income is slightly above the strict cap (₹${scheme.maxIncome.toLocaleString('en-IN')}), borderline eligibility.`);
    improvementTips.push('Certain family allowances or agricultural exemptions may adjust net qualifying income.');
  } else {
    incomeScore = 0;
    warnings.push(`Income of ₹${income.toLocaleString('en-IN')} exceeds the ceiling limit of ₹${scheme.maxIncome.toLocaleString('en-IN')}.`);
  }

  // 2. Loan Amount Compatibility (Max 25 pts)
  const reqLoan = user.loanRequirement || 0;
  if (reqLoan >= scheme.minLoan && reqLoan <= scheme.maxLoan) {
    loanScore = 25;
    reasons.push(`Requested loan of ₹${reqLoan.toLocaleString('en-IN')} is within scheme limits (₹${scheme.minLoan.toLocaleString('en-IN')} - ₹${scheme.maxLoan.toLocaleString('en-IN')}).`);
  } else if (reqLoan > scheme.maxLoan && reqLoan <= scheme.maxLoan * 1.3) {
    loanScore = 16;
    warnings.push(`Requested amount exceeds scheme cap of ₹${scheme.maxLoan.toLocaleString('en-IN')} by a moderate margin.`);
    improvementTips.push(`Increasing your own contribution or adjusting loan requirement to ₹${scheme.maxLoan.toLocaleString('en-IN')} maximizes approval rate.`);
  } else if (reqLoan < scheme.minLoan) {
    loanScore = 14;
    warnings.push(`Requested loan is below scheme minimum threshold of ₹${scheme.minLoan.toLocaleString('en-IN')}.`);
  } else {
    loanScore = Math.max(5, Math.round(25 * (scheme.maxLoan / Math.max(reqLoan, 1))));
    warnings.push(`Significant gap between desired loan amount and scheme upper limit.`);
  }

  // 3. Project / Category Compatibility (Max 20 pts)
  const userProject = (user.projectType || '').toLowerCase();
  const userGoal = (user.goal || '').toLowerCase();
  const hasExactProject = scheme.projectTypes.some(pt => pt.toLowerCase() === userProject);
  const hasPartialProject = scheme.projectTypes.some(pt =>
    pt.toLowerCase().includes(userProject) || userProject.includes(pt.toLowerCase())
  );

  if (hasExactProject) {
    categoryScore = 20;
    reasons.push(`"${user.projectType}" is an explicitly designated priority activity for this scheme.`);
  } else if (hasPartialProject) {
    categoryScore = 16;
    reasons.push(`Your trade "${user.projectType}" aligns with allied project sectors in this scheme.`);
  } else if (scheme.category === 'Education & Skill' && (userGoal.includes('education') || userProject.includes('education'))) {
    categoryScore = 20;
    reasons.push(`Higher education goal matches scheme purpose.`);
  } else if (scheme.category === 'Agriculture & Allied' && (userGoal.includes('agri') || userProject.includes('agri') || userProject.includes('tractor'))) {
    categoryScore = 18;
    reasons.push(`Agricultural sector alignment confirmed.`);
  } else if (scheme.businessEligible && !userGoal.includes('education')) {
    categoryScore = 12;
    reasons.push(`General enterprise eligibility applies.`);
    improvementTips.push('Detailing your exact business machinery in a quotation strengthens project compatibility.');
  } else {
    categoryScore = 6;
    warnings.push(`Project type may require special approval under general sub-clauses.`);
  }

  // 4. Location & Partner Availability (Max 15 pts)
  const isStateSupported = scheme.supportedStates.includes('ALL') || scheme.supportedStates.includes(user.state);
  const availablePartnersInState = allPartners.filter(p =>
    p.state === user.state &&
    p.available &&
    (p.supportedSchemes.includes('*') || p.supportedSchemes.includes(scheme.id))
  );
  const districtPartners = availablePartnersInState.filter(p => p.district === user.district);

  if (isStateSupported && districtPartners.length > 0) {
    locationScore = 15;
    reasons.push(`Scheme operates in ${user.state} with ${districtPartners.length} active channel partner(s) in ${user.district}.`);
  } else if (isStateSupported && availablePartnersInState.length > 0) {
    locationScore = 12;
    reasons.push(`Supported statewide in ${user.state} through regional partner offices.`);
  } else if (isStateSupported) {
    locationScore = 9;
    warnings.push(`State is covered, but local district channel partner presence is limited.`);
    improvementTips.push('Online application through state apex agency may be routed to adjacent district branch.');
  } else {
    locationScore = 0;
    warnings.push(`Scheme is currently not notified for operation in ${user.state}.`);
  }

  // 5. User Profile / Demographics Eligibility (Max 15 pts)
  let pScore = 0;
  // Gender alignment
  if (scheme.category === 'Women Entrepreneurship') {
    if (user.gender === 'Female') {
      pScore += 6;
      reasons.push(`Tailored priority benefit for female entrepreneurs.`);
    } else {
      warnings.push(`Scheme exclusively privileges women entrepreneurs or 51%+ women-owned partnerships.`);
    }
  } else {
    pScore += 4;
  }

  // Marginalized / Category alignment
  if (user.category && ['SC', 'ST', 'OBC', 'Minority', 'EWS'].includes(user.category)) {
    pScore += 5;
    reasons.push(`Beneficiary belongs to designated priority community (${user.category}).`);
  } else {
    pScore += 3;
  }

  // Experience & readiness
  if (user.experienceYears && user.experienceYears >= 1) {
    pScore += 4;
    reasons.push(`Documented ${user.experienceYears} year(s) of trade experience fulfills credit appraisal guidelines.`);
  } else {
    pScore += 2;
    improvementTips.push('Adding a vocational training or apprentice completion certificate boosts profile score.');
  }

  profileScore = Math.min(15, pScore);

  const totalScore = Math.min(100, Math.max(0, incomeScore + loanScore + categoryScore + locationScore + profileScore));

  let eligibilityStatus: 'Highly Compatible' | 'Compatible' | 'Moderate Match' | 'Not Recommended';
  if (totalScore >= 85) eligibilityStatus = 'Highly Compatible';
  else if (totalScore >= 70) eligibilityStatus = 'Compatible';
  else if (totalScore >= 50) eligibilityStatus = 'Moderate Match';
  else eligibilityStatus = 'Not Recommended';

  return {
    incomeScore,
    loanScore,
    categoryScore,
    locationScore,
    profileScore,
    totalScore,
    reasons,
    warnings,
    improvementTips,
    eligibilityStatus
  };
}

export function rankSchemesForUser(
  user: UserProfile,
  schemes: Scheme[],
  partners: ChannelPartner[]
): SchemeMatchResult[] {
  const scored = schemes.map(scheme => ({
    scheme,
    match: calculateSchemeMatch(user, scheme, partners)
  }));

  // Sort descending by match score
  return scored.sort((a, b) => b.match.totalScore - a.match.totalScore);
}
