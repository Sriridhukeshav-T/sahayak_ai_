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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Explainable AI Match Engine
            </span>
            <h3 className="text-base font-bold text-white leading-snug">
              Why Was This Scheme Recommended?
            </h3>
            <p className="text-xs text-slate-400">
              {scheme.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-800">
          
          {/* Overall Match Meter */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-600">Overall Match Score</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-blue-900">{match.totalScore}</span>
                <span className="text-sm font-semibold text-slate-500">/ 100</span>
                <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {match.eligibilityStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Calculated across 5 deterministic criteria without opaque black-box decisions.
              </p>
            </div>

            {/* Circular Visual Indicator */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-teal-600 transition-all duration-700"
                  strokeDasharray={`${match.totalScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-slate-800">{match.totalScore}%</span>
            </div>
          </div>

          {/* 5-Factor Score Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Score Breakdown
            </h4>
            <div className="space-y-2.5">
              {breakdownItems.map((item, idx) => {
                const pct = Math.round((item.score / item.max) * 100);
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-blue-600" />
                        <span>{item.label}</span>
                      </span>
                      <span className="font-mono text-blue-700 font-bold">
                        {item.score} / {item.max}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">{item.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transparent Eligibility Reasons */}
          {match.reasons.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Identified Eligibility Strengths
              </h4>
              <ul className="space-y-1.5">
                {match.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings / Cautions */}
          {match.warnings.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Points to Note
              </h4>
              <ul className="space-y-1.5">
                {match.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/80">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actionable Improvement Tips */}
          {match.improvementTips.length > 0 && (
            <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span>What Could Improve Your Match Score?</span>
              </div>
              {match.improvementTips.map((tip, i) => (
                <p key={i} className="text-xs text-blue-800 leading-relaxed pl-5">
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
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
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
            className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Proceed to Application</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
