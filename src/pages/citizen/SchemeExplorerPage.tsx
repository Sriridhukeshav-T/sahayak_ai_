import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  X,
  Coins,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { SchemeCard } from '../../components/schemes/SchemeCard';
import { ExplainableModal } from '../../components/schemes/ExplainableModal';
import { SchemeCompareModal } from '../../components/schemes/SchemeCompareModal';
import { Scheme, SchemeCategory } from '../../types/scheme';
import { calculateSchemeMatch } from '../../services/schemeMatcherService';
import { MatchBreakdown } from '../../types/common';
import { DemoBadge } from '../../components/common/DemoBadge';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | 'ALL'>('ALL');
  const [maxInterest, setMaxInterest] = useState<number>(8.0);
  const [minLoanCap, setMinLoanCap] = useState<number>(0);
  const [selectedState, setSelectedState] = useState<string>('ALL');

  const [comparedSchemes, setComparedSchemes] = useState<Scheme[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [explainScheme, setExplainScheme] = useState<{ scheme: Scheme; match: MatchBreakdown } | null>(null);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter(s => {
      // Category
      if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;

      // State
      if (selectedState !== 'ALL' && !s.supportedStates.includes('ALL') && !s.supportedStates.includes(selectedState)) {
        return false;
      }

      // Interest
      if (s.interestRate > maxInterest) return false;

      // Min loan cap
      if (s.maxLoan < minLoanCap) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesDesc = s.description.toLowerCase().includes(q);
        const matchesProjects = s.projectTypes.some(p => p.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesProjects) return false;
      }

      return true;
    });
  }, [schemes, selectedCategory, selectedState, maxInterest, minLoanCap, searchTerm]);

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Scheme Explorer
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {filteredSchemes.length} Schemes Available
            </span>
            <DemoBadge />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, and compare verified concessional credit facilities across central & state departments.
          </p>
        </div>

        {comparedSchemes.length > 0 && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <span>Compare Selected ({comparedSchemes.length}/3)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by scheme name, keyword (e.g. tailoring, tractor, solar, boutique, mudra)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
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
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sliders and Dropdown for Fine-tuning */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
          
          {/* Max Interest Slider */}
          <div>
            <div className="flex items-center justify-between mb-1 text-slate-700 font-medium">
              <span>Max Interest Rate:</span>
              <span className="font-bold text-emerald-700">{maxInterest}% p.a.</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={maxInterest}
              onChange={e => setMaxInterest(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Min Loan Limit */}
          <div>
            <div className="flex items-center justify-between mb-1 text-slate-700 font-medium">
              <span>Minimum Capacity Needed:</span>
              <span className="font-bold text-blue-700">₹{(minLoanCap / 100000).toFixed(1)}L+</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000000"
              step="100000"
              value={minLoanCap}
              onChange={e => setMinLoanCap(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">State Coverage</label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="ALL">All States (Nationwide & State-specific)</option>
              <option value="Kerala">Kerala</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Bihar">Bihar</option>
              <option value="Punjab">Punjab</option>
              <option value="Assam">Assam</option>
            </select>
          </div>

        </div>

      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">No matching schemes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try broadening your interest rate cap or removing category filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setMaxInterest(8.0);
              setMinLoanCap(0);
              setSelectedState('ALL');
            }}
            className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
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
                key={scheme.id}
                scheme={scheme}
                match={match}
                onOpenExplain={(s, m) => setExplainScheme({ scheme: s, match: m })}
                onSelectForCompare={handleToggleCompare}
                isCompared={Boolean(comparedSchemes.find(c => c.id === scheme.id))}
              />
            );
          })}
        </div>
      )}

      {/* Floating Compare Tray if items selected */}
      {comparedSchemes.length > 0 && !showCompareModal && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold">{comparedSchemes.length}/3 Schemes Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-blue-50 rounded-xl transition-colors"
            >
              Compare Now
            </button>
            <button
              onClick={() => setComparedSchemes([])}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
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

      {/* Scheme Comparison Modal */}
      {showCompareModal && (
        <SchemeCompareModal
          schemes={comparedSchemes}
          onClose={() => setShowCompareModal(false)}
          onRemoveScheme={id => setComparedSchemes(comparedSchemes.filter(s => s.id !== id))}
        />
      )}

    </div>
  );
};
