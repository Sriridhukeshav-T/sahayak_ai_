import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ExternalLink,
  Calculator,
  ArrowRight,
  Building2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock
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
  const maxLoan = scheme.benefits?.maxLoanAmount ?? scheme.maxLoan;
  const interestRate = scheme.benefits?.interestRateAnnual ?? scheme.interestRate ?? 7.5;
  const tenure = scheme.benefits?.tenureMonths ?? scheme.tenureMonths ?? 36;
  const estimatedEmi = maxLoan ? calculateEMI(maxLoan * 0.8, interestRate, tenure) : null;
  const subsidy = scheme.benefits?.subsidyPercentage ?? scheme.subsidyPercentage;

  const schemeId = scheme.id || scheme.schemeId;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group relative overflow-hidden">
      <div>
        {/* Top Badges & Ministry Info */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {scheme.state === 'Central' ? 'Central' : scheme.state}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {t(scheme.category)}
              </span>
              {subsidy && subsidy > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {subsidy}% Subsidy
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium pt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[260px]">{scheme.ministry || scheme.governmentDepartment}</span>
            </div>
          </div>

          {/* Verification Badge */}
          {scheme.verificationStatus === 'VERIFIED' && (
            <div
              className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold"
              title="Verified against authoritative official government sources"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Source</span>
            </div>
          )}
        </div>

        {/* Scheme Official Title */}
        <Link
          to={`/schemes/${schemeId}`}
          className="block font-bold text-base text-slate-900 hover:text-emerald-800 transition-colors leading-snug mb-2"
        >
          {scheme.officialName || scheme.name}
        </Link>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {scheme.description}
        </p>

        {/* Metric Grid / Benefits Snapshot */}
        {maxLoan ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Max Loan</span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                ₹{(maxLoan / 100000).toFixed(1)} Lakh
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Interest</span>
              <span className="font-bold text-emerald-800 text-xs sm:text-sm">
                {interestRate}% <span className="text-[9px] font-normal text-slate-500">p.a.</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Tenure</span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                {tenure}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Est. EMI</span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                {estimatedEmi ? `₹${estimatedEmi.toLocaleString('en-IN')}` : 'N/A'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider mb-0.5">Assistance Type</span>
            <span className="font-semibold text-slate-800 block line-clamp-1">
              {scheme.benefits?.summary || 'Direct financial & programmatic assistance'}
            </span>
          </div>
        )}

        {/* Match Breakdown Callout if provided */}
        {match && match.reasons.length > 0 && (
          <div className="mb-4 text-xs space-y-1 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">{t(match.reasons[0])}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Link
            to={`/schemes/${schemeId}`}
            className="flex-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors text-center"
          >
            View Guidelines
          </Link>

          {scheme.officialApplicationUrl && (
            <a
              href={scheme.officialApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200"
              title="Open Official Government Portal"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {maxLoan && (
            <button
              onClick={() => {
                setActiveSchemeId(schemeId);
                navigate(`/affordability?schemeId=${schemeId}`);
              }}
              className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200"
              title={t('checkAffordability')}
            >
              <Calculator className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => {
            setActiveSchemeId(schemeId);
            navigate(`/apply?schemeId=${schemeId}`);
          }}
          className="w-full px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <span>Apply Online</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
