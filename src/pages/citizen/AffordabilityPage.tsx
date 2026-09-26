import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calculator,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { calculateAffordability } from '../../services/affordabilityService';
import { useLanguage } from '../../context/LanguageContext';

export const AffordabilityPage: React.FC = () => {
  const { user } = useAuth();
  const { schemes, activeScheme, setActiveSchemeId } = useAppData();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const schemeIdParam = searchParams.get('schemeId');
  const initialScheme = schemeIdParam
    ? schemes.find(s => s.id === schemeIdParam) || activeScheme
    : activeScheme;

  // Simulator Inputs
  const [loanAmount, setLoanAmount] = useState<number>(user.loanRequirement || 120000);
  const [interestRate, setInterestRate] = useState<number>(initialScheme?.benefits?.interestRateAnnual || initialScheme?.interestRate || 8.5);
  const [tenureMonths, setTenureMonths] = useState<number>(initialScheme?.benefits?.tenureMonths || initialScheme?.tenureMonths || 36);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(initialScheme?.benefits?.moratoriumMonths || initialScheme?.moratoriumMonths || 6);
  const [annualIncome, setAnnualIncome] = useState<number>(user.income || 320000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(user.monthlyExpenses || 14000);
  const [existingEMI, setExistingEMI] = useState<number>(user.existingEMI || 0);
  const [expectedBusinessIncome, setExpectedBusinessIncome] = useState<number>(user.expectedBusinessIncome || 18500);

  useEffect(() => {
    if (schemeIdParam) {
      const found = schemes.find(s => s.id === schemeIdParam);
      if (found) {
        setInterestRate(found.benefits?.interestRateAnnual || found.interestRate || 8.5);
        setTenureMonths(found.benefits?.tenureMonths || found.tenureMonths || 36);
        setMoratoriumMonths(found.benefits?.moratoriumMonths || found.moratoriumMonths || 6);
        setActiveSchemeId(found.id);
      }
    }
  }, [schemeIdParam, schemes, setActiveSchemeId]);

  const affordability = calculateAffordability({
    loanAmount,
    interestRate,
    tenureMonths,
    moratoriumMonths,
    annualHouseholdIncome: annualIncome,
    monthlyExpenses,
    existingEMI,
    expectedMonthlyBusinessIncome: expectedBusinessIncome
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'COMFORTABLE': return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'MANAGEABLE': return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'HIGH_RISK': return 'bg-rose-50 text-rose-900 border-rose-300';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Financial Analysis
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Affordability & Cashflow Simulator
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate your estimated monthly EMI, debt-to-income ratio, and net household surplus.
            </p>
          </div>
        </div>

        {/* Main Grid: Left Controls, Right Real-time Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-slate-200 space-y-6">
            
            {/* Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900">
                  Loan Amount
                </label>
                <span className="text-xs font-bold text-[#065F46] font-mono">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {[50000, 100000, 250000, 500000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setLoanAmount(amt)}
                    className={`py-1.5 px-2 rounded text-xs font-medium transition-colors border ${
                      loanAmount === amt
                        ? 'bg-[#065F46] text-white border-[#065F46]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    ₹{(amt / 100000).toFixed(1)} Lakh
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="20000"
                max="1500000"
                step="10000"
                value={loanAmount}
                onChange={e => setLoanAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#065F46]"
              />
            </div>

            {/* Scheme Association Dropdown */}
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Benchmark Scheme:</span>
                <span className="font-semibold text-slate-800">{initialScheme?.officialName || initialScheme?.name}</span>
              </div>
              <select
                value={initialScheme?.id}
                onChange={e => {
                  const s = schemes.find(sc => sc.id === e.target.value);
                  if (s) {
                    setActiveSchemeId(s.id);
                    setInterestRate(s.benefits?.interestRateAnnual || s.interestRate || 8.5);
                    setTenureMonths(s.benefits?.tenureMonths || s.tenureMonths || 36);
                    setMoratoriumMonths(s.benefits?.moratoriumMonths || s.moratoriumMonths || 6);
                  }
                }}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-800"
              >
                {schemes.slice(0, 10).map(sc => (
                  <option key={sc.id} value={sc.id}>
                    {sc.officialName || sc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700">Annual Interest Rate</span>
                  <span className="font-bold text-[#065F46]">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  step="0.25"
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#065F46]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700">Tenure (Months)</span>
                  <span className="font-bold text-slate-800">{tenureMonths}m ({Math.round(tenureMonths/12)} yrs)</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="84"
                  step="6"
                  value={tenureMonths}
                  onChange={e => setTenureMonths(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#065F46]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700">Monthly Expenses (₹)</span>
                  <span className="font-bold text-slate-800">₹{monthlyExpenses.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={monthlyExpenses}
                  onChange={e => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700">Expected Business Revenue (₹)</span>
                  <span className="font-bold text-[#065F46]">₹{expectedBusinessIncome.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60000"
                  step="1000"
                  value={expectedBusinessIncome}
                  onChange={e => setExpectedBusinessIncome(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#065F46]"
                />
              </div>
            </div>

          </div>

          {/* Right Results (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Risk Tier Notice */}
            <div className={`p-4 rounded-lg border text-xs space-y-1 ${getTierColor(affordability.riskTier)}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider">{affordability.headline}</span>
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white border border-current">
                  {affordability.emiToIncomeRatio}% DTI
                </span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-95">
                {affordability.explanation}
              </p>
            </div>

            {/* Figures Matrix */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Estimated Monthly Installment</span>
                <span className="text-2xl font-black text-slate-900 block font-mono mt-0.5">
                  ₹{affordability.monthlyEmi.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Reducing balance calculation</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Repayment</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ₹{affordability.totalRepayment.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Interest</span>
                  <span className="font-mono font-bold text-[#065F46] text-sm">
                    ₹{affordability.totalInterest.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/schemes"
                  className="w-full py-2 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded text-center block transition-colors shadow-2xs"
                >
                  Explore Schemes Matching This Budget →
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AffordabilityPage;
