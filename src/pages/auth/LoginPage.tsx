import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Landmark,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your registered email or mobile and password.');
      return;
    }

    setIsLoading(true);
    const res = login(identifier, password);
    setIsLoading(false);

    if (res.success) {
      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setError(res.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleDemoLogin = (role: 'citizen' | 'admin') => {
    if (role === 'citizen') {
      setIdentifier('citizen@sahayak.gov.in');
      setPassword('Citizen@123');
    } else {
      setIdentifier('admin@sahayak.gov.in');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#065F46] text-white flex items-center justify-center shadow-2xs">
              <Landmark className="w-4 h-4 text-emerald-100" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Sahayak AI
            </span>
          </Link>
          <h2 className="text-sm font-bold text-slate-900 pt-1">Citizen & Official Portal Login</h2>
          <p className="text-xs text-slate-500">
            Access your scheme dossiers, eligibility evaluations, and tracked applications.
          </p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Demo Credentials
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('citizen')}
              className="flex-1 py-1 px-2 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded border border-slate-300 text-[11px] transition-colors"
            >
              Fill Citizen
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex-1 py-1 px-2 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded border border-slate-300 text-[11px] transition-colors"
            >
              Fill Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email or Mobile Number</label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="citizen@sahayak.gov.in"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[11px] text-[#065F46] hover:underline"
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
                className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded text-[#065F46] focus:ring-[#065F46]"
              />
              <span>Remember this browser</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>New applicant? </span>
          <Link to="/signup" className="text-[#065F46] font-semibold hover:underline">
            Register citizen profile
          </Link>
        </div>

      </div>

      {showForgot && (
        <ForgotPasswordModal
          isOpen={showForgot}
          onClose={() => setShowForgot(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;
