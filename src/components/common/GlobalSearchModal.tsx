import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Layers, Building2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { LITERACY_ARTICLES } from '../../data/literacy';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { schemes, partners, applications, setActiveSchemeId } = useAppData();
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
        onClose();
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
        (s.officialName || s.name || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q) ||
        (s.ministry || s.governmentDepartment || '').toLowerCase().includes(q) ||
        (s.projectTypes || []).some(p => p.toLowerCase().includes(q)) ||
        (s.description || '').toLowerCase().includes(q)
      ).slice(0, 5)
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
        (a.schemeName || '').toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const hasResults = filteredSchemes.length > 0 || filteredPartners.length > 0 || filteredApps.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 bg-white">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search schemes, ministries, subsidies, documents..."
            className="w-full px-3 py-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-500">
            Esc
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!q ? (
            <div className="p-6 text-center text-slate-500">
              <p className="text-xs font-medium text-slate-600 mb-2">Suggested government searches:</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {['PM-KISAN', 'PMEGP Subsidy', 'MUDRA Loan', 'Stand-Up India', 'Solar Rooftop', 'Weaver Mudra'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-[#065F46] rounded text-slate-700 transition-colors border border-slate-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-xs font-semibold text-slate-700">No matching schemes or records found</p>
              <p className="text-[11px] text-slate-400 mt-1">Try terms like "MSME", "agriculture", "solar", or "women".</p>
            </div>
          ) : (
            <>
              {/* Schemes */}
              {filteredSchemes.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-[#065F46]" />
                    <span>Schemes ({filteredSchemes.length})</span>
                  </p>
                  <div className="space-y-1">
                    {filteredSchemes.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setActiveSchemeId(s.id);
                          onClose();
                          navigate(`/schemes/${s.id}`);
                        }}
                        className="p-2.5 rounded-md hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-slate-900 group-hover:text-[#065F46] transition-colors">
                              {s.officialName || s.name}
                            </span>
                            {s.verificationStatus === 'VERIFIED' && (
                              <span title="Verified Source">
                                <ShieldCheck className="w-3 h-3 text-[#065F46]" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{s.ministry || s.governmentDepartment}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#065F46] transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              {filteredApps.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-slate-500" />
                    <span>Tracked Applications ({filteredApps.length})</span>
                  </p>
                  <div className="space-y-1">
                    {filteredApps.map(a => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onClose();
                          navigate('/applications');
                        }}
                        className="p-2.5 rounded-md hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-mono text-xs font-bold text-slate-900">{a.id}</p>
                          <p className="text-[11px] text-slate-500">{a.schemeName}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Official Government Directory Search</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
