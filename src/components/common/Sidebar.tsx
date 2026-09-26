import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Calculator,
  FileCheck2,
  MapPin,
  FileText,
  User,
  GraduationCap,
  Layers,
  BarChart3,
  Building2,
  Briefcase,
  PiggyBank,
  CheckCircle2,
  Database,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar: React.FC = () => {
  const { user, userRole } = useAuth();
  const { t } = useLanguage();

  // Calculate profile completion percentage
  let completedFields = 0;
  const totalFields = 8;
  if (user.name) completedFields++;
  if (user.income) completedFields++;
  if (user.projectType) completedFields++;
  if (user.loanRequirement) completedFields++;
  if (user.state && user.district) completedFields++;
  if (user.experienceYears !== undefined) completedFields++;
  if (user.uploadedDocuments && user.uploadedDocuments.length >= 2) completedFields++;
  if (user.ownContribution !== undefined) completedFields++;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  const citizenNav = [
    { to: '/dashboard', label: t('dashboard') || 'Dashboard', icon: LayoutDashboard },
    { to: '/find-scheme', label: 'Check Eligibility', icon: ShieldCheck },
    { to: '/schemes', label: 'Scheme Directory', icon: Search },
    { to: '/applications', label: 'My Applications', icon: FileText },
    { to: '/documents', label: 'Required Documents', icon: FileCheck2 },
    { to: '/affordability', label: 'Affordability Simulator', icon: Calculator },
    { to: '/partners', label: 'Channel Partners', icon: MapPin },
    { to: '/funding-planner', label: 'Funding Planner', icon: PiggyBank },
    { to: '/profile', label: 'Citizen Profile', icon: User },
    { to: '/literacy', label: 'Civic Guidelines', icon: GraduationCap }
  ];

  const adminNav = [
    { to: '/admin', label: 'Overview & Analytics', icon: BarChart3 },
    { to: '/admin/schemes', label: 'Scheme Management', icon: Layers },
    { to: '/admin/partners', label: 'Partner Management', icon: Building2 },
    { to: '/admin/applications', label: 'Applications Oversight', icon: Briefcase },
    { to: '/admin/database', label: 'Database & Storage', icon: Database }
  ];

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-53px)]">
      <div className="p-3 space-y-4">
        
        {/* Active Workspace Label */}
        <div className="px-2.5 py-1 flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {userRole === 'admin' ? 'Administrative Suite' : 'Citizen Services'}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
            userRole === 'admin' 
              ? 'bg-purple-50 text-purple-700 border border-purple-200' 
              : 'bg-emerald-50 text-[#065F46] border border-emerald-200'
          }`}>
            {userRole === 'admin' ? 'Admin' : 'Citizen'}
          </span>
        </div>

        {/* Navigation links */}
        <nav className="space-y-0.5">
          {userRole === 'admin' ? (
            <>
              {adminNav.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 font-semibold border-l-2 border-[#065F46]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </>
          ) : (
            <>
              {citizenNav.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-emerald-50/70 text-[#065F46] font-semibold border-l-2 border-[#065F46]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                );
              })}
            </>
          )}
        </nav>
      </div>

      {/* Profile Completion Indicator */}
      {userRole === 'citizen' && (
        <div className="p-3 m-2.5 border border-slate-200 rounded-md bg-slate-50/80">
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="font-semibold text-slate-700">Profile Readiness</span>
            <span className="font-bold text-[#065F46]">{completionPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#065F46] rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#065F46] shrink-0" />
            <span className="truncate">{user.name.split(' ')[0]} • {user.state || 'Citizen'}</span>
          </p>
        </div>
      )}
    </aside>
  );
};
