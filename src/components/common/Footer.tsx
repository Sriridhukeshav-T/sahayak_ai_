import React from 'react';
import { Landmark, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#065F46] flex items-center justify-center text-white font-bold">
              <Landmark className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white tracking-tight">
                Sahayak AI
              </p>
              <p className="text-[11px] text-slate-400">
                National Government Scheme Assistance & Tracking Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-xs">
            <Link to="/schemes" className="hover:text-white transition-colors">Scheme Directory</Link>
            <Link to="/find-scheme" className="hover:text-white transition-colors">Check Eligibility</Link>
            <Link to="/applications" className="hover:text-white transition-colors">Application Tracker</Link>
            <Link to="/documents" className="hover:text-white transition-colors">Document Guidelines</Link>
            <Link to="/partners" className="hover:text-white transition-colors">Authorized Partners</Link>
            <Link to="/admin" className="hover:text-white transition-colors text-slate-500">Admin Portal</Link>
          </div>
        </div>

        {/* Civic Transparency Notice */}
        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/60 flex items-start gap-3">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-200 text-xs">Public Service & Source Verification Notice</p>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-4xl">
              Sahayak AI is an independent public-service platform designed to assist citizens in discovering official Central and State government schemes, evaluating deterministic eligibility criteria, and tracking application waiting periods. Scheme information is strictly cross-checked against authoritative Government of India gazettes, ministry directives, and official departmental portals. Sahayak AI does not claim direct sanction authority; final eligibility and financial assistance remain under the jurisdiction of the respective government nodal agencies and authorized financial institutions.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 pt-1">
          <p>© 2026 Sahayak AI. Authoritative citizen scheme discovery platform.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 flex items-center gap-1">
              <span>myScheme Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 flex items-center gap-1">
              <span>India.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
