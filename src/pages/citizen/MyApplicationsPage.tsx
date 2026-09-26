import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  Calendar,
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
import { StorageService } from '../../services/storageService';

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
  const [newPortalUrl, setNewPortalUrl] = useState('https://pmegp.msme.gov.in/');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status update modal state
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('APPROVED');

  useEffect(() => {
    if (userApps.length > 0 && !selectedApp) {
      setSelectedApp(userApps[0]);
    } else if (selectedApp) {
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
          title: 'Application Recorded in Sahayak AI',
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
        setSelectedApp(data);
        setShowTrackModal(false);
        setNewRefNumber('');
      }
    } catch {
      alert('Could not record application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setIsSubmitting(true);

    const remarks = `Citizen updated status to ${targetStatus}.`;
    const updates: Partial<Application> = {
      status: targetStatus,
      statusOrigin: 'USER_REPORTED' as StatusOrigin,
      remarks,
      updatedAt: new Date().toISOString()
    };

    // 1. Immediately update local storage / context synchronously so UI is instant & robust
    StorageService.updateApplicationStatus(selectedApp.id, targetStatus, remarks);
    const locallyUpdated = StorageService.updateApplication(selectedApp.id, updates);
    if (locallyUpdated) {
      setSelectedApp(locallyUpdated);
    }

    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedApp(updated);
      }
      await refreshAppData();
      setShowStatusUpdateModal(false);
    } catch {
      // Even if network fails or in offline/mock mode, local state is preserved
      await refreshAppData();
      setShowStatusUpdateModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stages: { key: ApplicationStatus; label: string }[] = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'APPROVED', label: 'Decision / Approval' },
    { key: 'DISBURSED', label: 'Disbursement' }
  ];

  const getStageIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'DRAFT': return -1;
      case 'SUBMITTED': return 0;
      case 'DOCUMENT_CHECK':
      case 'FORWARDED_TO_PARTNER':
      case 'PARTNER_REVIEW':
      case 'UNDER_REVIEW': return 1;
      case 'SANCTIONED':
      case 'APPROVED': return 2;
      case 'DISBURSED': return 3;
      case 'REJECTED': return 2;
      default: return 0;
    }
  };

  const currentStageIdx = selectedApp ? getStageIndex(selectedApp.status) : 0;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Case Management
              </span>
              <span className="text-[11px] font-medium text-slate-600">
                Waiting Period Tracking
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor milestones, record status changes, and track official government reference numbers.
            </p>
          </div>

          <button
            onClick={() => setShowTrackModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track New Application</span>
          </button>
        </div>

        {userApps.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-10 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-sm text-slate-800">No applications recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Enter your official government application reference number to track waiting periods and milestones.
            </p>
            <button
              onClick={() => setShowTrackModal(true)}
              className="px-4 py-2 bg-[#065F46] text-white text-xs font-semibold rounded hover:bg-[#064E3B] transition-colors"
            >
              Track Government Application
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 4 Columns: Applications Selector */}
            <aside className="lg:col-span-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                Your Recorded Applications ({userApps.length})
              </span>

              <div className="space-y-2">
                {userApps.map(app => {
                  const isSelected = selectedApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-colors space-y-1.5 ${
                        isSelected
                          ? 'bg-white border-[#065F46] ring-1 ring-[#065F46] shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">{app.id}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h4 className="font-semibold text-xs text-slate-800 line-clamp-1">{app.schemeName}</h4>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="text-[10px] text-slate-600 font-medium">
                          {app.statusOrigin === 'OFFICIAL_INTEGRATION' ? 'Official Gate' : 'Reported by you'}
                        </span>
                        <span>•</span>
                        <span>{new Date(app.submittedAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Right 8 Columns: Case Management Dossier */}
            {selectedApp && (
              <main className="lg:col-span-8 bg-white rounded-lg border border-slate-200 p-6 space-y-6">
                
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-extrabold text-slate-900">{selectedApp.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#065F46] border border-emerald-200">
                        {selectedApp.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">{selectedApp.schemeName}</h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowStatusUpdateModal(true)}
                      className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                      Update Status
                    </button>
                    {selectedApp.officialPortalUrl && (
                      <a
                        href={selectedApp.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                        title="Open Official Portal"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Horizontal Progress Timeline (Desktop) & Vertical (Mobile) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Case Progression Timeline
                  </span>

                  <div className="hidden sm:grid grid-cols-4 gap-2 pt-2">
                    {stages.map((stage, idx) => {
                      const isPast = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      return (
                        <div key={stage.key} className="space-y-1.5 text-center">
                          <div className="relative flex items-center justify-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                              isPast
                                ? 'bg-[#065F46] text-white'
                                : isCurrent
                                ? 'bg-[#065F46] text-white ring-4 ring-emerald-100'
                                : 'bg-slate-100 text-slate-400 border border-slate-300'
                            }`}>
                              {isPast ? '✓' : idx + 1}
                            </div>
                            {idx < stages.length - 1 && (
                              <div className={`absolute left-1/2 right-[-50%] top-1/2 -translate-y-1/2 h-0.5 ${
                                idx < currentStageIdx ? 'bg-[#065F46]' : 'bg-slate-200'
                              }`} />
                            )}
                          </div>
                          <span className={`block text-xs ${isCurrent ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Vertical Fallback */}
                  <div className="sm:hidden space-y-2 pt-1">
                    {stages.map((stage, idx) => {
                      const isPast = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      return (
                        <div key={stage.key} className="flex items-center gap-2.5 text-xs">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isPast || isCurrent ? 'bg-[#065F46] text-white' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isPast ? '✓' : idx + 1}
                          </div>
                          <span className={isCurrent ? 'font-bold text-slate-900' : 'text-slate-600'}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Origin Notice Banner */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded flex items-start gap-2.5 text-xs">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800 block">
                      Status Origin: {selectedApp.statusOrigin === 'OFFICIAL_INTEGRATION' ? 'Verified Government Gateway' : 'Reported by Citizen'}
                    </span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {selectedApp.statusOrigin === 'OFFICIAL_INTEGRATION'
                        ? 'Confirmed through authoritative portal integration.'
                        : 'This status was recorded by the citizen. Sahayak AI does not claim direct sanction authority. Please verify official approval on the designated government portal.'}
                    </p>
                  </div>
                </div>

                {/* Waiting Period & Schedule Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Submission Timestamp</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(selectedApp.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Expected Decision Timeline</span>
                    <span className="font-semibold text-slate-800">
                      {selectedApp.expectedDecisionDate ? new Date(selectedApp.expectedDecisionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Standard Administrative Schedule'}
                    </span>
                  </div>
                </div>

                {/* Recorded Timeline History */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recorded Milestone Log
                  </h4>

                  <div className="space-y-3 pl-3 border-l-2 border-slate-200">
                    {selectedApp.timeline?.map((item, idx) => (
                      <div key={idx} className="relative pl-3 space-y-0.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{item.title}</span>
                          {item.timestamp && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(item.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600">{item.description}</p>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
                          Origin: {item.statusOrigin || 'USER_REPORTED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </main>
            )}

          </div>
        )}

      </div>

      {/* Modal: Track New Application */}
      {showTrackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Track Government Application</h3>
              <p className="text-xs text-slate-500">Record a reference number issued by an official government portal.</p>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Reference Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PMEGP-UP-2026-92841"
                  value={newRefNumber}
                  onChange={e => setNewRefNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={newSchemeName}
                  onChange={e => setNewSchemeName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Portal URL</label>
                <input
                  type="url"
                  value={newPortalUrl}
                  onChange={e => setNewPortalUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTrackModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording...' : 'Record Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Status */}
      {showStatusUpdateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-xl text-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Update Application Status</h3>
              <p className="text-[11px] text-slate-500">Record a milestone reported on the official portal.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-700 font-semibold">New Status</label>
              <select
                value={targetStatus}
                onChange={e => setTargetStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
              >
                <option value="UNDER_REVIEW">Under Review / Scrutiny</option>
                <option value="APPROVED">Approved / Sanctioned</option>
                <option value="DISBURSED">Disbursed / Credited</option>
                <option value="REJECTED">Clarification Required / Rejected</option>
              </select>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
              Status will be flagged as <strong>Citizen-reported</strong> and dispatches a verification notice.
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowStatusUpdateModal(false)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyApplicationsPage;
