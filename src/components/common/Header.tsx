import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Globe,
  Bell,
  Eye,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  LogOut,
  User,
  Sliders,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAppData } from '../../context/AppDataContext';
import { DemoBadge } from './DemoBadge';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { user, userRole, setUserRole, selectDemoPersona, logout } = useAuth();
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const { isAccessibilityMode, toggleAccessibilityMode } = useAccessibility();
  const { notifications, markNotificationsAsRead } = useAppData();
  const navigate = useNavigate();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                  SAHAYAK <span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  SIH26092
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </Link>

          <DemoBadge className="hidden md:inline-flex" />
        </div>

        {/* Center: Global Search Trigger */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-sm text-slate-400 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg transition-colors group"
          >
            <span className="flex items-center gap-2 text-slate-500">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span>Search schemes, partners, applications...</span>
            </span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-500 shadow-2xs">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Quick Search on Mobile */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Role Switcher Toggle (Citizen / Admin) */}
          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center text-xs font-medium">
            <button
              onClick={() => setUserRole('citizen')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                userRole === 'citizen'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                navigate('/admin');
              }}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                userRole === 'admin'
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>

          {/* Try Demo Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-300/80 rounded-lg transition-colors shadow-2xs"
              title="Switch demo persona for instant presentation"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Try Demo:</span>
              <span className="font-bold text-teal-900">{user.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-teal-600" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">Select SIH Demo Persona</p>
                  <p className="text-[11px] text-slate-500">Auto-populates full profile & goals</p>
                </div>

                <button
                  onClick={() => {
                    selectDemoPersona('anjali');
                    setShowPersonaMenu(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                    user.name.includes('Anjali') ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">Anjali Nair</p>
                      <span className="text-[10px] bg-pink-50 text-pink-700 font-semibold px-1 rounded">Micro</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Tailoring • ₹1.2L Loan • Kerala (ML)</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    selectDemoPersona('ramesh');
                    setShowPersonaMenu(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 mt-1 ${
                    user.name.includes('Ramesh') ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    R
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">Ramesh S.</p>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1 rounded">Agri</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Agri Implements • ₹6L Loan • TN (TA)</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    selectDemoPersona('priya');
                    setShowPersonaMenu(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 mt-1 ${
                    user.name.includes('Priya') ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    P
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">Priya Sharma</p>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-1 rounded">Student</span>
                    </div>
                    <p className="text-[11px] text-slate-500">M.Tech Biotech • ₹6L Loan • KA (EN)</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg flex items-center gap-1 text-xs font-medium"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="uppercase font-semibold">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in">
                {availableLanguages.map(item => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${
                      language === item.code ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{item.nativeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({item.code})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Mode Toggle */}
          <button
            onClick={toggleAccessibilityMode}
            className={`p-2 rounded-lg transition-colors ${
              isAccessibilityMode
                ? 'bg-amber-100 text-amber-900 font-bold ring-2 ring-amber-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Toggle Accessibility Mode (larger text, clear contrast)"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Notifications Center Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                if (!showNotifMenu && unreadCount > 0) {
                  markNotificationsAsRead();
                }
              }}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-sm text-slate-900">Notifications</span>
                  <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline" onClick={markNotificationsAsRead}>
                    Mark all read
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg border transition-colors ${
                          n.read ? 'bg-white border-slate-100' : 'bg-blue-50/60 border-blue-200/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                        {n.actionLink && (
                          <Link
                            to={n.actionLink}
                            onClick={() => setShowNotifMenu(false)}
                            className="text-[11px] text-blue-600 font-semibold mt-1.5 inline-block hover:underline"
                          >
                            View details →
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1.5 pr-1 py-1 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden lg:inline max-w-[100px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="px-2.5 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                    {userRole === 'admin' ? 'Administrator' : 'Verified Applicant'}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Financial Profile</span>
                </Link>

                <Link
                  to="/applications"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  <span>My Applications</span>
                </Link>

                {userRole === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-blue-700 hover:bg-blue-50 rounded-lg font-medium"
                  >
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Admin Dashboard</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setUserRole('admin');
                      setShowUserMenu(false);
                      navigate('/admin');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Switch to Admin View</span>
                  </button>
                )}

                <div className="border-t border-slate-100 my-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
