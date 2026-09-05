import { AffordabilityResult } from '../types/common';

export interface AffordabilityInput {
  loanAmount: number;
  interestRate: number; // percentage e.g. 4.5
  tenureMonths: number; // e.g. 36
  moratoriumMonths?: number; // e.g. 6
  annualHouseholdIncome: number;
  monthlyExpenses: number;
  existingEMI: number;
  expectedMonthlyBusinessIncome: number;
}

export function calculateEMI(principal: number, annualInterestRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualInterestRate <= 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualInterestRate / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const principal = Math.max(1000, input.loanAmount);
  const interestRate = Math.max(0, input.interestRate);
  const tenure = Math.max(6, input.tenureMonths);

  const monthlyEmi = calculateEMI(principal, interestRate, tenure);
  const totalRepayment = monthlyEmi * tenure;
  const totalInterest = Math.max(0, totalRepayment - principal);

  const monthlyHouseholdIncome = Math.round((input.annualHouseholdIncome || 0) / 12);
  const totalMonthlyIncome = monthlyHouseholdIncome + (input.expectedMonthlyBusinessIncome || 0);

  const totalMonthlyOutflow = (input.monthlyExpenses || 0) + (input.existingEMI || 0) + monthlyEmi;
  const monthlyDisposableSurplus = totalMonthlyIncome - totalMonthlyOutflow;

  const totalDebtObligations = (input.existingEMI || 0) + monthlyEmi;
  const emiToIncomeRatio = totalMonthlyIncome > 0
    ? parseFloat(((totalDebtObligations / totalMonthlyIncome) * 100).toFixed(1))
    : 100;

  let riskTier: 'COMFORTABLE' | 'MANAGEABLE' | 'HIGH_RISK';
  let headline = '';
  let explanation = '';
  const recommendations: string[] = [];

  if (emiToIncomeRatio <= 25 && monthlyDisposableSurplus > 5000) {
    riskTier = 'COMFORTABLE';
    headline = '🟢 Comfortable Repayment Profile';
    explanation = `Your estimated monthly EMI is ₹${monthlyEmi.toLocaleString('en-IN')}, which accounts for only ${emiToIncomeRatio}% of your total estimated monthly cash flow. Your remaining monthly surplus would be approximately ₹${monthlyDisposableSurplus.toLocaleString('en-IN')}.`;
    recommendations.push('You maintain a healthy financial buffer for unexpected enterprise expenses.');
    recommendations.push('Consider choosing a slightly shorter tenure to save on overall interest costs.');
  } else if (emiToIncomeRatio <= 45 && monthlyDisposableSurplus > 0) {
    riskTier = 'MANAGEABLE';
    headline = '🟡 Manageable with Disciplined Budgeting';
    explanation = `Your estimated EMI of ₹${monthlyEmi.toLocaleString('en-IN')} takes up ${emiToIncomeRatio}% of your monthly earnings. Your projected monthly surplus after all expenses is ₹${monthlyDisposableSurplus.toLocaleString('en-IN')}.`;
    recommendations.push('Ensure your business revenues ramp up smoothly during the initial moratorium period.');
    recommendations.push('Avoid taking any additional informal credit or credit card loans during this tenure.');
  } else {
    riskTier = 'HIGH_RISK';
    headline = '🔴 High Risk — Debt Burden Exceeds Safety Ceiling';
    explanation = `Your projected EMI (₹${monthlyEmi.toLocaleString('en-IN')}) plus existing debts consumes ${emiToIncomeRatio}% of your income. ${monthlyDisposableSurplus <= 0 ? 'Your household will operate at a monthly deficit.' : `Your remaining cash buffer is razor-thin at ₹${monthlyDisposableSurplus.toLocaleString('en-IN')}.`}`;
    recommendations.push('Increase your own contribution to reduce the principal loan amount.');
    recommendations.push('Opt for a longer loan tenure (e.g. 48 or 60 months) to compress the monthly installment.');
    recommendations.push('Explore capital margin money subsidies (like PMEGP/State SC-ST Corporation grants) to lower debt.');
  }

  const breakdownChartData = [
    { name: 'Household Expenses', amount: input.monthlyExpenses || 0, color: '#94a3b8' },
    { name: 'Existing EMI', amount: input.existingEMI || 0, color: '#f59e0b' },
    { name: 'Proposed Sahayak EMI', amount: monthlyEmi, color: '#1d4ed8' },
    { name: 'Net Remaining Surplus', amount: Math.max(0, monthlyDisposableSurplus), color: '#0d9488' }
  ];

  return {
    monthlyEmi,
    totalInterest,
    totalRepayment,
    monthlyDisposableSurplus,
    emiToIncomeRatio,
    riskTier,
    headline,
    explanation,
    recommendations,
    breakdownChartData
  };
}
