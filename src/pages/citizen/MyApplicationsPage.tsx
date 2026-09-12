import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  Calendar,
  Layers,
  IndianRupee,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Application, ApplicationStatus } from '../../types/application';
import { DemoBadge } from '../../components/common/DemoBadge';

export const MyApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const { applications } = useAppData();
  const { t } = useLanguage();

  const userApps = applications.filter(a => a.userId === user.id);
  const [selectedApp, setSelectedApp] = useState<Application | null>(userApps[0] || null);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DOCUMENT_CHECK':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FORWARDED_TO_PARTNER':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'PARTNER_REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SANCTIONED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DISBURSED':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('My Applications')}
          </h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {userApps.length} {t('Tracked Dossiers')}
          </span>
          <DemoBadge />
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('Live lifecycle tracking for institutional concessional finance applications.')}
        </p>
      </div>

      {userApps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">{t('No applications submitted yet')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('Find your matched scheme and submit your application to start tracking progress.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Applications List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
              {t('Your Active Cases')}
            </span>

            {userApps.map(app => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-900">{app.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                      {t(app.status) || app.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{app.schemeName}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{app.partnerName}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
                    <span className="font-bold text-slate-900">₹{app.loanAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Application Timeline & Detailed Inspector (7 cols) */}
          {selectedApp && (
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
              
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-extrabold text-blue-900">{selectedApp.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(selectedApp.status)}`}>
                      {t(selectedApp.status) || selectedApp.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{selectedApp.schemeName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedApp.partnerName} • {selectedApp.partnerBranch}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-400 block">{t('Sanction Target')}</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{selectedApp.loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('Application Lifecycle Progress')}
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedApp.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                          item.completed
                            ? 'bg-emerald-600 text-white'
                            : item.current
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {item.completed ? '✓' : idx + 1}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${
                            item.current ? 'text-blue-700' : item.completed ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {t(item.title) || item.title}
                          </p>
                          {item.timestamp && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(item.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {t(item.description) || item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              {selectedApp.remarks && (
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t('Officer Remarks & Appraiser Notes:')}</span>
                  </span>
                  <p className="text-[11px] text-blue-800 leading-relaxed pl-4">
                    {selectedApp.remarks}
                  </p>
                </div>
              )}

              {/* Key Specs Row */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('Interest Rate')}</span>
                  <span className="font-bold text-emerald-700">{selectedApp.interestRate}% p.a.</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('Repayment Tenure')}</span>
                  <span className="font-bold text-slate-800">{selectedApp.tenureMonths} {t('Months')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('Estimated EMI')}</span>
                  <span className="font-bold text-blue-700">₹{selectedApp.estimatedEMI.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
