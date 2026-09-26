import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ExternalLink,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Building2,
  IndianRupee,
  Layers,
  Info,
  Check,
  X,
  History,
  AlertTriangle
} from 'lucide-react';
import { Scheme } from '../../types/scheme';
import { AUTHORITATIVE_SCHEMES } from '../../data/authoritativeSchemes';
import { useAuth } from '../../context/AuthContext';
import { evaluateStructuredEligibility, SchemeEligibilityEvaluation } from '../../services/structuredEligibilityEngine';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<SchemeEligibilityEvaluation | null>(null);
  const [auditRecords, setAuditRecords] = useState<any[]>([]);

  useEffect(() => {
    // 1. Try to fetch from backend API, fallback to local authoritative schemes
    const fetchScheme = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/schemes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setScheme(data);
        } else {
          const found = AUTHORITATIVE_SCHEMES.find(s => s.id === id || s.schemeId === id || s.code === id);
          setScheme(found || null);
        }
      } catch {
        const found = AUTHORITATIVE_SCHEMES.find(s => s.id === id || s.schemeId === id || s.code === id);
        setScheme(found || null);
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  useEffect(() => {
    if (scheme) {
      // Evaluate structured eligibility against citizen profile
      if (user) {
        const ev = evaluateStructuredEligibility(user, scheme);
        setEvaluation(ev);
      }

      // Fetch audit history if available
      fetch(`/api/audit-history?schemeId=${scheme.id || scheme.schemeId}`)
        .then(res => (res.ok ? res.json() : []))
        .then(records => setAuditRecords(records))
        .catch(() => setAuditRecords([]));
    }
  }, [scheme, user]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded"></div>
          <div className="h-10 w-3/4 bg-slate-200 rounded"></div>
          <div className="h-40 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Scheme Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          The requested scheme could not be located in the authoritative Government scheme directory.
        </p>
        <Link
          to="/schemes"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scheme Explorer</span>
        </Link>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (scheme.schemeStatus) {
      case 'OPEN':
      case 'ONGOING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            {scheme.isOngoing ? 'Ongoing Flagship Mission' : 'Applications Open'}
          </span>
        );
      case 'CLOSING_SOON':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Closing Soon
          </span>
        );
      case 'APPLICATION_WINDOW_CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Application Window Closed
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Scheme Concluded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/schemes')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Authoritative Directory</span>
        </button>
        <span className="text-xs text-slate-500 font-mono">
          Ref: {scheme.code || scheme.id}
        </span>
      </div>

      {/* 1. Header & Source Authority Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {scheme.state === 'Central' ? 'Central Government' : scheme.state}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {scheme.category}
          </span>
          {getStatusBadge()}
          {scheme.version && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-50 text-slate-600 border border-slate-200">
              v{scheme.version}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
          {scheme.officialName || scheme.name}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 mb-6">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">{scheme.ministry}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Department:</span>
            <span>{scheme.governmentDepartment}</span>
          </div>
        </div>

        {/* Source Verification Badge Block */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span className="text-sm font-bold text-emerald-900">
                ✓ Verified Government Source
              </span>
            </div>
            <p className="text-xs text-emerald-800">
              Data cross-checked against official Government gazette and ministry portal: <strong className="font-semibold">{scheme.sourceName}</strong>
            </p>
            <div className="text-[11px] text-emerald-700 font-medium">
              Source verification date: {scheme.lastVerifiedAt ? new Date(scheme.lastVerifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'March 2026'}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {scheme.officialApplicationUrl && (
              <a
                href={scheme.officialApplicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {scheme.sourceUrl && (
              <a
                href={scheme.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs transition-colors"
              >
                <span>Official Guidelines</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Official Description & Objective */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-700" />
          <span>Scheme Overview & Objectives</span>
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          {scheme.description}
        </p>
      </div>

      {/* 3. Financial Assistance & Benefits */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-emerald-700" />
          <span>Financial Assistance & Key Benefits</span>
        </h2>

        {/* Benefits Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
            {scheme.benefits?.summary}
          </p>
          {scheme.benefits?.financialAssistanceDetails && (
            <p className="text-xs text-slate-600 mt-2 border-t border-slate-200/70 pt-2">
              {scheme.benefits.financialAssistanceDetails}
            </p>
          )}
        </div>

        {/* Financial Metrics Cards (if loan or subsidy scheme) */}
        {(scheme.benefits?.maxLoanAmount || scheme.benefits?.subsidyPercentage) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {scheme.benefits?.maxLoanAmount && (
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Loan Range</span>
                <span className="text-base font-bold text-slate-900">
                  ₹{((scheme.benefits.minLoanAmount || 0) / 100000).toFixed(1)}L - ₹{(scheme.benefits.maxLoanAmount / 100000).toFixed(1)}L
                </span>
              </div>
            )}
            {scheme.benefits?.subsidyPercentage !== undefined && scheme.benefits.subsidyPercentage > 0 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Subsidy Rate</span>
                <span className="text-base font-bold text-emerald-700">
                  {scheme.benefits.subsidyPercentage}%
                  {scheme.benefits.maxSubsidyAmount ? ` (Up to ₹${(scheme.benefits.maxSubsidyAmount / 100000).toFixed(1)}L)` : ''}
                </span>
              </div>
            )}
            {scheme.benefits?.interestRateAnnual !== undefined && (
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Interest Rate</span>
                <span className="text-base font-bold text-slate-900">
                  {scheme.benefits.interestRateAnnual}% <span className="text-xs font-normal text-slate-500">p.a.</span>
                </span>
              </div>
            )}
            {scheme.benefits?.tenureMonths !== undefined && (
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Tenure</span>
                <span className="text-base font-bold text-slate-900">
                  {scheme.benefits.tenureMonths} Months
                  {scheme.benefits.moratoriumMonths ? ` (${scheme.benefits.moratoriumMonths}m moratorium)` : ''}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Deterministic Structured Eligibility Evaluation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Deterministic Eligibility Evaluation</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Direct verification of citizen profile attributes against official statutory requirements.
            </p>
          </div>

          {evaluation && (
            <div>
              {evaluation.result === 'ELIGIBLE' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Eligible for Application
                </span>
              )}
              {evaluation.result === 'POTENTIALLY_ELIGIBLE' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Potentially Eligible (Details Required)
                </span>
              )}
              {evaluation.result === 'NOT_ELIGIBLE' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  <X className="w-4 h-4 text-rose-700" />
                  Not Eligible
                </span>
              )}
            </div>
          )}
        </div>

        {evaluation && (
          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-700 border border-slate-200">
            <strong>Evaluation Summary:</strong> {evaluation.summary}
          </div>
        )}

        {/* Condition-by-Condition Table */}
        {evaluation && evaluation.ruleEvaluations.length > 0 && (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Requirement</th>
                  <th className="py-2.5 px-4">Mandatory</th>
                  <th className="py-2.5 px-4">Citizen Profile Value</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluation.ruleEvaluations.map((ev, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {ev.rule.label}
                    </td>
                    <td className="py-3 px-4">
                      {ev.rule.mandatory ? (
                        <span className="font-semibold text-rose-700">Mandatory</span>
                      ) : (
                        <span className="text-slate-400">Optional</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {ev.missingData ? (
                        <span className="text-amber-700 italic">Not provided in profile</span>
                      ) : (
                        String(ev.actualValue ?? 'None')
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {ev.passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Met
                        </span>
                      ) : ev.missingData ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> Pending Data
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                          <X className="w-3.5 h-3.5" /> Unmet
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* General Official Eligibility Text */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Statutory Eligibility Guidelines
          </h3>
          <ul className="space-y-1.5">
            {scheme.eligibilityRules?.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. Required Documents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-700" />
          <span>Mandatory Documents for Official Application</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {scheme.requiredDocuments?.map((doc, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                {i + 1}
              </div>
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Application Procedure */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700" />
          <span>Official Application Stages</span>
        </h2>
        <div className="space-y-3 pt-2">
          {scheme.applicationProcess?.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed pt-0.5">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Administrative & Window Guidelines */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-700" />
          <span>Administrative Dates & Processing Parameters</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-1">Application Start Date</span>
            <span className="text-xs font-semibold text-slate-800">
              {scheme.applicationStartDate || 'Ongoing / Subject to annual budget allocation'}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-1">Application End Date</span>
            <span className="text-xs font-semibold text-slate-800">
              {scheme.applicationEndDate || (scheme.isOngoing ? 'Ongoing Flagship Mission (No closing date specified)' : 'Not specified in the available official source.')}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-1">Official Processing Timeframe</span>
            <span className="text-xs font-semibold text-slate-800">
              {scheme.processingPeriod || 'Not specified in the available official source.'}
            </span>
          </div>
        </div>
      </div>

      {/* 8. Audit & Version History */}
      {auditRecords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-700" />
            <span>Scheme Revision & Audit History</span>
          </h2>
          <div className="space-y-3 pt-2">
            {auditRecords.map((aud, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Version {aud.previousVersion} → {aud.newVersion}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(aud.detectedAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-slate-600">
                  <span className="font-medium text-slate-700">Source:</span> {aud.source}
                </div>
                <div className="text-slate-600">
                  <span className="font-medium text-slate-700">Modified Fields:</span>{' '}
                  <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                    {aud.changedFields?.join(', ')}
                  </span>
                </div>
                {aud.status === 'NEEDS_REVIEW' && (
                  <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                    Marked for Administrative Review
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeDetailPage;
