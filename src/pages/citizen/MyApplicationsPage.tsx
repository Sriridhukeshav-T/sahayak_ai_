import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Plus,
  ExternalLink,
  Info,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Application, ApplicationStatus, StatusOrigin } from '../../types/application';

export const MyApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const { applications, refreshAppData } = useAppData();
  const { t } = useLanguage();

  const userApps = applications.filter(a => !user?.id || a.userId === user.id || a.userId === 'USR-CITIZEN-001');
  const [selectedApp, setSelectedApp] = useState<Application | null>(userApps[0] || null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);

  // New Application Track Form State
  const [newRefNumber, setNewRefNumber] = useState('');
  const [newSchemeName, setNewSchemeName] = useState('Prime Minister’s Employment Generation Programme (PMEGP)');
  const [newSchemeId, setNewSchemeId] = useState('SCH-PMEGP-001');
  const [newPortalUrl, setNewPortalUrl] = useState('https://www.kviconline.gov.in/pmegpeportal/');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status update modal state
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('APPROVED');

  useEffect(() => {
    if (userApps.length > 0 && !selectedApp) {
      setSelectedApp(userApps[0]);
    } else if (selectedApp) {
      // Keep selected app fresh
      const updated = userApps.find(a => a.id === selectedApp.id);
      if (updated) setSelectedApp(updated);
    }
  }, [applications]);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefNumber.trim()) return;

    setIsSubmitting(true);
    const nowIso = new Date().toISOString();
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 30);

    const newApp: Partial<Application> = {
      id: newRefNumber.trim(),
      userId: user?.id || 'USR-CITIZEN-001',
      schemeId: newSchemeId,
      schemeName: newSchemeName,
      schemeCategory: 'Micro Enterprise',
      officialApplicationRefNumber: newRefNumber.trim(),
      officialPortalUrl: newPortalUrl,
      status: 'SUBMITTED',
      statusOrigin: 'USER_REPORTED',
      submittedAt: nowIso,
      updatedAt: nowIso,
      waitingPeriodStart: nowIso,
      expectedDecisionDate: expDate.toISOString(),
      waitingPeriodStatus: 'WAITING_PERIOD',
      documents: [
        { name: 'Aadhaar Card', status: 'Verified' },
        { name: 'Income Certificate', status: 'Pending' }
      ],
      timeline: [
        {
          status: 'SUBMITTED',
          title: 'Application Recorded in SSahayaka',
          description: 'Reference number recorded as user-reported on platform.',
          timestamp: nowIso,
          completed: true,
          statusOrigin: 'USER_REPORTED'
        }
      ]
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
      if (res.ok) {
        const data = await res.json();
        await refreshAppData();
        setSelectedApp(data.application || newApp as Application);
        setShowTrackModal(false);
        setNewRefNumber('');
      }
    } catch (err) {
      console.error('Failed to create application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setIsSubmitting(true);

    const nowIso = new Date().toISOString();
    const updatedTimeline = [
      ...selectedApp.timeline,
      {
        status: targetStatus,
        title: targetStatus === 'APPROVED' ? 'Marked Approved (User-reported)' : `Status Updated to ${targetStatus}`,
        description: targetStatus === 'APPROVED'
          ? 'You reported that your application was approved. Please verify through the official government portal.'
          : `Citizen recorded status change to ${targetStatus}.`,
        timestamp: nowIso,
        completed: true,
        statusOrigin: 'USER_REPORTED' as StatusOrigin
      }
    ];

    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          statusOrigin: 'USER_REPORTED',
          timeline: updatedTimeline
        })
      });
      if (res.ok) {
        await refreshAppData();
        setShowStatusUpdateModal(false);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'UNDER_REVIEW':
      case 'PARTNER_REVIEW':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'APPROVED':
      case 'SANCTIONED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getWaitingPeriodBadge = (waitingStatus?: string, expectedDate?: string) => {
    if (!expectedDate) return null;
    const now = new Date();
    const target = new Date(expectedDate);
    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0 || waitingStatus === 'WAITING_PERIOD_COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Waiting Period Concluded ({expectedDate ? new Date(expectedDate).toLocaleDateString('en-IN') : 'Passed'})
        </span>
      );
    }

    if (diffDays <= 5 || waitingStatus === 'WAITING_PERIOD_ENDING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Decision Expected Soon (~{diffDays} days remaining)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <Clock className="w-3.5 h-3.5 text-emerald-700" />
        In Waiting Period (~{diffDays} days to {new Date(expectedDate).toLocaleDateString('en-IN')})
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Tracker & Dossiers
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {userApps.length} Tracked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor waiting periods, record status changes, and track application references against official portals.
          </p>
        </div>

        <button
          onClick={() => setShowTrackModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Application</span>
        </button>
      </div>

      {userApps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">No applications tracked yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You can enter your government reference number to track waiting periods, or apply through verified scheme guidelines.
          </p>
          <button
            onClick={() => setShowTrackModal(true)}
            className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors"
          >
            Track Existing Government Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Applications List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
              Your Tracked Applications
            </span>

            {userApps.map(app => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-emerald-50/40 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800">{app.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{app.schemeName}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px] font-medium border border-slate-200">
                        {app.statusOrigin === 'OFFICIAL_INTEGRATION' ? 'Official Gate' : 'User-reported'}
                      </span>
                      <span>•</span>
                      <span>{new Date(app.submittedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Application Detailed Dossier (7 cols) */}
          {selectedApp && (
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-extrabold text-slate-900">{selectedApp.id}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedApp.status)}`}>
                      Status: {selectedApp.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{selectedApp.schemeName}</h3>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setShowStatusUpdateModal(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    Update Status
                  </button>
                  {selectedApp.officialPortalUrl && (
                    <a
                      href={selectedApp.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      title="Open Official Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Status Origin Notice Banner */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">
                    Status Source: {selectedApp.statusOrigin === 'OFFICIAL_INTEGRATION' ? 'Official Integration' : 'User-reported'}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {selectedApp.statusOrigin === 'OFFICIAL_INTEGRATION'
                      ? 'Status confirmed via official government gateway.'
                      : 'This status was recorded by the citizen. SSahayaka does not claim direct sanction authority. Please verify on the official government portal.'}
                  </p>
                </div>
              </div>

              {/* Waiting Period Indicator */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Waiting Period Timeline</span>
                  {getWaitingPeriodBadge(selectedApp.waitingPeriodStatus, selectedApp.expectedDecisionDate)}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Submitted On</span>
                    <span className="font-medium text-slate-800">
                      {new Date(selectedApp.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Expected Decision Date</span>
                    <span className="font-medium text-slate-800">
                      {selectedApp.expectedDecisionDate
                        ? new Date(selectedApp.expectedDecisionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Not specified in official source'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lifecycle Progress Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recorded Timeline History
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedApp.timeline?.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                          item.completed
                            ? 'bg-emerald-700 text-white'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {item.completed ? '✓' : idx + 1}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <p className="font-bold text-slate-900">
                            {item.title}
                          </p>
                          {item.timestamp && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(item.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                        <span className="inline-block text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                          Origin: {item.statusOrigin || 'USER_REPORTED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Checklist */}
              {selectedApp.documents && selectedApp.documents.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Uploaded / Linked Documents
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedApp.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-700 font-medium truncate">{doc.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal: Track New Application */}
      {showTrackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Track Government Application</h3>
            <p className="text-xs text-slate-500">
              Enter the application reference number generated on the official government portal.
            </p>

            <form onSubmit={handleCreateApplication} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Reference Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APP-2026-901 or PMEGP-UP-2026-92841"
                  value={newRefNumber}
                  onChange={e => setNewRefNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={newSchemeName}
                  onChange={e => setNewSchemeName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Portal URL</label>
                <input
                  type="url"
                  value={newPortalUrl}
                  onChange={e => setNewPortalUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTrackModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording...' : 'Record Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Status */}
      {showStatusUpdateModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <h3 className="font-bold text-base text-slate-900">Update Application Status</h3>
            <p className="text-slate-500">
              Record a new status update for application <span className="font-mono font-bold text-slate-800">{selectedApp.id}</span>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">New Status</label>
                <select
                  value={targetStatus}
                  onChange={e => setTargetStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="ADDITIONAL_INFORMATION_REQUIRED">ADDITIONAL INFO REQUIRED</option>
                  <option value="APPROVED">APPROVED (User-reported)</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              {targetStatus === 'APPROVED' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                  <span className="font-bold block">User-Reported Status Notice</span>
                  <p className="text-[11px] leading-relaxed">
                    This status will be tagged as <strong>User-reported</strong>. SSahayaka does not claim official government integration. You will receive a reminder to verify your sanction letter on the official portal.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStatusUpdateModal(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isSubmitting}
                className="px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
