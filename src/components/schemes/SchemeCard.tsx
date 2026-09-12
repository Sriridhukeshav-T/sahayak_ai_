import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  HelpCircle,
  Calculator,
  ArrowRight,
  Clock,
  Percent,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { Scheme } from '../../types/scheme';
import { MatchBreakdown } from '../../types/common';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateEMI } from '../../services/affordabilityService';


interface SchemeCardProps {
  scheme: Scheme;
  match?: MatchBreakdown;
  onOpenExplain?: (scheme: Scheme, match: MatchBreakdown) => void;
  onSelectForCompare?: (scheme: Scheme) => void;
  isCompared?: boolean;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  match,
  onOpenExplain,
  onSelectForCompare,
  isCompared = false
}) => {
  const navigate = useNavigate();
  const { setActiveSchemeId } = useAppData();

  const { t } = useLanguage();

  const score = match ? match.totalScore : 90;
  const estimatedEmi = calculateEMI(scheme.maxLoan * 0.8, scheme.interestRate, scheme.tenureMonths);

  const getScoreBadgeColor = (s: number) => {
    if (s >= 85) return 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/20';
    if (s >= 70) return 'from-blue-600 to-cyan-600 text-white shadow-blue-500/20';
    return 'from-amber-500 to-yellow-600 text-white shadow-amber-500/20';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top Scheme Ribbon */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {t(scheme.category)}
            </span>
            {scheme.subsidyPercentage && scheme.subsidyPercentage > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {scheme.subsidyPercentage}% {t('Subsidy Available')}
              </span>
            )}
            {scheme.featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {t('Priority Scheme')}
              </span>
            )}
          </div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
            {t(scheme.name)}
          </h3>
        </div>

        {/* Circular Match Score Badge */}
        {match && (
          <div
            onClick={() => onOpenExplain && onOpenExplain(scheme, match)}
            className={`cursor-pointer shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${getScoreBadgeColor(
              score
            )} flex flex-col items-center justify-center shadow-md hover:scale-105 transition-transform`}
            title="Click to view transparent explainable scoring breakdown"
          >
            <span className="text-base font-extrabold leading-none">{score}%</span>
            <span className="text-[9px] font-medium tracking-tight opacity-90">{t('matchScore')}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
        {t(scheme.description)}
      </p>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs mb-4">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">{t('Max Loan')}</span>
          <span className="font-bold text-slate-800 text-sm">
            ₹{(scheme.maxLoan / 100000).toFixed(1)} Lakh
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">{t('Interest Rate')}</span>
          <span className="font-bold text-emerald-700 text-sm flex items-center gap-0.5">
            {scheme.interestRate}% <span className="text-[9px] font-normal text-slate-500">p.a.</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">{t('Moratorium')}</span>
          <span className="font-bold text-slate-800 text-sm">
            {scheme.moratoriumMonths} {t('Months')}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">{t('Est. EMI (~80% cap)')}</span>
          <span className="font-bold text-blue-700 text-sm">
            ₹{estimatedEmi.toLocaleString('en-IN')}/mo
          </span>
        </div>
      </div>

      {/* Highlighted Match Reasons or Key Qualification */}
      {match && match.reasons.length > 0 && (
        <div className="mb-4 text-xs space-y-1 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t(match.reasons[0])}</span>
          </div>
          {match.warnings.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-800 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{t(match.warnings[0])}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {match && onOpenExplain && (
            <button
              onClick={() => onOpenExplain(scheme, match)}
              className="flex-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('whyRecommendation')}</span>
            </button>
          )}

          {onSelectForCompare && (
            <button
              onClick={() => onSelectForCompare(scheme)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                isCompared
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {isCompared ? `✓ ${t('Selected')}` : t('Compare')}
            </button>
          )}

          <button
            onClick={() => {
              setActiveSchemeId(scheme.id);
              navigate(`/affordability?schemeId=${scheme.id}`);
            }}
            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
            title={t('checkAffordability')}
          >
            <Calculator className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => {
            setActiveSchemeId(scheme.id);
            navigate(`/apply?schemeId=${scheme.id}`);
          }}
          className="w-full px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group-hover:bg-blue-800"
        >
          <span>{t('startApplication')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>


    </div>
  );
};
