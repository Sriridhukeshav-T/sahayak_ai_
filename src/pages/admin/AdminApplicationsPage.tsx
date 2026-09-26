import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { Application, ApplicationStatus } from '../../types/application';

const STATUS_FILTERS: (ApplicationStatus | 'ALL')[] = [
  'ALL',
  'SUBMITTED',
  'DOCUMENT_CHECK',
  'FORWARDED_TO_PARTNER',
  'PARTNER_REVIEW',
  'SANCTIONED',
  'DISBURSED',
  'REJECTED'
];

export const AdminApplicationsPage: React.FC = () => {
  const { applications, updateApplicationStatus } = useAppData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [inspectApp, setInspectApp] = useState<Application | null>(null);

  const filtered = applications.filter(a => {
    if (selectedStatus !== 'ALL' && a.status !== selectedStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q) ||
        a.schemeName.toLowerCase().includes(q) ||
        (a.partnerName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'DOCUMENT_CHECK': return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'FORWARDED_TO_PARTNER': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'PARTNER_REVIEW': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'SANCTIONED': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'DISBURSED': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'REJECTED': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Applications Lifecycle Oversight
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
              {applications.length} Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor state transitions, inspect credit appraisals, and manage sanction stages.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by application ID (e.g. SAH-2026-92841), applicant name, scheme, partner..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:border-emerald-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {STATUS_FILTERS.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Applicant & Location</th>
                <th className="py-3 px-4">Scheme & Target Amount</th>
                <th className="py-3 px-4">Channel Partner</th>
                <th className="py-3 px-4">Current Lifecycle State</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.slice(0, 50).map(app => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                    {app.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{app.applicantName}</p>
                    <span className="text-[11px] text-slate-400">{app.applicantDistrict}, {app.applicantState}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900 line-clamp-1">{app.schemeName}</p>
                    <span className="text-emerald-700 font-bold font-mono">
                      ₹{app.loanAmount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800 line-clamp-1">{app.partnerName}</p>
                    <span className="text-[10px] text-slate-400">{app.partnerType}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={app.status}
                      onChange={e => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg border focus:outline-none ${getStatusBadge(app.status)}`}
                    >
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="DOCUMENT_CHECK">DOCUMENT CHECK</option>
                      <option value="FORWARDED_TO_PARTNER">FORWARDED TO PARTNER</option>
                      <option value="PARTNER_REVIEW">PARTNER REVIEW</option>
                      <option value="SANCTIONED">SANCTIONED</option>
                      <option value="DISBURSED">DISBURSED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setInspectApp(app)}
                      className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Inspect full application dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Application Modal */}
      {inspectApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-extrabold text-blue-900">{inspectApp.id}</span>
                <h3 className="font-bold text-sm text-slate-900">Application Dossier Inspector</h3>
              </div>
              <button onClick={() => setInspectApp(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-md">
                <span className="text-slate-400 block text-[10px]">Applicant Name</span>
                <span className="font-bold text-slate-900">{inspectApp.applicantName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <span className="text-slate-400 block text-[10px]">Mobile</span>
                <span className="font-bold text-slate-900">{inspectApp.applicantMobile}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <span className="text-slate-400 block text-[10px]">Scheme</span>
                <span className="font-bold text-slate-900">{inspectApp.schemeName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <span className="text-slate-400 block text-[10px]">Sanction Amount</span>
                <span className="font-bold text-emerald-700 font-mono">₹{inspectApp.loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <span className="text-slate-400 block text-[10px]">Channel Partner</span>
                <span className="font-bold text-slate-900">{inspectApp.partnerName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md">
                <span className="text-slate-400 block text-[10px]">Match Compatibility</span>
                <span className="font-bold text-blue-700">{inspectApp.matchScore}%</span>
              </div>
            </div>

            {/* Lifecycle Timeline */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Application Timeline
              </h4>
              <div className="space-y-2 text-xs">
                {inspectApp.timeline.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 ${
                      t.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {t.completed ? '✓' : idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{t.title}</p>
                      <p className="text-[11px] text-slate-500">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectApp(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-md"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
