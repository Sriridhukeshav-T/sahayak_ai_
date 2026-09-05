import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calculator,
  Compass,
  FileText,
  HelpCircle,
  PiggyBank
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { rankSchemesForUser } from '../../services/schemeMatcherService';
import { rankPartnersForUser } from '../../services/partnerRoutingService';
import { evaluateDocumentReadiness } from '../../services/documentService';
import { SchemeCard } from '../../components/schemes/SchemeCard';
import { ExplainableModal } from '../../components/schemes/ExplainableModal';
import { SchemeCompareModal } from '../../components/schemes/SchemeCompareModal';
import { Scheme } from '../../types/scheme';
import { MatchBreakdown } from '../../types/common';
import { DemoBadge } from '../../components/common/DemoBadge';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { schemes, partners, applications, activeScheme } = useAppData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [explainScheme, setExplainScheme] = useState<{ scheme: Scheme; match: MatchBreakdown } | null>(null);
  const [comparedSchemes, setComparedSchemes] = useState<Scheme[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Dynamic ranking based on user profile
  const rankedSchemes = rankSchemesForUser(user, schemes, partners);
  const topSchemes = rankedSchemes.slice(0, 3);

  const rankedPartners = rankPartnersForUser(user, activeScheme, partners);
  const bestPartner = rankedPartners[0];

  const docReport = evaluateDocumentReadiness(activeScheme, user.uploadedDocuments);
  const userApplications = applications.filter(a => a.userId === user.id);
  const activeApp = userApplications[0];

  const handleToggleCompare = (scheme: Scheme) => {
    if (comparedSchemes.find(s => s.id === scheme.id)) {
      setComparedSchemes(comparedSchemes.filter(s => s.id !== scheme.id));
    } else {
      if (comparedSchemes.length >= 3) {
        alert('You can compare a maximum of 3 schemes simultaneously.');
        return;
      }
      const updated = [...comparedSchemes, scheme];
      setComparedSchemes(updated);
      if (updated.length >= 2) setShowCompareModal(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
              Personalized Dashboard
            </span>
            <DemoBadge />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good morning, {user.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
            “Let's move your {user.projectType || 'business'} idea one step closer to reality. Here is your current financial profile readiness and top matched schemes.”
          </p>
        </div>

        {/* Quick Action Button inside Banner */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/find-scheme"
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-blue-50 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Find My Scheme (AI Match)</span>
          </Link>
          <Link
            to="/affordability"
            className="px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4" />
            <span>Affordability Simulator</span>
          </Link>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Profile Readiness */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 block">Profile Completion</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900">85%</span>
            <span className="text-[10px] text-teal-600 font-bold">Strong</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full w-[85%]" />
          </div>
        </div>

        {/* Recommended Schemes */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 block">Recommended Schemes</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-blue-700">{topSchemes.length}</span>
            <span className="text-[10px] text-blue-600 font-bold">Matched</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            Top: {topSchemes[0]?.match.totalScore}% compatibility
          </p>
        </div>

        {/* Application Status */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 block">Application Status</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900">
              {activeApp ? '1 Active' : '0 Pending'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            {activeApp ? activeApp.status.replace(/_/g, ' ') : 'Ready to apply'}
          </p>
        </div>

        {/* Documents Ready */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 block">Documents Ready</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-700">
              {docReport.completedRequired} / {docReport.totalRequired}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">{docReport.readinessPercentage}%</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            {docReport.canSubmit ? '✓ Eligible to submit' : 'Upload missing docs'}
          </p>
        </div>

        {/* Best Partner */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 block">Best Channel Partner</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-purple-700">
              {bestPartner ? `${bestPartner.suitability.distanceKm} km` : 'Local'}
            </span>
            <span className="text-[10px] text-purple-600 font-bold">Fastest</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate" title={bestPartner?.partner.name}>
            {bestPartner ? bestPartner.partner.name : 'Channelizing Agency'}
          </p>
        </div>

      </div>

      {/* Your Financial Journey Interactive Stepper */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Your Financial Journey</h3>
            <p className="text-xs text-slate-500">Track your step-by-step path from dream to disbursement</p>
          </div>
          <span className="text-xs font-bold text-blue-700">Step 4 of 7</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-xs">
          {[
            { step: '1. Profile', status: 'done', link: '/profile' },
            { step: '2. AI Match', status: 'done', link: '/find-scheme' },
            { step: '3. Affordability', status: 'done', link: '/affordability' },
            { step: '4. Documents', status: 'current', link: '/documents' },
            { step: '5. Partner', status: 'upcoming', link: '/partners' },
            { step: '6. Application', status: 'upcoming', link: '/apply' },
            { step: '7. Tracking', status: 'upcoming', link: '/applications' }
          ].map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                item.status === 'done'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : item.status === 'current'
                  ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="block text-[11px] leading-tight">{item.step}</span>
              <span className="block text-[9px] uppercase tracking-wider opacity-80 mt-0.5">
                {item.status === 'done' ? '✓ Completed' : item.status === 'current' ? 'In Progress' : 'Pending'}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Scheme Recommendations Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Top Matched Schemes for You</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                AI Ranked
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Transparently matched based on your income (₹{(user.income / 100000).toFixed(1)}L), goal ({user.projectType}), and district ({user.district})
            </p>
          </div>

          <div className="flex items-center gap-2">
            {comparedSchemes.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
              >
                Compare ({comparedSchemes.length}/3)
              </button>
            )}
            <Link
              to="/schemes"
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline"
            >
              <span>View All 50+ Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topSchemes.map(({ scheme, match }) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              match={match}
              onOpenExplain={(s, m) => setExplainScheme({ scheme: s, match: m })}
              onSelectForCompare={handleToggleCompare}
              isCompared={Boolean(comparedSchemes.find(c => c.id === scheme.id))}
            />
          ))}
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Quick Tools & Guidance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/affordability"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">
                Can I Afford This?
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Simulate your EMI and remaining disposable monthly cash surplus.
              </p>
            </div>
          </Link>

          <Link
            to="/documents"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors">
                Prepare Documents
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                AI readiness checklist tailored to your target scheme.
              </p>
            </div>
          </Link>

          <Link
            to="/partners"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
                Find a Partner
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Geo-spatial router avoids congested bank branches.
              </p>
            </div>
          </Link>

          <Link
            to="/literacy"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex items-start gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-700 transition-colors">
                Learn Before Borrowing
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Understand reducing interest, moratorium, and test your knowledge.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Explainable Modal */}
      {explainScheme && (
        <ExplainableModal
          scheme={explainScheme.scheme}
          match={explainScheme.match}
          onClose={() => setExplainScheme(null)}
        />
      )}

      {/* Scheme Comparison Modal */}
      {showCompareModal && (
        <SchemeCompareModal
          schemes={comparedSchemes}
          onClose={() => setShowCompareModal(false)}
          onRemoveScheme={id => setComparedSchemes(comparedSchemes.filter(s => s.id !== id))}
        />
      )}

    </div>
  );
};
