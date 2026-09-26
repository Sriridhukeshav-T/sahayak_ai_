import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ShieldCheck,
  Building2,
  ExternalLink,
  Clock,
  ArrowRight,
  Layers,
  X,
  CheckCircle2,
  RotateCcw,
  LayoutGrid,
  List
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SchemeCard } from '../../components/schemes/SchemeCard';
import { SchemeCompareModal } from '../../components/schemes/SchemeCompareModal';
import { ExplainableModal } from '../../components/schemes/ExplainableModal';
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
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | 'ALL'>('ALL');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'ALL' | 'Central' | 'State'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'OPEN' | 'CLOSING_SOON' | 'CLOSED'>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');

  const [comparedSchemes, setComparedSchemes] = useState<Scheme[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [explainScheme, setExplainScheme] = useState<{ scheme: Scheme; match: MatchBreakdown } | null>(null);
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');

  // Sync URL query params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get('q');
    if (qParam) setSearchTerm(qParam);

    const catParam = params.get('category');
    if (catParam && CATEGORIES.includes(catParam as any)) {
      setSelectedCategory(catParam as any);
    }
  }, [location.search]);

  // Dynamic filter evaluation
  const filteredSchemes = useMemo(() => {
    return schemes.filter(s => {
      // 1. Category
      if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;

      // 2. Jurisdiction Filter
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

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedJurisdiction('ALL');
    setSelectedStatus('ALL');
    setSelectedState('ALL');
    navigate('/schemes', { replace: true });
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'ALL' || selectedJurisdiction !== 'ALL' || selectedStatus !== 'ALL' || selectedState !== 'ALL';

  const handleToggleCompare = (scheme: Scheme) => {
    if (comparedSchemes.find(s => s.id === scheme.id)) {
      setComparedSchemes(comparedSchemes.filter(s => s.id !== scheme.id));
    } else {
      if (comparedSchemes.length >= 3) {
        alert('You can select at most 3 schemes to compare.');
        return;
      }
      const updated = [...comparedSchemes, scheme];
      setComparedSchemes(updated);
      if (updated.length >= 2) setShowCompareModal(true);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Directory Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Official Directory
              </span>
              <span className="text-[11px] font-medium text-[#065F46] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Guidelines</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Government Schemes
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredSchemes.length} schemes available based on current search & criteria
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
              <button
                type="button"
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded text-xs transition-colors ${layoutMode === 'list' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'}`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded text-xs transition-colors ${layoutMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'}`}
                title="Grid View (3-column)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compare Toolbar if active */}
            {comparedSchemes.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Compare Selected ({comparedSchemes.length}/3)</span>
                </button>
                <button
                  onClick={() => setComparedSchemes([])}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by scheme name, ministry, category, or keywords (e.g. MSME, KVIC, solar, farmer)..."
            className="w-full pl-10 pr-20 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#065F46] text-slate-900 placeholder:text-slate-400 shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* 12-Column Desktop Layout: 4 Cols Filters + 8 Cols Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 4 Columns: Filters Panel */}
          <aside className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-[#065F46]" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] text-[#065F46] hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Category</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Jurisdiction Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Government Level</label>
              <div className="flex flex-col gap-1 text-xs text-slate-700">
                {[
                  { value: 'ALL', label: 'All Jurisdictions' },
                  { value: 'Central', label: 'Central Government' },
                  { value: 'State', label: 'State Government Programs' }
                ].map(item => (
                  <label key={item.value} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50">
                    <input
                      type="radio"
                      name="jurisdiction"
                      checked={selectedJurisdiction === item.value}
                      onChange={() => setSelectedJurisdiction(item.value as any)}
                      className="text-[#065F46] focus:ring-[#065F46]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Application Window Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Application Status</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open / Ongoing Flagship Missions</option>
                <option value="CLOSING_SOON">Closing Soon (≤ 7 Days)</option>
                <option value="CLOSED">Window Closed</option>
              </select>
            </div>

            {/* State Domicile */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">State / Region</label>
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
              >
                <option value="ALL">All States (Nationwide)</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Kerala">Kerala</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Notice on Coverage:</p>
              <p>
                All 15 schemes maintain verified eligibility rules, required documents, and official application URLs.
              </p>
            </div>
          </aside>

          {/* Right 8 Columns: Directory List of Results */}
          <main className="lg:col-span-8 space-y-4">
            
            {filteredSchemes.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-lg border border-slate-200 space-y-3">
                <p className="font-bold text-sm text-slate-800">No matching schemes found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search query or broadening your category and state selections.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-[#065F46] text-white text-xs font-semibold rounded hover:bg-[#064E3B] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : layoutMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSchemes.map(scheme => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onSelectForCompare={handleToggleCompare}
                    isCompared={Boolean(comparedSchemes.find(s => s.id === scheme.id))}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSchemes.map(scheme => {
                  const maxLoan = scheme.benefits?.maxLoanAmount ?? scheme.maxLoan;
                  const subsidy = scheme.benefits?.subsidyPercentage ?? scheme.subsidyPercentage;
                  const schemeId = scheme.id || scheme.schemeId;
                  const isCompared = Boolean(comparedSchemes.find(s => s.id === scheme.id));

                  return (
                    <article
                      key={schemeId}
                      className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 p-5 transition-colors space-y-3"
                    >
                      {/* Top Metadata Strip */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {scheme.state === 'Central' ? 'Central' : scheme.state}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {scheme.category}
                          </span>
                          {scheme.schemeStatus === 'CLOSING_SOON' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Closing Soon</span>
                            </span>
                          )}
                        </div>

                        {scheme.verificationStatus === 'VERIFIED' && (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-[#065F46]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified Government Source</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Ministry */}
                      <div>
                        <Link
                          to={`/schemes/${schemeId}`}
                          className="font-bold text-base text-slate-900 hover:text-[#065F46] transition-colors leading-snug block"
                        >
                          {scheme.officialName || scheme.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{scheme.ministry || scheme.governmentDepartment}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {scheme.description}
                      </p>

                      {/* Fact Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">Assistance</span>
                          <span className="font-bold text-slate-900 text-xs">
                            {maxLoan ? `Up to ₹${(maxLoan / 100000).toFixed(1)} Lakh` : scheme.benefits?.summary ? scheme.benefits.summary.slice(0, 22) + '...' : 'Direct Transfer'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">Subsidy / Benefit</span>
                          <span className="font-bold text-[#065F46] text-xs">
                            {subsidy && subsidy > 0 ? `${subsidy}% Margin Subsidy` : 'Direct Welfare'}
                          </span>
                        </div>
                        <div className="hidden sm:block">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">Window Status</span>
                          <span className="font-semibold text-slate-700 text-xs">
                            {scheme.isOngoing ? 'Ongoing Mission' : scheme.schemeStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/schemes/${schemeId}`}
                            className="px-4 py-2 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs"
                          >
                            View Scheme Details →
                          </Link>

                          {scheme.officialApplicationUrl && (
                            <a
                              href={scheme.officialApplicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded border border-slate-200 transition-colors flex items-center gap-1.5"
                            >
                              <span>Official Portal</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          )}
                        </div>

                        <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer hover:text-slate-800">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => handleToggleCompare(scheme)}
                            className="rounded text-[#065F46] focus:ring-[#065F46]"
                          />
                          <span>Compare</span>
                        </label>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Compare Modal */}
      {showCompareModal && (
        <SchemeCompareModal
          schemes={comparedSchemes}
          onClose={() => setShowCompareModal(false)}
          onRemoveScheme={id => setComparedSchemes(prev => prev.filter(s => s.id !== id))}
        />
      )}

      {/* Explainable Modal */}
      {explainScheme && (
        <ExplainableModal
          scheme={explainScheme.scheme}
          match={explainScheme.match}
          onClose={() => setExplainScheme(null)}
        />
      )}

    </div>
  );
};

export default SchemeExplorerPage;
