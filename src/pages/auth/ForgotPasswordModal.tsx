import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'request' | 'otp' | 'success'>('request');
  const [identifier, setIdentifier] = useState('anjali.nair@demo.sahayak.ai');
  const [otp, setOtp] = useState('8942');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold">
              <KeyRound className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900">Account Recovery</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-sm text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'request' && (
          <form
            onSubmit={e => {
              e.preventDefault();
              setStep('otp');
            }}
            className="space-y-4"
          >
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered mobile number or citizen email address. A one-time verification code will be dispatched.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Email or Mobile
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:border-emerald-800"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs"
            >
              Send Verification OTP
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form
            onSubmit={e => {
              e.preventDefault();
              setStep('success');
            }}
            className="space-y-4"
          >
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Verification Code Sent:</span> Use code <strong className="font-mono text-emerald-800 text-sm">8942</strong>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 4-digit OTP</label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full px-3 py-2 text-center text-base tracking-widest font-mono font-bold border border-slate-300 rounded-md focus:outline-hidden focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Secure Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:border-emerald-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs"
            >
              Update Password
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-slate-900">Password Updated Successfully</h4>
            <p className="text-xs text-slate-600">
              Your credentials have been refreshed. You can now authenticate into Sahayak AI.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
