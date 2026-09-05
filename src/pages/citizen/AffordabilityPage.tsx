import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  Calculator,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Percent,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { calculateAffordability } from '../../services/affordabilityService';
import { DemoBadge } from '../../components/common/DemoBadge';

export const AffordabilityPage: React.FC = () => {
  const { user } = useAuth();
  const { schemes, activeScheme, setActiveSchemeId } = useAppData();
  const [searchParams] = useSearchParams();

  const schemeIdParam = searchParams.get('schemeId');
  const initialScheme = schemeIdParam
    ? schemes.find(s => s.id === schemeIdParam) || activeScheme
    : activeScheme;

  // Simulator Inputs
  const [loanAmount, setLoanAmount] = useState<number>(user.loanRequirement || 120000);
  const [interestRate, setInterestRate] = useState<number>(initialScheme ? initialScheme.interestRate : 4.5);
  const [tenureMonths, setTenureMonths] = useState<number>(initialScheme ? initialScheme.tenureMonths : 36);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(initialScheme ? initialScheme.moratoriumMonths : 6);
  const [annualIncome, setAnnualIncome] = useState<number>(user.income || 320000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(user.monthlyExpenses || 14000);
  const [existingEMI, setExistingEMI] = useState<number>(user.existingEMI || 0);
  const [expectedBusinessIncome, setExpectedBusinessIncome] = useState<number>(user.expectedBusinessIncome || 18500);

  // Sync when scheme parameter changes
  useEffect(() => {
    if (schemeIdParam) {
      const found = schemes.find(s => s.id === schemeIdParam);
      if (found) {
        setInterestRate(found.interestRate);
        setTenureMonths(found.tenureMonths);
        setMoratoriumMonths(found.moratoriumMonths);
        setActiveSchemeId(found.id);
      }
    }
  }, [schemeIdParam, schemes, setActiveSchemeId]);

  // Run calculation
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
      case 'COMFORTABLE': return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'MANAGEABLE': return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'HIGH_RISK': return 'bg-red-50 text-red-900 border-red-300';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Financial Affordability Engine
          </span>
          <DemoBadge />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Can I Actually Afford This?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Not just a basic EMI calculator. We test your reducing-balance repayment against your household budget to ensure you never face debt distress.
        </p>
      </div>

      {/* Main Grid: Left Controls, Right Real-time Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Input Sliders & Presets (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          
          {/* Preset Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800">
                Loan Amount Presets
              </label>
              <span className="text-xs font-bold text-blue-700 font-mono">
                ₹{loanAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {[50000, 120000, 300000, 600000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmount(amt)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    loanAmount === amt
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
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
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Scheme Association Dropdown */}
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Active Benchmark Scheme:</span>
              <span className="font-bold text-slate-900">{initialScheme?.name.slice(0, 45)}...</span>
            </div>
            <select
              value={initialScheme?.id}
              onChange={e => {
                const s = schemes.find(sc => sc.id === e.target.value);
                if (s) {
                  setActiveSchemeId(s.id);
                  setInterestRate(s.interestRate);
                  setTenureMonths(s.tenureMonths);
                  setMoratoriumMonths(s.moratoriumMonths);
                }
              }}
              className="px-2 py-1 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-900"
            >
              {schemes.slice(0, 10).map(sc => (
                <option key={sc.id} value={sc.id}>
                  {sc.category}: {sc.name.slice(0, 25)}...
                </option>
              ))}
            </select>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100 text-xs">
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Concessional Interest</span>
                <span className="font-bold text-emerald-700">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.2"
                value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Repayment Tenure</span>
                <span className="font-bold text-slate-900">{tenureMonths} Months ({Math.round(tenureMonths/12)} yrs)</span>
              </div>
              <input
                type="range"
                min="12"
                max="84"
                step="6"
                value={tenureMonths}
                onChange={e => setTenureMonths(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Monthly Household Expenses</span>
                <span className="font-bold text-slate-900">₹{monthlyExpenses.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={monthlyExpenses}
                onChange={e => setMonthlyExpenses(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Expected Monthly Business Surplus</span>
                <span className="font-bold text-teal-700">₹{expectedBusinessIncome.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="60000"
                step="1000"
                value={expectedBusinessIncome}
                onChange={e => setExpectedBusinessIncome(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Existing Other EMI Obligations</span>
                <span className="font-bold text-amber-700">₹{existingEMI.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="15000"
                step="500"
                value={existingEMI}
                onChange={e => setExistingEMI(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Moratorium Grace Period</span>
                <span className="font-bold text-purple-700">{moratoriumMonths} Months</span>
              </div>
              <span className="text-[10px] text-slate-400">Zero EMI installments during first {moratoriumMonths} months.</span>
            </div>

          </div>

        </div>

        {/* Right: Results, Risk Classification & Visual Chart (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Risk Classification Banner */}
          <div className={`p-5 rounded-3xl border shadow-xs space-y-2 ${getTierColor(affordability.riskTier)}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{affordability.headline}</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/70">
                {affordability.emiToIncomeRatio}% DTI
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-95">
              {affordability.explanation}
            </p>
          </div>

          {/* Numbers Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
                <span className="text-slate-500 block text-[10px] font-medium">Estimated Monthly EMI</span>
                <span className="text-2xl font-black text-blue-700 block font-mono mt-0.5">
                  ₹{affordability.monthlyEmi.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-blue-600 mt-0.5 block">Reducing-balance calculation</span>
              </div>

              <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100">
                <span className="text-slate-500 block text-[10px] font-medium">Monthly Family Surplus</span>
                <span className={`text-2xl font-black block font-mono mt-0.5 ${
                  affordability.monthlyDisposableSurplus > 0 ? 'text-teal-700' : 'text-red-600'
                }`}>
                  ₹{affordability.monthlyDisposableSurplus.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-teal-600 mt-0.5 block">Remaining safety cushion</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-medium">Total Interest Payable</span>
                <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">
                  ₹{affordability.totalInterest.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-medium">Total Lifetime Repayment</span>
                <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">
                  ₹{affordability.totalRepayment.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Recharts Monthly Outflow Comparison */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Monthly Cashflow Allocation
              </p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={affordability.breakdownChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                      {affordability.breakdownChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Action Recommendations */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-bold text-slate-800 block text-[11px]">Key Financial Advice:</span>
              {affordability.recommendations.map((rec, i) => (
                <p key={i} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{rec}</span>
                </p>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
