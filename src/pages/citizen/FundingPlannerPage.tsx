import React, { useState } from 'react';
import {
  PiggyBank,
  IndianRupee,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { DemoBadge } from '../../components/common/DemoBadge';

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
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Capital Stack Optimizer
          </span>
          <DemoBadge />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Plan My Funding Structure
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Optimizes how your project cost is assembled across promoter equity, government margin money subsidies, and concessional debt.
        </p>
      </div>

      {/* Inputs & Capital Stack Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
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
              className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Includes equipment, machinery, premises setup, and initial working capital.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Promoter Equity / Own Contribution (₹)
            </label>
            <input
              type="number"
              value={ownContribution}
              onChange={e => setOwnContribution(Number(e.target.value))}
              className="w-full px-4 py-2.5 text-sm font-bold text-blue-700 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Current contribution: {ownPercent}% (Minimum recommended: {minOwnPercent}%)
            </span>
          </div>
        </div>

        {/* Visual Capital Stack Bar */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Project Financing Composition</span>
            <span>Total: ₹{projectCost.toLocaleString('en-IN')} (100%)</span>
          </div>

          <div className="w-full h-8 bg-slate-100 rounded-2xl overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center transition-all"
              style={{ width: `${ownPercent}%` }}
              title={`Own Contribution: ₹${ownContribution.toLocaleString('en-IN')}`}
            >
              {ownPercent >= 10 ? `Own (${ownPercent}%)` : ''}
            </div>

            <div
              className="h-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center transition-all"
              style={{ width: `${subsidyPercent}%` }}
              title={`Govt Subsidy: ₹${subsidyAmount.toLocaleString('en-IN')}`}
            >
              {subsidyPercent >= 10 ? `Subsidy (${subsidyPercent}%)` : ''}
            </div>

            <div
              className="h-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center transition-all"
              style={{ width: `${Math.max(0, 100 - ownPercent - subsidyPercent)}%` }}
              title={`Concessional Loan: ₹${netLoanRequired.toLocaleString('en-IN')}`}
            >
              Loan ({Math.max(0, 100 - ownPercent - subsidyPercent)}%)
            </div>
          </div>
        </div>

        {/* Itemized 3-Box Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
              1. Own Contribution
            </span>
            <span className="text-xl font-extrabold text-blue-900 block font-mono">
              ₹{ownContribution.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-blue-800">
              Promoter margin money paid from savings ({ownPercent}% of cost).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              2. Eligible Margin Money Subsidy
            </span>
            <span className="text-xl font-extrabold text-emerald-900 block font-mono">
              ₹{subsidyAmount.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-emerald-800">
              Capital assistance under {activeScheme?.name.slice(0, 20)}... ({subsidyPercent}%).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              3. Net Concessional Debt
            </span>
            <span className="text-xl font-extrabold text-white block font-mono">
              ₹{netLoanRequired.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-300">
              Disbursed through authorized channel partner at {activeScheme?.interestRate || 4.5}% p.a.
            </p>
          </div>

        </div>

        {/* Regulatory Note / Disclaimer Banner */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-800">
              Illustrative / Demo Funding Structure
            </p>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              This financial structure illustrates typical margin money subsidy and credit-linked combinations. Actual subsidy entitlement, lock-in periods, and own-contribution norms are subject to statutory verification by the nodal agency during formal appraisal.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
