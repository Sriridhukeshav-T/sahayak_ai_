import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Globe,
  Bell,
  Eye,
  ChevronDown,
  LogOut,
  User,
  Sliders,
  LogIn,
  UserPlus,
  Landmark,
  Menu,
  X,
  FileText,
  Compass,
  CheckCircle,
  HelpCircle
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
  const { notifications } = useAppData();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { to: '/schemes', label: 'Discover Schemes' },
    { to: '/find-scheme', label: 'Eligibility' },
    { to: '/applications', label: 'Applications' }
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-md bg-[#065F46] flex items-center justify-center text-white shadow-2xs group-hover:bg-[#064E3B] transition-colors">
                <Landmark className="w-4 h-4 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    Sahayak AI
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Civic Portal
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block mt-0.5">
                  National Scheme Assistance Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Primary Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const isActive = location.pathname.startsWith(link.to);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors relative ${
                    isActive
                      ? 'text-[#065F46] bg-emerald-50/70 border border-emerald-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#065F46] rounded-full" />
                  )}
                </NavLink>
              );
            })}

            {/* Notifications Trigger as Nav Item */}
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
            >
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#065F46] text-white text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
              title="Search schemes, benefits, departments (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xl:inline text-slate-400">Search schemes...</span>
              <kbd className="hidden lg:inline-block px-1 py-0.2 text-[9px] font-mono bg-white border border-slate-300 rounded text-slate-500">
                Ctrl K
              </kbd>
            </button>

            {/* Multilingual Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-2 py-1.5 text-slate-700 hover:bg-slate-100 rounded-md flex items-center gap-1 text-xs font-medium border border-slate-200"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{availableLanguages.find(l => l.code === language)?.nativeName || 'English'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-lg shadow-lg border border-slate-200 p-1 z-50 animate-in fade-in text-xs">
                  {availableLanguages.map(item => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md flex items-center justify-between ${
                        language === item.code ? 'bg-emerald-50 text-[#065F46] font-semibold' : 'hover:bg-slate-50 text-slate-700'
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
              className={`p-1.5 rounded-md transition-colors border ${
                isAccessibilityMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Accessibility Mode"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* If NOT Authenticated: Show Log In & Register */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-1.5 ml-1">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors border border-slate-200"
                >
                  {t('Log In')}
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#065F46] hover:bg-[#064E3B] rounded-md transition-colors shadow-2xs"
                >
                  {t('Register')}
                </Link>
              </div>
            ) : (
              /* If Authenticated: User Avatar & Dropdown */
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-md hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded bg-emerald-100 text-[#065F46] flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="hidden sm:inline font-semibold text-xs text-slate-800 truncate max-w-[100px]">
                    {user?.name ? user.name.split(' ')[0] : 'Citizen'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-lg border border-slate-200 p-1 z-50 animate-in fade-in text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      <span>Citizen Dashboard</span>
                    </Link>

                    <Link
                      to="/applications"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Applications</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Citizen Profile</span>
                    </Link>

                    {userRole === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[#065F46] font-semibold hover:bg-emerald-50 transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 text-[#065F46]" />
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
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pt-2 border-t border-slate-200 pb-3 space-y-1 text-xs">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-emerald-50 text-[#065F46] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsNotifDrawerOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-md font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#065F46] text-white text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full text-left px-3 py-2 rounded-md font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search schemes & portals</span>
            </button>
          </div>
        )}
      </header>

      {/* Notification Center Drawer */}
      <NotificationCenterDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />
    </>
  );
};
