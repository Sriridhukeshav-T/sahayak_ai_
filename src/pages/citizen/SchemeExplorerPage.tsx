import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SchemeCard } from '../../components/schemes/SchemeCard';
import { ExplainableModal } from '../../components/schemes/ExplainableModal';
import { SchemeCompareModal } from '../../components/schemes/SchemeCompareModal';
import { Scheme, SchemeCategory } from '../../types/scheme';
import { calculateSchemeMatch } from '../../services/schemeMatcherService';
import { MatchBreakdown } from '../../types/common';

const CATEGORIES: (SchemeCategory | 'ALL')[] = [
  'ALL',
  'Micro Enterprise',
  'Small Business',
  'Agriculture & Allied',
  'Artisan & Handloom',
  'Education & Skill',
  'Women Entrepreneurship',
  'Green & Renewable',
  'Service Sector',
  'Term Loan'
];

export const SchemeExplorerPage: React.FC = () => {
  const { schemes, partners } = useAppData();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | 'ALL'>('ALL');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'ALL' | 'Central' | 'State'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'OPEN' | 'CLOSING_SOON' | 'CLOSED'>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');

  const [comparedSchemes, setComparedSchemes] = useState<Scheme[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [explainScheme, setExplainScheme] = useState<{ scheme: Scheme; match: MatchBreakdown } | null>(null);

  // Dynamic filter evaluation
  const filteredSchemes = useMemo(() => {
    return schemes.filter(s => {
      // 1. Category
      if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;

      // 2. Jurisdiction Filter (Central vs State)
      if (selectedJurisdiction === 'Central' && s.state !== 'Central') return false;
      if (selectedJurisdiction === 'State' && s.state === 'Central') return false;

      // 3. State Location
      if (selectedState !== 'ALL') {
        const supported = s.supportedStates || ['ALL'];
        const isSupported = s.state === selectedState || supported.includes('ALL') || supported.includes(selectedState);
        if (!isSupported) return false;
      }

      // 4. Scheme Status Filter
      if (selectedStatus === 'OPEN') {
        if (s.schemeStatus !== 'OPEN' && s.schemeStatus !== 'ONGOING') return false;
      } else if (selectedStatus === 'CLOSING_SOON') {
        if (s.schemeStatus !== 'CLOSING_SOON') return false;
      } else if (selectedStatus === 'CLOSED') {
        if (s.schemeStatus !== 'APPLICATION_WINDOW_CLOSED' && s.schemeStatus !== 'EXPIRED') return false;
      }

      // 5. Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = (s.officialName || s.name || '').toLowerCase().includes(q);
        const matchesDesc = (s.description || '').toLowerCase().includes(q);
        const matchesMinistry = (s.ministry || s.governmentDepartment || '').toLowerCase().includes(q);
        const matchesProjects = (s.projectTypes || []).some(p => p.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesMinistry && !matchesProjects) return false;
      }

      return true;
    });
  }, [schemes, selectedCategory, selectedJurisdiction, selectedStatus, selectedState, searchTerm]);

  const handleToggleCompare = (scheme: Scheme) => {
    if (comparedSchemes.find(s => s.id === scheme.id)) {
      setComparedSchemes(comparedSchemes.filter(s => s.id !== scheme.id));
    } else {
      if (comparedSchemes.length >= 3) {
        alert('You can select at most 3 schemes to compare side-by-side.');
        return;
      }
      const updated = [...comparedSchemes, scheme];
      setComparedSchemes(updated);
      if (updated.length >= 2) setShowCompareModal(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Civic Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Authoritative Scheme Repository
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {filteredSchemes.length} Schemes Available
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1 border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Field-Verified Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Verified Government of India and State government schemes with authoritative guidelines, deterministic eligibility criteria, and direct application portal gateways.
          </p>
        </div>

        {comparedSchemes.length > 0 && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <span>Compare Selected ({comparedSchemes.length}/3)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by official scheme name, ministry, category, or trade keywords (e.g. MSME, KVIC, solar, farmer)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Jurisdiction, Status, and State Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
          {/* Jurisdiction Filter */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Government Jurisdiction</label>
            <select
              value={selectedJurisdiction}
              onChange={e => setSelectedJurisdiction(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Jurisdictions (Central & States)</option>
              <option value="Central">Central Government</option>
              <option value="State">State Government Programs</option>
            </select>
          </div>

          {/* Scheme Status Filter */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Application Window Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Application Windows</option>
              <option value="OPEN">Currently Open / Ongoing Missions</option>
              <option value="CLOSING_SOON">Closing Soon (&lt;= 7 Days)</option>
              <option value="CLOSED">Application Window Closed / Expired</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">State / Union Territory</label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All States (Nationwide Coverage)</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Delhi">Delhi</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">No matching verified schemes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your jurisdiction, status, or category filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSelectedJurisdiction('ALL');
              setSelectedStatus('ALL');
              setSelectedState('ALL');
            }}
            className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map(scheme => {
            const match = calculateSchemeMatch(user, scheme, partners);
            return (
              <SchemeCard
                key={scheme.id || scheme.schemeId}
                scheme={scheme}
                match={match}
                onOpenExplain={(s, m) => setExplainScheme({ scheme: s, match: m })}
                onSelectForCompare={handleToggleCompare}
                isCompared={Boolean(comparedSchemes.find(s => s.id === scheme.id))}
              />
            );
          })}
        </div>
      )}

      {/* Explainable Modal */}
      {explainScheme && (
        <ExplainableModal
          scheme={explainScheme.scheme}
          match={explainScheme.match}
          onClose={() => setExplainScheme(null)}
        />
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <SchemeCompareModal
          schemes={comparedSchemes}
          onClose={() => setShowCompareModal(false)}
          onRemoveScheme={(id) => setComparedSchemes(prev => prev.filter(s => s.id !== id))}
        />
      )}
    </div>
  );
};

export default SchemeExplorerPage;
