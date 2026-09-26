import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Clock,
  FileText,
  Building2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Layers,
  FileCheck2,
  Calculator,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { rankSchemesForUser } from '../../services/schemeMatcherService';
import { SchemeCard } from '../../components/schemes/SchemeCard';
import { SchemeCompareModal } from '../../components/schemes/SchemeCompareModal';
import { Scheme } from '../../types/scheme';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { schemes, partners, applications, notifications } = useAppData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [comparedSchemes, setComparedSchemes] = useState<Scheme[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Dynamic ranking based on user profile
  const rankedSchemes = rankSchemesForUser(user, schemes, partners);
  const topSchemes = rankedSchemes.slice(0, 3);

  const userApplications = applications.filter(a => !user?.id || a.userId === user.id || a.userId === 'USR-CITIZEN-001');

  // Filter deadlines or urgent notifications
  const deadlineNotifs = notifications.filter(n => n.type?.includes('DEADLINE') || n.priority === 'CRITICAL' || n.priority === 'HIGH').slice(0, 2);

  const handleToggleCompare = (scheme: Scheme) => {
    if (comparedSchemes.find(s => s.id === scheme.id)) {
      setComparedSchemes(comparedSchemes.filter(s => s.id !== scheme.id));
    } else {
      if (comparedSchemes.length >= 3) {
        alert('You can compare a maximum of 3 schemes.');
        return;
      }
      const updated = [...comparedSchemes, scheme];
      setComparedSchemes(updated);
      if (updated.length >= 2) setShowCompareModal(true);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Citizen Service Hub
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Citizen'}
            </h1>
            <p className="text-xs text-slate-600 max-w-xl">
              Profile: {user.projectType || 'Micro Enterprise'} • {user.district ? `${user.district}, ` : ''}{user.state || 'India'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/find-scheme"
              className="px-4 py-2 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Check Eligibility</span>
            </Link>
            <Link
              to="/schemes"
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors"
            >
              Explore Directory
            </Link>
          </div>
        </div>

        {/* 1. Your Applications */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Applications</h2>
              <p className="text-xs text-slate-500">Track recorded government application reference numbers and waiting periods</p>
            </div>
            <Link
              to="/applications"
              className="text-xs font-semibold text-[#065F46] hover:underline flex items-center gap-1"
            >
              <span>View all applications</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {userApplications.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border border-slate-200 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-800">No applications currently tracked</p>
              <p className="text-[11px] text-slate-500">
                You can record an application reference number from an official government portal to monitor its waiting period.
              </p>
              <Link
                to="/applications"
                className="inline-block px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded mt-1"
              >
                Track Government Reference Number
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userApplications.slice(0, 2).map(app => (
                <div
                  key={app.id}
                  className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800">{app.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#065F46] border border-emerald-200">
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-slate-900 leading-snug">{app.schemeName}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px]">
                        {app.statusOrigin === 'OFFICIAL_INTEGRATION' ? 'Official Integration' : 'User-Reported'}
                      </span>
                      <span>•</span>
                      <span>Submitted: {new Date(app.submittedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Expected Decision Date</span>
                      <span className="font-semibold text-slate-800">
                        {app.expectedDecisionDate ? new Date(app.expectedDecisionDate).toLocaleDateString('en-IN') : 'Standard Waiting Period'}
                      </span>
                    </div>
                    <Link
                      to="/applications"
                      className="text-xs font-semibold text-[#065F46] hover:underline"
                    >
                      View Dossier →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. Schemes You May Qualify For */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Schemes you may qualify for</h2>
              <p className="text-xs text-slate-500">Evaluated against your trade, income, and state profile</p>
            </div>
            <Link
              to="/schemes"
              className="text-xs font-semibold text-[#065F46] hover:underline flex items-center gap-1"
            >
              <span>Explore full repository</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topSchemes.map(({ scheme, match }) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                match={match}
                onSelectForCompare={handleToggleCompare}
                isCompared={Boolean(comparedSchemes.find(s => s.id === scheme.id))}
              />
            ))}
          </div>
        </section>

        {/* 3. Upcoming Deadlines & Important Notices */}
        <section className="space-y-3">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-base font-bold text-slate-900">Upcoming deadlines & notices</h2>
            <p className="text-xs text-slate-500">Timely administrative announcements from official gazettes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Ongoing Central Programs</span>
              </div>
              <p className="text-xs text-slate-700">
                Flagship schemes (PMEGP, MUDRA, PM-KISAN, PM Surya Ghar) operate on ongoing mission schedules with no immediate window closure.
              </p>
              <div className="pt-1">
                <Link to="/schemes" className="text-xs font-semibold text-[#065F46] hover:underline">
                  Review mission guidelines →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#065F46]" />
                <span>Document Readiness</span>
              </div>
              <p className="text-xs text-slate-700">
                Keep primary documents (Aadhaar, PAN, Bank Statements, Project Report) up to date to expedite portal verification.
              </p>
              <div className="pt-1">
                <Link to="/documents" className="text-xs font-semibold text-[#065F46] hover:underline">
                  Check required documents →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Quick Civic Services */}
        <section className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Link
              to="/find-scheme"
              className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors space-y-1 block"
            >
              <ShieldCheck className="w-4 h-4 text-[#065F46]" />
              <span className="font-bold text-slate-900 block">Eligibility Check</span>
              <span className="text-[11px] text-slate-500 block">Deterministic rule testing</span>
            </Link>

            <Link
              to="/documents"
              className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors space-y-1 block"
            >
              <FileCheck2 className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-900 block">Document Guide</span>
              <span className="text-[11px] text-slate-500 block">Checklist by scheme</span>
            </Link>

            <Link
              to="/affordability"
              className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors space-y-1 block"
            >
              <Calculator className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-900 block">EMI Simulator</span>
              <span className="text-[11px] text-slate-500 block">Cashflow & subsidy impact</span>
            </Link>

            <Link
              to="/partners"
              className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors space-y-1 block"
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-900 block">Channel Partners</span>
              <span className="text-[11px] text-slate-500 block">Public sector banks & DICs</span>
            </Link>
          </div>
        </section>

      </div>

      {/* Compare Modal */}
      {showCompareModal && (
        <SchemeCompareModal
          schemes={comparedSchemes}
          onClose={() => setShowCompareModal(false)}
          onRemoveScheme={id => setComparedSchemes(prev => prev.filter(s => s.id !== id))}
        />
      )}

    </div>
  );
};

export default DashboardPage;
