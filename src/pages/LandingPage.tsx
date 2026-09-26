import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileText,
  ExternalLink,
  Landmark,
  Briefcase,
  Sprout,
  GraduationCap,
  Home,
  Sun,
  Users,
  CreditCard,
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AUTHORITATIVE_SCHEMES } from '../data/authoritativeSchemes';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/schemes');
    }
  };

  const handlePopularSearch = (term: string) => {
    navigate(`/schemes?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen">
      
      {/* 1. Hero Section — Editorial Composition */}
      <section className="border-b border-slate-200 bg-white pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left 7 Columns: Core Value & Search */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#065F46] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                  Public Scheme Discovery
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Find the government support you may be entitled to.
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl pt-1">
                  Sahayak AI connects citizens, farmers, and entrepreneurs with verified Central and State welfare programs, credit subsidies, and livelihood schemes using deterministic eligibility criteria.
                </p>
              </div>

              {/* Product-Grade Search Component */}
              <div className="space-y-2.5 pt-1">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search schemes, benefits, departments (e.g. MSME, solar, farming, women)..."
                    className="w-full pl-10 pr-28 py-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#065F46] focus:bg-white text-slate-900 placeholder:text-slate-400 transition-colors shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs"
                  >
                    Search
                  </button>
                </form>

                {/* Popular Search Text Links */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-1">
                  <span className="font-medium text-slate-400">Popular searches:</span>
                  {['PM-KISAN', 'PMEGP Subsidy', 'MUDRA Loan', 'PM Surya Ghar Solar', 'Stand-Up India'].map(term => (
                    <button
                      key={term}
                      onClick={() => handlePopularSearch(term)}
                      className="text-slate-600 hover:text-[#065F46] hover:underline"
                    >
                      {term},
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/schemes"
                  className="px-5 py-2.5 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <span>Explore Schemes Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/find-scheme"
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded border border-slate-300 transition-colors"
                >
                  Check Eligibility Checklist
                </Link>
              </div>

            </div>

            {/* Right 4 Columns: Official Repository Notice */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Landmark className="w-4 h-4 text-[#065F46]" />
                <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Authoritative Repository
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 block">Verified Flagship Programs</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    15 Central & State flagship schemes cross-referenced with official gazettes and ministry portals.
                  </p>
                </div>

                <div className="space-y-0.5 border-t border-slate-200 pt-2.5">
                  <span className="font-semibold text-slate-900 block">Deterministic Eligibility</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Clear rule-by-rule evaluation without arbitrary confidence scores or AI hallucination.
                  </p>
                </div>

                <div className="space-y-0.5 border-t border-slate-200 pt-2.5">
                  <span className="font-semibold text-slate-900 block">Waiting Period Tracking</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Dossier tracking distinguishing citizen-reported milestones from official system integrations.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <Link
                  to="/schemes"
                  className="text-xs font-semibold text-[#065F46] hover:underline flex items-center gap-1"
                >
                  <span>Browse full scheme index</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. "Explore Support by Need" — Structured Editorial Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Taxonomy & Categorization
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Explore support by need
            </h2>
          </div>
          <Link
            to="/schemes"
            className="text-xs font-semibold text-[#065F46] hover:underline flex items-center gap-1"
          >
            <span>View all categories</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Asymmetric 12-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Featured Large Item: Business & Micro Enterprise (Col 7) */}
          <div
            onClick={() => navigate('/schemes?category=Micro Enterprise')}
            className="md:col-span-7 bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded bg-emerald-50 text-[#065F46] flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                High Allocation
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#065F46] transition-colors">
                Business & Micro-Enterprise
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Credit subsidies, capital grants, and collateral-free loan programs for starting or expanding micro-manufacturing, trade, and service units.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-500">
              <span className="px-2 py-0.5 bg-slate-100 rounded">PMEGP (Up to ₹50 Lakh)</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded">MUDRA Tarun (Up to ₹20 Lakh)</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded">PM SVANidhi</span>
            </div>
          </div>

          {/* Featured Large Item: Agriculture & Rural (Col 5) */}
          <div
            onClick={() => navigate('/schemes?category=Agriculture & Allied')}
            className="md:col-span-5 bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded bg-emerald-50 text-[#065F46] flex items-center justify-center font-bold">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Direct Transfers
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#065F46] transition-colors">
                Agriculture & Allied
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Income support, farm machinery subsidies, and post-harvest infrastructure loans for farmers and primary producers.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-500">
              <span className="px-2 py-0.5 bg-slate-100 rounded">PM-KISAN (₹6,000/yr)</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded">Agri Infra Fund</span>
            </div>
          </div>

          {/* Compact Item: Clean Energy & Solar (Col 4) */}
          <div
            onClick={() => navigate('/schemes?category=Green & Renewable')}
            className="md:col-span-4 bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors space-y-2 group"
          >
            <div className="w-7 h-7 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#065F46] transition-colors">
              Clean Energy & Rooftop Solar
            </h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              Direct subsidies up to ₹78,000 for residential rooftop solar installations under PM Surya Ghar.
            </p>
          </div>

          {/* Compact Item: Women & Special Categories (Col 4) */}
          <div
            onClick={() => navigate('/schemes?category=Women Entrepreneurship')}
            className="md:col-span-4 bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors space-y-2 group"
          >
            <div className="w-7 h-7 rounded bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#065F46] transition-colors">
              Women & Special Categories
            </h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              Preferential margin money (up to 35%) and composite bank credit under Stand-Up India and state programs.
            </p>
          </div>

          {/* Compact Item: Education & Apprenticeship (Col 4) */}
          <div
            onClick={() => navigate('/schemes?category=Education & Skill')}
            className="md:col-span-4 bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors space-y-2 group"
          >
            <div className="w-7 h-7 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#065F46] transition-colors">
              Education & Apprenticeships
            </h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              National apprenticeship stipends (NAPS-2) and subsidized educational term credit.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Publication-Grade Trust & Source Methodology Section */}
      <section className="bg-white border-y border-slate-200 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="max-w-3xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#065F46]">
              Verification Standards
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Government information, carefully sourced.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every scheme profile on Sahayak AI includes explicit source attribution, field-level verification metadata, and direct gateways to official Government of India or State department portals.
            </p>
          </div>

          {/* 3 Source Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-emerald-100/70 text-[#065F46] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-xs text-slate-900">Official Government Gazette & Portals</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Rules, eligibility conditions, and benefit tables are extracted directly from official ministry directives (e.g. Ministry of MSME, Ministry of Agriculture, Ministry of Finance).
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-emerald-100/70 text-[#065F46] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-xs text-slate-900">Absence Handling Integrity</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                If an official directive does not publish an exact application deadline or processing duration, Sahayak AI records "Not specified in official source". No synthetic numbers are invented.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-7 h-7 rounded bg-emerald-100/70 text-[#065F46] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-xs text-slate-900">Direct Application Gateways</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Sahayak AI provides authenticated links to official online application portals (such as pmegp.msme.gov.in and udyamimitra.in), never routing citizens through third-party intermediaries.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Featured Flagship Schemes Spotlight */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Verified Profiles
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Featured national flagship programs
            </h2>
          </div>
          <Link
            to="/schemes"
            className="text-xs font-semibold text-[#065F46] hover:underline flex items-center gap-1"
          >
            <span>View all 15 programs</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 3 Editorial Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AUTHORITATIVE_SCHEMES.slice(0, 3).map(scheme => {
            const maxLoan = scheme.benefits?.maxLoanAmount ?? scheme.maxLoan;
            const subsidy = scheme.benefits?.subsidyPercentage ?? scheme.subsidyPercentage;
            return (
              <div
                key={scheme.id}
                className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {scheme.state === 'Central' ? 'Central' : scheme.state}
                    </span>
                    <span className="text-[11px] font-medium text-[#065F46] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Source</span>
                    </span>
                  </div>

                  <div>
                    <Link
                      to={`/schemes/${scheme.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-[#065F46] transition-colors leading-snug block"
                    >
                      {scheme.officialName}
                    </Link>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {scheme.ministry}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {scheme.description}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 block">Benefit</span>
                      <span className="font-bold text-slate-800 text-xs">
                        {maxLoan ? `Up to ₹${(maxLoan / 100000).toFixed(1)}L` : 'Direct Transfer'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 block">Subsidy</span>
                      <span className="font-bold text-[#065F46] text-xs">
                        {subsidy && subsidy > 0 ? `${subsidy}% Margin` : 'Welfare'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                  <Link
                    to={`/schemes/${scheme.id}`}
                    className="flex-1 text-center px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors"
                  >
                    View Guidelines
                  </Link>
                  {scheme.officialApplicationUrl && (
                    <a
                      href={scheme.officialApplicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                      title="Open Official Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Prompt Banner */}
      <section className="border-t border-slate-200 bg-slate-100 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Know which schemes apply to you before submitting documents
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Evaluate your eligibility against real government criteria including age, state domicile, trade classification, and income limits.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <Link
              to="/find-scheme"
              className="px-5 py-2.5 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs"
            >
              Start Eligibility Check
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
