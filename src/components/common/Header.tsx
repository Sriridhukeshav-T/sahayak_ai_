import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Globe,
  Bell,
  Eye,
  ChevronDown,
  LogOut,
  User,
  Sliders,
  CheckCircle2,
  LogIn,
  UserPlus,
  Landmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAppData } from '../../context/AppDataContext';
import { NotificationCenterDrawer } from './NotificationCenterDrawer';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { user, isAuthenticated, userRole, logout } = useAuth();
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const { isAccessibilityMode, toggleAccessibilityMode } = useAccessibility();
  const { notifications, markNotificationsAsRead } = useAppData();
  const navigate = useNavigate();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Brand Logo & Civic Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-900 transition-colors">
                <Landmark className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                    SSahayaka
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    National Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Government Schemes Discovery, Eligibility & Tracking Portal
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Global Search Trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-1.5 text-sm text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group"
            >
              <span className="flex items-center gap-2 text-slate-500">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                <span>Search verified schemes, documents, departments...</span>
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
              className="md:hidden p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg"
              title="Search schemes, partners, applications..."
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Multilingual Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-2.5 py-1.5 text-slate-700 hover:text-emerald-800 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 text-xs font-semibold border border-slate-200 shadow-2xs"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>{availableLanguages.find(l => l.code === language)?.nativeName || 'English'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
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
                        language === item.code ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
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

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg relative transition-colors"
              title="Civic Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* If NOT Authenticated: Show Log In & Register buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2 ml-1">
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('Log In')}</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t('Register')}</span>
                </Link>
              </div>
            ) : (
              /* If Authenticated: Show User Avatar / Menu */
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <div className="hidden sm:block text-left text-xs pr-1">
                    <span className="font-semibold text-slate-800 block truncate max-w-[100px] leading-tight">
                      {user?.name ? user.name.split(' ')[0] : 'User'}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize block leading-tight">
                      {userRole}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Financial Profile</span>
                    </Link>

                    <Link
                      to="/applications"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Applications</span>
                    </Link>

                    {userRole === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-emerald-800 font-semibold hover:bg-emerald-50 transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Notification Center Drawer */}
      <NotificationCenterDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />
    </>
  );
};
