import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calculator,
  Globe2,
  Volume2,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>National Credit Enablement Platform • Scheme Discovery & Concessional Lending</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            “{t('heroSubtitle')}”
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to={isAuthenticated ? "/find-scheme" : "/signup"}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{isAuthenticated ? t('findMyScheme') : 'Register as Entrepreneur'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/schemes"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm rounded-xl transition-all"
            >
              {t('exploreSchemes')}
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-slate-400" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>

          {/* Hero Visual Stepper */}
          <div className="pt-10 max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">
              The Intelligent Citizen Journey
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {[
                { title: '1. Your Goal', desc: 'Text or Voice Input' },
                { title: '2. AI Matching', desc: '100-pt Explainable Engine' },
                { title: '3. Affordability', desc: 'Cashflow Simulator' },
                { title: '4. Best Partner', desc: 'Geo-Spatial Routing' },
                { title: '5. Application', desc: 'Live Real-Time Tracking' }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 p-3 rounded-xl text-left backdrop-blur-xs"
                >
                  <span className="font-bold text-blue-400 block text-xs">{step.title}</span>
                  <span className="text-[11px] text-slate-300 block mt-0.5">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Onboarding Bar */}
          <div className="pt-6 border-t border-slate-800/80 max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="text-slate-400 font-medium">Quick Access:</span>
              <Link
                to="/find-scheme"
                className="px-3.5 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-200 font-semibold transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>AI Scheme Eligibility Tool</span>
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-200 font-semibold transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-teal-300" />
                <span>Create Citizen Account</span>
              </Link>
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-semibold transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin / Citizen Sign In</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            End-to-End Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How Sahayak AI Guides You
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            From your business idea to loan disbursement, without complex jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Tell Us Your Goal',
              desc: 'Speak or type in your language. Tell us what business you want to start or expand.',
              icon: Volume2
            },
            {
              step: '02',
              title: 'AI Understands & Matches',
              desc: 'Our transparent 100-point algorithm matches your income, loan size, and category against 50+ schemes.',
              icon: Sparkles
            },
            {
              step: '03',
              title: 'Simulate Affordability',
              desc: 'Check your reducing-balance monthly EMI and verify if your remaining surplus keeps your family safe.',
              icon: Calculator
            },
            {
              step: '04',
              title: 'Smart Partner Routing',
              desc: 'Our geo-spatial router navigates you to the nearest partner with verified spare processing capacity.',
              icon: MapPin
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-slate-300 font-mono">{item.step}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Sahayak AI? (Key Innovations) */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Why Sahayak AI?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Designed for Marginalized Entrepreneurs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Solving information asymmetry, bureaucratic confusion, and predatory informal lending.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Explainable Recommendations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No opaque decisions. Every match shows an itemized score across income, project, location, and tips to improve qualification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Voice & Regional Languages</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Built-in speech input and full translations for English, Malayalam, Tamil, and Hindi, making institutional credit accessible to all.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Dynamic Partner Routing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the closest bank has an 85% application backlog, Sahayak reroutes you to an authorized partner with faster processing speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Inclusion & Final Call to Action */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to Take Your Dream to Opportunity?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of small business owners, women artisans, and farmers navigating government concessional finance with clarity.
          </p>

          <div className="pt-3">
            <Link
              to="/find-scheme"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              <span>Start Your Financial Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
