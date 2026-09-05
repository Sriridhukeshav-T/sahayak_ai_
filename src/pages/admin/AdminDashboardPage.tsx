import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  Users,
  Layers,
  Building2,
  FileText,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { SYNTHETIC_USERS } from '../../data/users';
import { DemoBadge } from '../../components/common/DemoBadge';

const COLORS = ['#1d4ed8', '#0d9488', '#f59e0b', '#7c3aed', '#ec4899', '#06b6d4', '#84cc16', '#64748b'];

export const AdminDashboardPage: React.FC = () => {
  const { schemes, partners, applications } = useAppData();

  // Aggregate KPIs
  const totalUsers = SYNTHETIC_USERS.length;
  const totalSchemes = schemes.length;
  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.available).length;
  const totalApps = applications.length;
  const completedApps = applications.filter(a => a.status === 'SANCTIONED' || a.status === 'DISBURSED').length;
  const successRate = totalApps > 0 ? Math.round((completedApps / totalApps) * 100) : 0;
  const avgMatchScore = Math.round(applications.reduce((acc, a) => acc + a.matchScore, 0) / (totalApps || 1));

  // Chart 1: Category breakdown
  const categoryCounts: Record<string, number> = {};
  schemes.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  // Chart 2: Top Applications by State
  const stateCounts: Record<string, number> = {};
  applications.forEach(a => {
    stateCounts[a.applicantState] = (stateCounts[a.applicantState] || 0) + 1;
  });
  const stateData = Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  // Chart 3: Application Status Breakdown
  const statusCounts: Record<string, number> = {};
  applications.forEach(a => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace(/_/g, ' '),
    count
  }));

  // Chart 4: Applications timeline (last 6 months synthetic trend)
  const timelineData = [
    { month: 'Apr 26', applications: 24, sanctions: 18 },
    { month: 'May 26', applications: 35, sanctions: 26 },
    { month: 'Jun 26', applications: 48, sanctions: 38 },
    { month: 'Jul 26', applications: 56, sanctions: 45 },
    { month: 'Aug 26', applications: 72, sanctions: 58 },
    { month: 'Sep 26', applications: 85, sanctions: 68 }
  ];

  // Chart 5: Partner Workload (Capacity vs Load for Top 6)
  const partnerLoadData = partners.slice(0, 6).map(p => ({
    name: p.name.split('—')[0].slice(0, 16),
    capacity: p.capacity,
    load: p.currentLoad
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Admin Suite Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Administrative Control Hub
            </span>
            <DemoBadge />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Program Monitoring & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time analytics across scheme allocations, channel partner capacities, and applicant dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            ● Network Live (All Nodes Synchronized)
          </span>
        </div>
      </div>

      {/* 7 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Beneficiaries</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono">{totalUsers}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block">+12% this month</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Schemes</span>
          <span className="text-xl font-extrabold text-blue-700 font-mono">{totalSchemes}</span>
          <span className="text-[10px] text-slate-500 block">Across 9 sectors</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Channel Partners</span>
          <span className="text-xl font-extrabold text-teal-700 font-mono">{totalPartners}</span>
          <span className="text-[10px] text-teal-600 block">{activePartners} online</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Applications</span>
          <span className="text-xl font-extrabold text-purple-700 font-mono">{totalApps}</span>
          <span className="text-[10px] text-slate-500 block">All states</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Sanctioned / Disbursed</span>
          <span className="text-xl font-extrabold text-emerald-700 font-mono">{completedApps}</span>
          <span className="text-[10px] text-emerald-600 font-bold block">{successRate}% Success</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Match Score</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono">{avgMatchScore}%</span>
          <span className="text-[10px] text-blue-600 block">High compatibility</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Turnaround</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono">11.4d</span>
          <span className="text-[10px] text-teal-600 block">-4.2 days vs manual</span>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Applications Over Time AreaChart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Application Intake & Sanction Velocity
              </h3>
              <p className="text-xs text-slate-800 font-bold">Monthly Submissions vs Approved Sanctions</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSanctions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="applications" name="Applications Intake" stroke="#1d4ed8" fillOpacity={1} fill="url(#colorApps)" strokeWidth={2} />
                <Area type="monotone" dataKey="sanctions" name="Approved Sanctions" stroke="#0d9488" fillOpacity={1} fill="url(#colorSanctions)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Scheme Category Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Scheme Category Distribution
            </h3>
            <p className="text-xs text-slate-800 font-bold">{schemes.length} Programs by Sector Focus</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Geographic Distribution by State (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Regional Penetration
            </h3>
            <p className="text-xs text-slate-800 font-bold">Applications by High-Volume States</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="state" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1d4ed8" radius={[6, 6, 0, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Partner Workload & Load Ratio (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Channel Partner Workload & Capacity
            </h3>
            <p className="text-xs text-slate-800 font-bold">Active Load vs Max Monthly Capacity</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={partnerLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="capacity" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Capacity" />
                <Bar dataKey="load" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Current Load" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
