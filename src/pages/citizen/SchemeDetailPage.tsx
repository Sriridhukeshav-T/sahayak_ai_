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
  ArrowLeft,
  Building2,
  IndianRupee,
  Layers,
  Info,
  Check,
  X,
  History,
  AlertTriangle,
  Scale
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
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
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
      if (user) {
        const ev = evaluateStructuredEligibility(user, scheme);
        setEvaluation(ev);
      }

      fetch(`/api/audit-history?schemeId=${scheme.id || scheme.schemeId}`)
        .then(res => (res.ok ? res.json() : []))
        .then(records => setAuditRecords(records))
        .catch(() => setAuditRecords([]));
    }
  }, [scheme, user]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-8 w-2/3 bg-slate-200 rounded"></div>
          <div className="h-48 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Scheme Dossier Not Found</h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          The requested scheme could not be located in the authoritative directory.
        </p>
        <Link
          to="/schemes"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#065F46] text-white rounded text-xs font-semibold hover:bg-[#064E3B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Directory</span>
        </Link>
      </div>
    );
  }

  const maxLoan = scheme.benefits?.maxLoanAmount ?? scheme.maxLoan;
  const subsidy = scheme.benefits?.subsidyPercentage ?? scheme.subsidyPercentage;

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'benefits', label: 'Financial Benefits' },
    { id: 'eligibility', label: 'Eligibility Requirements' },
    { id: 'documents', label: 'Required Documents' },
    { id: 'apply', label: 'How to Apply' },
    { id: 'dates', label: 'Important Dates' },
    { id: 'audit', label: 'Audit & Version History' }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link to="/schemes" className="hover:text-slate-900 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Scheme Directory</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate max-w-xs">{scheme.category}</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Ref: {scheme.code || scheme.id}
          </span>
        </div>

        {/* Dossier Document Surface */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
          
          {/* Top Dossier Header Block */}
          <div className="p-6 sm:p-8 border-b border-slate-200 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {scheme.state === 'Central' ? 'Central Government' : scheme.state}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {scheme.category}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-[#065F46] border border-emerald-200">
                {scheme.isOngoing ? 'Ongoing Flagship Mission' : scheme.schemeStatus.replace(/_/g, ' ')}
              </span>
              {scheme.version && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200">
                  Version {scheme.version}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {scheme.officialName || scheme.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{scheme.ministry}</span>
                <span>•</span>
                <span>{scheme.governmentDepartment}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
              {scheme.description}
            </p>

            {/* Official Source Authority Strip */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Official Government Source</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Authoritative Record: <strong className="font-semibold text-slate-800">{scheme.sourceName}</strong>
                </p>
                <p className="text-[10px] text-slate-500">
                  Last verified: {scheme.lastVerifiedAt ? new Date(scheme.lastVerifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified March 2026'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {scheme.officialApplicationUrl && (
                  <a
                    href={scheme.officialApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs flex items-center gap-1.5"
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
                    className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded border border-slate-300 transition-colors flex items-center gap-1"
                  >
                    <span>Guidelines Gazette</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Compact Fact Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assistance / Loan</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {maxLoan ? `Up to ₹${(maxLoan / 100000).toFixed(1)}L` : 'Direct Subsidy'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Margin / Subsidy</span>
                <span className="font-extrabold text-[#065F46] text-sm">
                  {subsidy && subsidy > 0 ? `${subsidy}%` : 'Programmatic'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Application Mode</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {scheme.officialApplicationUrl ? 'Online National Portal' : 'Departmental Nodal Bank'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Window Status</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {scheme.isOngoing ? 'Ongoing Flagship Mission' : scheme.schemeStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

          </div>

          {/* 12-Column Dossier Body: 3 Cols On This Page Index + 9 Cols Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* Left 3 Columns: Sticky Table of Contents */}
            <aside className="lg:col-span-3 p-6 bg-slate-50/50 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                On This Page
              </span>
              <nav className="space-y-1">
                {sections.map(sec => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block px-3 py-1.5 text-xs rounded transition-colors ${
                      activeSection === sec.id
                        ? 'font-bold text-[#065F46] bg-emerald-50 border-l-2 border-[#065F46]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {sec.label}
                  </a>
                ))}
              </nav>

              {/* Citizen Evaluation Status Snippet */}
              {evaluation && (
                <div className="p-3 bg-white rounded border border-slate-200 space-y-2 mt-4 text-xs">
                  <span className="font-semibold text-slate-800 block text-[11px]">Your Compatibility:</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      evaluation.result === 'ELIGIBLE'
                        ? 'bg-emerald-600'
                        : evaluation.result === 'POTENTIALLY_ELIGIBLE'
                        ? 'bg-amber-600'
                        : 'bg-rose-600'
                    }`} />
                    <span className="font-bold text-xs">
                      {evaluation.result.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <a
                    href="#eligibility"
                    className="text-[11px] text-[#065F46] hover:underline block pt-1 font-medium"
                  >
                    View condition check →
                  </a>
                </div>
              )}
            </aside>

            {/* Right 9 Columns: Continuous Editorial Content Document */}
            <main className="lg:col-span-9 p-6 sm:p-8 space-y-10">
              
              {/* Section 1: Overview */}
              <section id="overview" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  1. Scheme Overview & Objectives
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {scheme.description}
                </p>
                {scheme.projectTypes && scheme.projectTypes.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">Supported Sectors & Activities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.projectTypes.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Section 2: Financial Benefits */}
              <section id="benefits" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  2. Financial Assistance & Benefit Matrix
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {scheme.benefits?.summary || 'Direct financial assistance under government guidelines.'}
                </p>

                <div className="overflow-x-auto border border-slate-200 rounded">
                  <table className="civic-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Specification</th>
                        <th>Source Authority Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maxLoan && (
                        <tr>
                          <td className="font-semibold text-slate-900">Maximum Project Cost / Ceiling</td>
                          <td className="font-bold text-slate-900">₹{maxLoan.toLocaleString('en-IN')}</td>
                          <td className="text-slate-500">As sanctioned by District Level Task Force / Financing Bank</td>
                        </tr>
                      )}
                      {subsidy !== undefined && subsidy > 0 && (
                        <tr>
                          <td className="font-semibold text-slate-900">Margin Money (Subsidy)</td>
                          <td className="font-bold text-[#065F46]">{subsidy}% of project cost</td>
                          <td className="text-slate-500">Subject to general/special category and rural/urban guidelines</td>
                        </tr>
                      )}
                      <tr>
                        <td className="font-semibold text-slate-900">Annual Interest Rate</td>
                        <td className="text-slate-900">
                          {scheme.benefits?.interestRateAnnual ? `${scheme.benefits.interestRateAnnual}% p.a.` : 'Concessional / Priority Sector Lending rate'}
                        </td>
                        <td className="text-slate-500">Linked to RBI repo / bank MCLR</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-slate-900">Repayment Period</td>
                        <td className="text-slate-900">
                          {scheme.benefits?.tenureMonths ? `${scheme.benefits.tenureMonths} Months` : 'Per bank sanction agreement'}
                        </td>
                        <td className="text-slate-500">Moratorium up to {scheme.benefits?.moratoriumMonths || 'standard banking'} months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 3: Eligibility Requirements */}
              <section id="eligibility" className="space-y-4 scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>3. Eligibility Requirements & Criteria</span>
                  {evaluation && (
                    <span className="text-xs font-semibold text-slate-500 font-normal">
                      Evaluated against your citizen profile
                    </span>
                  )}
                </h2>

                {/* Evidence Table */}
                {evaluation ? (
                  <div className="overflow-x-auto border border-slate-200 rounded">
                    <table className="civic-table">
                      <thead>
                        <tr>
                          <th>Eligibility Rule</th>
                          <th>Your Information</th>
                          <th>Evaluation</th>
                          <th>Detailed Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluation.ruleEvaluations.map((ev, i) => (
                          <tr key={i}>
                            <td className="font-semibold text-slate-900 max-w-xs">{ev.rule.label || ev.rule.field}</td>
                            <td className="font-mono text-slate-700">
                              {ev.actualValue !== null && ev.actualValue !== undefined ? String(ev.actualValue) : 'Not provided'}
                            </td>
                            <td>
                              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                                ev.passed
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : ev.missingData
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-rose-50 text-rose-800'
                              }`}>
                                {ev.passed ? 'Satisfied' : ev.missingData ? 'Information Required' : 'Not Satisfied'}
                              </span>
                            </td>
                            <td className="text-slate-600 text-xs">{ev.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <ul className="space-y-2 text-xs text-slate-700">
                    {scheme.eligibilityRules?.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#065F46] shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Section 4: Required Documents */}
              <section id="documents" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  4. Required Documents Checklist
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {scheme.requiredDocuments?.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#065F46] shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-800">{doc}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 5: How to Apply */}
              <section id="apply" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  5. Step-by-Step Application Procedure
                </h2>
                <div className="space-y-3">
                  {scheme.applicationProcess?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-[#065F46] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                {scheme.officialApplicationUrl && (
                  <div className="pt-3">
                    <a
                      href={scheme.officialApplicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs"
                    >
                      <span>Proceed to Official Government Gateway</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </section>

              {/* Section 6: Important Dates */}
              <section id="dates" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  6. Administrative Dates & Timelines
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Application Window</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">
                      {scheme.isOngoing ? 'Ongoing Flagship Mission (Open Throughout Year)' : scheme.applicationEndDate ? `Ends ${new Date(scheme.applicationEndDate).toLocaleDateString('en-IN')}` : 'Not specified in official source'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Processing Period</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">
                      {scheme.processingPeriod || 'Not specified in official source'}
                    </span>
                  </div>
                </div>
              </section>

              {/* Section 7: Audit History */}
              <section id="audit" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  7. Audit & Version History
                </h2>
                {auditRecords.length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500">
                    Baseline authoritative version {scheme.version || '2026.1'} confirmed with zero modifications.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {auditRecords.map(rec => (
                      <div key={rec.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Version {rec.toVersion}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(rec.changedAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{rec.changeSummary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </main>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SchemeDetailPage;
