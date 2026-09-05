import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Layers, Building2, FileText, ArrowRight, BookOpen } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { LITERACY_ARTICLES } from '../../data/literacy';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { schemes, partners, applications, setActiveSchemeId, setActivePartnerId } = useAppData();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent will toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredSchemes = q
    ? schemes.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.projectTypes.some(p => p.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const filteredPartners = q
    ? partners.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.partnerType.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const filteredApps = q
    ? applications.filter(a =>
        a.id.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q) ||
        a.schemeName.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const filteredLiteracy = q
    ? LITERACY_ARTICLES.filter(art =>
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q)
      ).slice(0, 2)
    : [];

  const hasResults = filteredSchemes.length > 0 || filteredPartners.length > 0 || filteredApps.length > 0 || filteredLiteracy.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search schemes (e.g. tailoring, agri, mudra), partners, applications..."
            className="w-full px-3 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 text-slate-500 hover:bg-slate-100 rounded-md border border-slate-200"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!q ? (
            <div className="p-6 text-center text-slate-500">
              <p className="text-sm font-medium">Quick suggestions:</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                {['Tailoring', 'Agro Machinery', 'Education Loan', 'Palakkad KSBCDC', 'PMEGP Subsidy', 'Moratorium'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-slate-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm font-semibold text-slate-700">No matching results found</p>
              <p className="text-xs text-slate-400 mt-1">Try keywords like "tailoring", "tractor", "bank", or a state name.</p>
            </div>
          ) : (
            <>
              {/* Schemes */}
              {filteredSchemes.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Schemes ({filteredSchemes.length})</span>
                  </p>
                  <div className="space-y-1">
                    {filteredSchemes.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveSchemeId(s.id);
                          onClose();
                          navigate('/schemes');
                        }}
                        className="p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-200 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{s.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {s.category} • Max Loan ₹{(s.maxLoan / 100000).toFixed(1)}L • {s.interestRate}% Interest
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Partners */}
              {filteredPartners.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Channel Partners ({filteredPartners.length})</span>
                  </p>
                  <div className="space-y-1">
                    {filteredPartners.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActivePartnerId(p.id);
                          onClose();
                          navigate('/partners');
                        }}
                        className="p-2.5 rounded-xl hover:bg-teal-50/70 border border-transparent hover:border-teal-200 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">{p.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {p.partnerType} • {p.district}, {p.state} • Turnaround ~{p.processingDays}d
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              {filteredApps.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Applications ({filteredApps.length})</span>
                  </p>
                  <div className="space-y-1">
                    {filteredApps.map(a => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onClose();
                          navigate('/applications');
                        }}
                        className="p-2.5 rounded-xl hover:bg-purple-50/70 border border-transparent hover:border-purple-200 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-900">{a.id}</span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                              {a.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {a.applicantName} • ₹{a.loanAmount.toLocaleString('en-IN')} • {a.schemeName.slice(0, 35)}...
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Literacy Articles */}
              {filteredLiteracy.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Literacy Center ({filteredLiteracy.length})</span>
                  </p>
                  <div className="space-y-1">
                    {filteredLiteracy.map(art => (
                      <div
                        key={art.id}
                        onClick={() => {
                          onClose();
                          navigate('/literacy');
                        }}
                        className="p-2.5 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">{art.title}</p>
                          <p className="text-[11px] text-slate-500">{art.summary}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
