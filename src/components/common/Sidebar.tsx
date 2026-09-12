import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
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
  HelpCircle,
  PiggyBank,
  CheckCircle2,
  Database
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
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/find-scheme', label: t('findMyScheme'), icon: Sparkles, highlight: true },
    { to: '/schemes', label: t('schemeExplorer'), icon: Search },
    { to: '/affordability', label: t('affordability'), icon: Calculator },
    { to: '/documents', label: t('documents'), icon: FileCheck2 },
    { to: '/partners', label: t('findPartner'), icon: MapPin },
    { to: '/funding-planner', label: t('fundingPlanner'), icon: PiggyBank },
    { to: '/applications', label: t('myApplications'), icon: FileText },
    { to: '/profile', label: t('financialProfile'), icon: User },
    { to: '/literacy', label: t('financialLiteracy'), icon: GraduationCap }
  ];

  const adminNav = [
    { to: '/admin', label: 'Overview & Analytics', icon: BarChart3 },
    { to: '/admin/schemes', label: 'Scheme Management', icon: Layers },
    { to: '/admin/partners', label: 'Partner Management', icon: Building2 },
    { to: '/admin/applications', label: 'Applications Oversight', icon: Briefcase },
    { to: '/admin/database', label: 'Database & Storage', icon: Database }
  ];


  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/90 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-61px)]">
      <div className="p-3.5 space-y-4">
        
        {/* Active View Label */}
        <div className="px-3 py-1.5 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {userRole === 'admin' ? 'Administrative Suite' : 'Applicant Portal'}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${userRole === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
            {userRole === 'admin' ? 'Admin' : 'Citizen'}
          </span>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
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
                      `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
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
                      `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? 'bg-blue-700 text-white shadow-xs font-semibold'
                          : item.highlight
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100/80 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${item.highlight ? 'text-blue-600' : ''}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.highlight && (
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                        AI
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </>
          )}
        </nav>
      </div>

      {/* Bottom Profile Completion Widget */}
      {userRole === 'citizen' && (
        <div className="p-3.5 border-t border-slate-200/90 bg-slate-50/70 m-2 rounded-2xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">Profile Readiness</span>
            <span className="text-xs font-bold text-blue-700">{completionPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{user.name.split(' ')[0]} • {user.projectType || 'Tailoring'}</span>
          </p>
        </div>
      )}
    </aside>
  );
};
