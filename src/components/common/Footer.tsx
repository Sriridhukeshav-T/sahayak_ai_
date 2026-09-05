import React from 'react';
import { Sparkles, Shield, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">
                SAHAYAK <span className="text-blue-400">AI</span>
              </p>
              <p className="text-[11px] text-slate-400">
                From Dream to Opportunity.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-[11px]">
            <Link to="/schemes" className="hover:text-white transition-colors">Scheme Explorer</Link>
            <Link to="/affordability" className="hover:text-white transition-colors">Affordability Simulator</Link>
            <Link to="/partners" className="hover:text-white transition-colors">Channel Partners</Link>
            <Link to="/literacy" className="hover:text-white transition-colors">Financial Literacy</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin Console</Link>
          </div>
        </div>

        {/* Mandatory Statutory Prototype Disclaimer */}
        <div className="bg-slate-850/80 p-4 rounded-xl border border-slate-800/80 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-slate-200 text-xs">Important Transparency & Regulatory Notice:</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sahayak AI provides AI-assisted informational guidance. Recommendations do not guarantee eligibility, sanction or loan approval. Final eligibility, documentation requirements, interest rates and approval are determined by the relevant authorized authority / channel partner.
            </p>
            <p className="text-[11px] text-slate-500">
              Prototype built for <strong>Smart India Hackathon 2026 (SIH26092)</strong> — AI-Driven Scheme Matching for Marginalized Entrepreneurs. Data displayed includes synthetic records for demonstration.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-2">
          <p>© 2026 Sahayak AI Platform. Built with accessible, explainable AI architectures.</p>
          <p className="flex items-center gap-1">
            Empowering grassroots Indian entrepreneurship <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
          </p>
        </div>

      </div>
    </footer>
  );
};
