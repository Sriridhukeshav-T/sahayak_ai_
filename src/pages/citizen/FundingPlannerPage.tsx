import React, { useState } from 'react';
import {
  IndianRupee,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

export const FundingPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const { activeScheme } = useAppData();

  const [projectCost, setProjectCost] = useState<number>(user.projectCost || 150000);
  const [ownContribution, setOwnContribution] = useState<number>(user.ownContribution || 30000);

  // Scheme parameters
  const subsidyPercent = activeScheme?.subsidyPercentage || 25;
  const subsidyAmount = Math.round((projectCost * subsidyPercent) / 100);
  const minOwnPercent = activeScheme?.illustrativeMarginMoney || 5;
  const recommendedOwn = Math.round((projectCost * minOwnPercent) / 100);

  // Loan required = Project Cost - Own Contribution - Eligible Subsidy
  const netLoanRequired = Math.max(10000, projectCost - ownContribution - subsidyAmount);

  const ownPercent = Math.round((ownContribution / projectCost) * 100);
  const loanPercent = Math.round((netLoanRequired / projectCost) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="max-w-3xl space-y-2 border-b border-slate-200 pb-5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 inline-block">
          Capital Stack Calculator
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Funding Structure & Margin Allocation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Simulate how your total capital requirement is structured across promoter margin money, government subsidy grants, and institutional concessional credit.
        </p>
      </div>

      {/* Inputs & Capital Stack Card */}
      <div className="bg-white rounded-lg p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Project Cost (₹)
            </label>
            <input
              type="number"
              value={projectCost}
              onChange={e => {
                const val = Math.max(10000, Number(e.target.value));
                setProjectCost(val);
                setOwnContribution(Math.round(val * 0.15));
              }}
              className="w-full px-3.5 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Includes machinery, equipment, working capital, and setup expenses.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Promoter Equity / Own Margin (₹)
            </label>
            <input
              type="number"
              value={ownContribution}
              onChange={e => setOwnContribution(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Current share: {ownPercent}% of total cost (Policy guideline: minimum {minOwnPercent}%)
            </span>
          </div>
        </div>

        {/* Visual Capital Stack Bar */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Project Financing Composition</span>
            <span className="font-mono">Total: ₹{projectCost.toLocaleString('en-IN')} (100%)</span>
          </div>

          <div className="w-full h-8 bg-slate-100 rounded-md overflow-hidden flex border border-slate-200">
            <div
              className="h-full bg-slate-700 text-white text-[11px] font-medium flex items-center justify-center transition-all"
              style={{ width: `${ownPercent}%` }}
              title={`Promoter Margin: ₹${ownContribution.toLocaleString('en-IN')}`}
            >
              {ownPercent >= 10 ? `Margin (${ownPercent}%)` : ''}
            </div>

            <div
              className="h-full bg-emerald-800 text-white text-[11px] font-medium flex items-center justify-center transition-all"
              style={{ width: `${subsidyPercent}%` }}
              title={`Government Grant/Subsidy: ₹${subsidyAmount.toLocaleString('en-IN')}`}
            >
              {subsidyPercent >= 10 ? `Subsidy (${subsidyPercent}%)` : ''}
            </div>

            <div
              className="h-full bg-slate-900 text-white text-[11px] font-medium flex items-center justify-center transition-all"
              style={{ width: `${Math.max(0, 100 - ownPercent - subsidyPercent)}%` }}
              title={`Bank Credit: ₹${netLoanRequired.toLocaleString('en-IN')}`}
            >
              Credit ({Math.max(0, 100 - ownPercent - subsidyPercent)}%)
            </div>
          </div>
        </div>

        {/* Itemized 3-Box Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 block">
              1. Promoter Margin
            </span>
            <span className="text-xl font-bold text-slate-900 block font-mono">
              ₹{ownContribution.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-600">
              Own capital funded from savings ({ownPercent}% of project cost).
            </p>
          </div>

          <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 block">
              2. Government Subsidy Grant
            </span>
            <span className="text-xl font-bold text-emerald-900 block font-mono">
              ₹{subsidyAmount.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-emerald-800">
              Assistance under scheme guidelines ({subsidyPercent}% illustrative grant).
            </p>
          </div>

          <div className="p-4 rounded-md bg-slate-900 text-white border border-slate-900 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              3. Institutional Term Loan
            </span>
            <span className="text-xl font-bold text-white block font-mono">
              ₹{netLoanRequired.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-300">
              Financed via partner branch at {activeScheme?.interestRate || 4.5}% p.a.
            </p>
          </div>

        </div>

        {/* Regulatory Note / Statutory Notice Banner */}
        <div className="p-4 bg-amber-50 rounded-md border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-900">
              Statutory Note on Project Financing
            </p>
            <p className="text-[11px] leading-relaxed text-amber-800">
              This capital stack calculator provides indicative structuring based on standard nodal guidelines. Sanctioned amounts, subsidy lock-in conditions, and margin requirements depend on formal appraisal by the respective lending institution and official scheme guidelines.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
