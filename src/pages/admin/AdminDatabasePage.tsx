import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  HardDrive,
  Users,
  Briefcase,
  Layers,
  Building2,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  X,
  Plus
} from 'lucide-react';
import { DbService } from '../../services/dbService';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Application } from '../../types/application';
import { UserProfile } from '../../types/user';

export const AdminDatabasePage: React.FC = () => {
  const { refreshAppData } = useAppData();
  const { t } = useLanguage();
  const [stats, setStats] = useState(DbService.getDbStats());
  const [backendHealth, setBackendHealth] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'users' | 'schemes' | 'partners'>('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectItem, setInspectItem] = useState<{ title: string; data: any } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [applications, setApps] = useState<Application[]>([]);
  const [users, setUsersList] = useState<UserProfile[]>([]);
  const [schemes, setSchemesList] = useState<any[]>([]);
  const [partners, setPartnersList] = useState<any[]>([]);

  const refreshData = () => {
    setStats(DbService.getDbStats());
    setApps(DbService.getApplications());
    setUsersList(DbService.getUsers());
    setSchemesList(DbService.getSchemes());
    setPartnersList(DbService.getPartners());
    DbService.getBackendHealth().then(h => {
      if (h) setBackendHealth(h);
    });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportBackup = () => {
    const backup = DbService.exportFullDatabase();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sahayak_db_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Database exported successfully as JSON backup!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        const ok = DbService.importFullDatabase(json);
        if (ok) {
          refreshData();
          refreshAppData();
          showToast('Database restored successfully from backup!');
        } else {
          showToast('Failed to parse database backup structure.');
        }
      } catch (err) {
        showToast('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteApplication = (id: string) => {
    if (window.confirm(`Are you sure you want to delete application ${id}?`)) {
      DbService.deleteApplication(id);
      refreshData();
      refreshAppData();
      showToast(`Application ${id} permanently deleted.`);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm(`Delete user ${id}? Associated sessions may be terminated.`)) {
      DbService.deleteUser(id);
      refreshData();
      showToast(`User ${id} removed.`);
    }
  };

  const handleCreateTestApplication = () => {
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const newApp: Application = {
      id: `SAH-2026-${randNum}`,
      userId: users[0]?.id || 'USR-CITIZEN-001',
      applicantName: users[0]?.name || 'Sunita Sharma',
      applicantMobile: users[0]?.mobile || '+91 98123 45678',
      applicantState: 'Maharashtra',
      applicantDistrict: 'Pune',
      schemeId: schemes[0]?.id || 'SCH-MCR-001',
      schemeName: schemes[0]?.name || 'National Micro-Credit Scheme',
      schemeCategory: schemes[0]?.category || 'Micro Enterprise',
      partnerId: partners[0]?.id || 'PTR-KL-001',
      partnerName: partners[0]?.name || 'State Channel Partner',
      partnerType: 'State Agency',
      partnerBranch: 'Pune District Annex',
      projectType: 'Food Processing / Agro',
      projectCost: 200000,
      ownContribution: 40000,
      loanAmount: 160000,
      interestRate: 4.5,
      tenureMonths: 36,
      estimatedEMI: 4760,
      matchScore: 95,
      status: 'SUBMITTED',
      statusOrigin: 'USER_REPORTED',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [
        { name: 'Aadhaar Card', status: 'Verified' },
        { name: 'Project Machinery Quotation', status: 'Verified' }
      ],
      timeline: [
        {
          status: 'SUBMITTED',
          title: 'Application Submitted',
          description: 'Received via Sahayak Portal.',
          timestamp: new Date().toISOString(),
          completed: true,
          current: true
        }
      ],
      remarks: 'Test dossier generated by Administrator for database simulation.'
    };

    DbService.createApplication(newApp);
    refreshData();
    refreshAppData();
    showToast(`Test Application ${newApp.id} created & saved to database!`);
  };

  const handleResetDatabase = () => {
    if (window.confirm('WARNING: This will reset all tables to clean default seed data. Proceed?')) {
      DbService.resetDatabase();
      refreshData();
      refreshAppData();
      showToast('Database reset to clean official seed state.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Database & Backend Storage
              </h1>
              <p className="text-xs text-slate-500">
                Inspect, export, and manage persistent browser database tables & real citizen dossiers
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCreateTestApplication}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors"
            title="Create a sample application to test real storage"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Test Application</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
            title="Download full database as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
            title="Restore database from JSON file"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Backup</span>
          </button>

          <button
            onClick={handleResetDatabase}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors"
            title="Reset database to default seed state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Real Database Server Status Banner */}
      <div className={`p-3.5 bg-gradient-to-r ${backendHealth?.mongodbConnected ? 'from-emerald-950 via-teal-900 to-cyan-950 border-emerald-400/40' : 'from-slate-900 via-slate-800 to-teal-950 border-slate-700'} text-white rounded-2xl shadow-sm border flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">
                {backendHealth?.mongodbConnected
                  ? 'MongoDB Atlas Cloud Database: Connected'
                  : 'Live Database Server: Active'}
              </span>
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{backendHealth?.mongodbConnected ? 'Cloud Production' : 'Local + REST API'}</span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-mono mt-0.5">
              Engine: <span className="text-white font-semibold">{backendHealth?.databaseEngine || 'Physical JSON Disk Store (Node.js API)'}</span>
              {backendHealth?.databaseFilePath && (
                <span className="text-slate-400 ml-2">({backendHealth.databaseFilePath})</span>
              )}
              {backendHealth?.databaseName && (
                <span className="text-emerald-300 ml-2">(DB: {backendHealth.databaseName})</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-300 text-[11px]">
            {backendHealth?.mongodbConnected ? 'Atlas Cluster Sync: Realtime' : 'Sync: Real-time Disk Flush + Memory'}
          </span>
        </div>
      </div>

      {/* Database KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Registered Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.usersCount}</p>
          <span className="text-[10px] text-slate-400">table: sahayak_real_users_v2</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Applications</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.applicationsCount}</p>
          <span className="text-[10px] text-slate-400">table: sahayak_real_applications_v2</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Active Schemes</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.schemesCount}</p>
          <span className="text-[10px] text-slate-400">table: sahayak_real_schemes_v2</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Channel Partners</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.partnersCount}</p>
          <span className="text-[10px] text-slate-400">table: sahayak_real_partners_v2</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Storage Used</span>
            <HardDrive className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.storageSizeKb} <span className="text-xs font-medium text-slate-500">KB</span></p>
          <span className="text-[10px] text-emerald-600 font-medium">Persistent LocalStorage</span>
        </div>
      </div>

      {/* Table Selector & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          
          {/* Table Tab Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('applications'); setSearchTerm(''); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'applications' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'users' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => { setActiveTab('schemes'); setSearchTerm(''); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'schemes' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Schemes ({schemes.length})
            </button>
            <button
              onClick={() => { setActiveTab('partners'); setSearchTerm(''); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'partners' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Partners ({partners.length})
            </button>
          </div>

          {/* Quick Filter */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Tab 1: Applications Table */}
        {activeTab === 'applications' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID / Reference</th>
                  <th className="px-4 py-3">Applicant Name</th>
                  <th className="px-4 py-3">Scheme & Category</th>
                  <th className="px-4 py-3">Loan Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications
                  .filter(a => {
                    if (!searchTerm) return true;
                    const q = searchTerm.toLowerCase();
                    return a.id.toLowerCase().includes(q) || a.applicantName.toLowerCase().includes(q) || a.schemeName.toLowerCase().includes(q);
                  })
                  .slice(0, 50)
                  .map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">{app.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{app.applicantName}</p>
                        <p className="text-[11px] text-slate-400">{app.applicantDistrict}, {app.applicantState}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate" title={app.schemeName}>
                        <p className="font-medium text-slate-800 truncate">{app.schemeName}</p>
                        <p className="text-[10px] text-slate-400">{app.schemeCategory}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        ₹{(app.loanAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => setInspectItem({ title: `Application: ${app.id}`, data: app })}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                          title="View JSON Payload"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Users Table */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Name & Role</th>
                  <th className="px-4 py-3">Contact Email / Mobile</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Income / Goal</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users
                  .filter(u => {
                    if (!searchTerm) return true;
                    const q = searchTerm.toLowerCase();
                    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
                  })
                  .slice(0, 50)
                  .map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-slate-700">{u.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <span className={`inline-block text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-800">{u.email || 'No email'}</p>
                        <p className="text-[11px] text-slate-400">{u.mobile}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {u.district ? `${u.district}, ${u.state}` : u.state || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">₹{(u.income || 0).toLocaleString('en-IN')}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[120px]">{u.projectType || u.goal}</p>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => setInspectItem({ title: `User Record: ${u.name} (${u.id})`, data: u })}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                          title="View JSON Payload"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                        </button>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Schemes Table */}
        {activeTab === 'schemes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Scheme ID</th>
                  <th className="px-4 py-3">Scheme Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Loan Range</th>
                  <th className="px-4 py-3">Interest Rate</th>
                  <th className="px-4 py-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.slice(0, 50).map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{s.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 max-w-sm">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.category}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      ₹{(s.minLoan / 1000).toFixed(0)}K - ₹{(s.maxLoan / 100000).toFixed(1)}L
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{s.interestRate}% p.a.</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setInspectItem({ title: `Scheme: ${s.name}`, data: s })}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Partners Table */}
        {activeTab === 'partners' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Partner ID</th>
                  <th className="px-4 py-3">Organization Name</th>
                  <th className="px-4 py-3">State / District</th>
                  <th className="px-4 py-3">Capacity Load</th>
                  <th className="px-4 py-3">SLA (Days)</th>
                  <th className="px-4 py-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.slice(0, 50).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">{p.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.district}, {p.state}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${p.capacityUtilization > 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${p.capacityUtilization}%` }}
                          />
                        </div>
                        <span className="font-semibold text-[11px]">{p.capacityUtilization}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{p.averageProcessingDays} days</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setInspectItem({ title: `Partner: ${p.name}`, data: p })}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* JSON Inspection Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 truncate">{inspectItem.title}</h3>
              </div>
              <button
                onClick={() => setInspectItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-emerald-400">
              <pre>{JSON.stringify(inspectItem.data, null, 2)}</pre>
            </div>
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setInspectItem(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
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
