import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { DemoBadge } from '../../components/common/DemoBadge';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('anjali.nair@demo.sahayak.ai');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const { login, selectDemoPersona } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter your email or mobile and password.');
      return;
    }
    const success = login(identifier, password);
    if (success) {
      if (identifier.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleQuickPersona = (key: 'anjali' | 'ramesh' | 'priya') => {
    selectDemoPersona(key);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              SAHAYAK <span className="text-blue-600">AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500">
            Sign in to access your matched schemes, partner routing & applications
          </p>
          <DemoBadge />
        </div>

        {/* Quick Demo One-Click Personas */}
        <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Instant SIH Demo Login:</span>
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">1-Click Access</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center">
            <button
              type="button"
              onClick={() => handleQuickPersona('anjali')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-blue-100/70 border border-blue-200 text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
            >
              🧵 Anjali
              <span className="block text-[9px] text-slate-400 font-normal">Tailoring</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPersona('ramesh')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-blue-100/70 border border-blue-200 text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
            >
              🚜 Ramesh
              <span className="block text-[9px] text-slate-400 font-normal">Agriculture</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPersona('priya')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-blue-100/70 border border-blue-200 text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
            >
              🎓 Priya
              <span className="block text-[9px] text-slate-400 font-normal">Education</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter email or mobile"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Signup Redirect */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-700 font-bold hover:underline">
              Create Account & Onboard
            </Link>
          </p>
        </div>

      </div>

      <ForgotPasswordModal isOpen={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  );
};
