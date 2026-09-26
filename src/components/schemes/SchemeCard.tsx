import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { Scheme } from '../../types/scheme';
import { MatchBreakdown } from '../../types/common';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';

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
  onSelectForCompare,
  isCompared = false
}) => {
  const navigate = useNavigate();
  const { setActiveSchemeId } = useAppData();
  const { t } = useLanguage();

  const maxLoan = scheme.benefits?.maxLoanAmount ?? scheme.maxLoan;
  const subsidy = scheme.benefits?.subsidyPercentage ?? scheme.subsidyPercentage;
  const schemeId = scheme.id || scheme.schemeId;

  return (
    <article className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors p-4 sm:p-5 flex flex-col justify-between group">
      <div>
        {/* Top Metadata Strip */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {scheme.state === 'Central' ? 'Central' : scheme.state}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {scheme.category}
            </span>
            {scheme.schemeStatus === 'CLOSING_SOON' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>Closing Soon</span>
              </span>
            )}
          </div>

          {/* Verification Badge */}
          {scheme.verificationStatus === 'VERIFIED' && (
            <div
              className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-[#065F46]"
              title="Verified against official Government gazette or portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#065F46]" />
              <span className="hidden sm:inline">Verified Source</span>
            </div>
          )}
        </div>

        {/* Scheme Official Title */}
        <Link
          to={`/schemes/${schemeId}`}
          className="block font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#065F46] transition-colors leading-snug mb-1.5"
        >
          {scheme.officialName || scheme.name}
        </Link>

        {/* Ministry / Department */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2.5">
          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{scheme.ministry || scheme.governmentDepartment}</span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {scheme.description}
        </p>

        {/* Compact Key Fact Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-50 rounded border border-slate-100 text-xs mb-4">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-medium">Assistance</span>
            <span className="font-bold text-slate-900 text-xs">
              {maxLoan ? `Up to ₹${(maxLoan / 100000).toFixed(1)} Lakh` : scheme.benefits?.summary ? scheme.benefits.summary.slice(0, 24) + '...' : 'Government Subsidy'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-medium">Subsidy / Benefit</span>
            <span className="font-bold text-[#065F46] text-xs">
              {subsidy && subsidy > 0 ? `${subsidy}% Margin Subsidy` : 'Direct Welfare'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-medium">Interest</span>
            <span className="font-bold text-slate-900 text-xs">
              {scheme.interestRate ? `${scheme.interestRate}% p.a.` : 'Concessional'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-medium">Window</span>
            <span className="font-bold text-slate-900 text-xs">
              {scheme.schemeStatus === 'OPEN' ? 'Open' : scheme.schemeStatus === 'CLOSING_SOON' ? 'Closing Soon' : 'Active'}
            </span>
          </div>
        </div>

        {/* Match Breakdown Callout if provided */}
        {match && match.reasons.length > 0 && (
          <div className="mb-3 text-xs bg-emerald-50/50 p-2 rounded border border-emerald-100 text-emerald-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#065F46] shrink-0" />
            <span className="truncate text-[11px] font-medium">{match.reasons[0]}</span>
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/schemes/${schemeId}`}
          className="flex-1 px-3 py-1.5 text-xs font-semibold text-[#065F46] bg-emerald-50 hover:bg-emerald-100/80 rounded transition-colors text-center border border-emerald-200"
        >
          View Scheme Details →
        </Link>

        {scheme.officialApplicationUrl && (
          <a
            href={scheme.officialApplicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors border border-slate-200"
            title="Open Official Portal"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {onSelectForCompare && (
          <button
            onClick={() => onSelectForCompare(scheme)}
            className={`p-1.5 rounded transition-colors border text-[11px] font-medium ${
              isCompared
                ? 'bg-slate-800 text-white border-slate-800'
                : 'text-slate-500 hover:text-slate-800 border-slate-200 hover:bg-slate-50'
            }`}
            title="Select for comparison"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </article>
  );
};
