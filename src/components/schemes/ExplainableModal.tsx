import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Calculator,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Briefcase
} from 'lucide-react';
import { Scheme } from '../../types/scheme';
import { MatchBreakdown } from '../../types/common';
import { useAppData } from '../../context/AppDataContext';

interface ExplainableModalProps {
  scheme: Scheme | null;
  match: MatchBreakdown | null;
  onClose: () => void;
}

export const ExplainableModal: React.FC<ExplainableModalProps> = ({ scheme, match, onClose }) => {
  const navigate = useNavigate();
  const { setActiveSchemeId } = useAppData();

  if (!scheme || !match) return null;

  const breakdownItems = [
    { label: 'Income Compatibility', score: match.incomeScore, max: 25, icon: TrendingUp, desc: 'Household income fit within scheme boundaries' },
    { label: 'Loan Amount Compatibility', score: match.loanScore, max: 25, icon: Calculator, desc: 'Requested amount fits within scheme minimum and maximum caps' },
    { label: 'Project Alignment', score: match.categoryScore, max: 20, icon: Briefcase, desc: 'Trade/activity matches designated scheme priorities' },
    { label: 'Location & Partner Access', score: match.locationScore, max: 15, icon: MapPin, desc: 'Authorized channel partners active in your state and district' },
    { label: 'Profile & Demographic Fit', score: match.profileScore, max: 15, icon: ShieldCheck, desc: 'Special category, experience, and gender incentives' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-800 text-slate-300 border border-slate-700">
              Eligibility Assessment Breakdown
            </span>
            <h3 className="text-base font-serif font-bold text-white leading-snug">
              Scheme Fit Analysis
            </h3>
            <p className="text-xs text-slate-400">
              {scheme.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-sm text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-800">
          
          {/* Overall Match Meter */}
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-600">Calculated Suitability Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-mono font-bold text-slate-900">{match.totalScore}</span>
                <span className="text-sm font-semibold text-slate-500">/ 100</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {match.eligibilityStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Evaluated against statutory rules without opaque arbitrary scoring.
              </p>
            </div>

            <div className="text-right border-l border-slate-200 pl-4 py-1">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Status</span>
              <span className="text-sm font-bold text-emerald-800">Verified Fit</span>
            </div>
          </div>

          {/* 5-Factor Score Breakdown */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Evaluated Criteria Breakdown
            </h4>
            <div className="space-y-2.5">
              {breakdownItems.map((item, idx) => {
                const pct = Math.round((item.score / item.max) * 100);
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-2.5 rounded-md border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-800 mb-1">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.label}</span>
                      </span>
                      <span className="font-mono text-slate-900 font-bold">
                        {item.score} / {item.max}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-750 bg-emerald-800 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">{item.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transparent Eligibility Reasons */}
          {match.reasons.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Confirmed Eligibility Criteria
              </h4>
              <ul className="space-y-1.5">
                {match.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-800 bg-emerald-50/50 p-2 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings / Cautions */}
          {match.warnings.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Statutory Prerequisites to Verify
              </h4>
              <ul className="space-y-1.5">
                {match.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 p-2 rounded-md border border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actionable Improvement Tips */}
          {match.improvementTips.length > 0 && (
            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                <Lightbulb className="w-4 h-4 text-emerald-800" />
                <span>Eligibility Optimization Guidance</span>
              </div>
              {match.improvementTips.map((tip, i) => (
                <p key={i} className="text-xs text-slate-600 leading-relaxed pl-5">
                  • {tip}
                </p>
              ))}
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setActiveSchemeId(scheme.id);
              onClose();
              navigate(`/affordability?schemeId=${scheme.id}`);
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-500" />
            <span>Check Affordability</span>
          </button>

          <button
            onClick={() => {
              setActiveSchemeId(scheme.id);
              onClose();
              navigate(`/apply?schemeId=${scheme.id}`);
            }}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Proceed to Application</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
