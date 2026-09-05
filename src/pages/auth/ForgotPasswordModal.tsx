import React, { useState } from 'react';
import { X, Mail, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Password Recovery (Demo)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
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
              Enter your registered email address or mobile number. In this prototype, an instant simulated OTP will be generated.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email or Mobile
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs"
            >
              Send Simulated OTP
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
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              <span className="font-bold">Simulated OTP Sent:</span> Use code <strong className="font-mono text-blue-700 text-sm">8942</strong>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 4-digit OTP</label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full px-3 py-2 text-center text-base tracking-widest font-mono font-bold border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Set New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs"
            >
              Reset Password
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Password Reset Successfully</h4>
            <p className="text-xs text-slate-600">
              You can now log into your Sahayak AI account using your new credentials.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
