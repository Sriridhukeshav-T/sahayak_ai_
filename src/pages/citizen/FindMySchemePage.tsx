import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
  Calculator,
  RefreshCw,
  Sliders,
  HelpCircle,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { extractGoalFromNaturalLanguage, ExtractedGoalTokens } from '../../services/naturalLanguageService';
import { rankSchemesForUser } from '../../services/schemeMatcherService';
import { VoiceInputButton } from '../../components/ai/VoiceInputButton';
import { SchemeCard } from '../../components/schemes/SchemeCard';
import { ExplainableModal } from '../../components/schemes/ExplainableModal';
import { SchemeCompareModal } from '../../components/schemes/SchemeCompareModal';
import { Scheme } from '../../types/scheme';
import { MatchBreakdown } from '../../types/common';
import { DemoBadge } from '../../components/common/DemoBadge';

export const FindMySchemePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { schemes, partners } = useAppData();
  const { t } = useLanguage();

  const [inputMode, setInputMode] = useState<'text' | 'form'>('text');
  const [naturalText, setNaturalText] = useState(
    'I want to start a small tailoring shop. I need ₹1.2 lakh and my annual family income is ₹3.2 lakh.'
  );

  // Guided Form state
  const [formState, setFormState] = useState({
    projectType: user.projectType || 'Tailoring',
    goal: user.goal || 'Start a business',
    loanRequirement: user.loanRequirement || 120000,
    income: user.income || 320000,
    state: user.state || 'Kerala',
    district: user.district || 'Palakkad'
  });

  // Processing state machine
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const processingMessages = [
    t('understandingGoal'),
    t('analyzingProfile'),
    t('matchingSchemes'),
    t('findingPartners')
  ];

  // Extracted tokens & Match Results
  const [extractedTokens, setExtractedTokens] = useState<ExtractedGoalTokens | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [explainScheme, setExplainScheme] = useState<{ scheme: Scheme; match: MatchBreakdown } | null>(null);
  const [comparedSchemes, setComparedSchemes] = useState<Scheme[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Handle Natural Language or Voice Submission
  const handleProcessGoal = (inputTextToParse?: string) => {
    const textToUse = inputTextToParse || naturalText;
    if (!textToUse.trim()) return;

    setIsProcessing(true);
    setProcessingStage(0);

    // Progressive 4-stage AI loader
    setTimeout(() => setProcessingStage(1), 450);
    setTimeout(() => setProcessingStage(2), 900);
    setTimeout(() => setProcessingStage(3), 1350);

    setTimeout(() => {
      const tokens = extractGoalFromNaturalLanguage(textToUse);
      setExtractedTokens(tokens);

      // Update current user profile with extracted parameters
      updateUserProfile({
        projectType: tokens.projectType,
        goal: tokens.purpose,
        loanRequirement: tokens.loanRequirement,
        projectCost: tokens.projectCost,
        income: tokens.income
      });

      setIsProcessing(false);
      setHasSearched(true);
    }, 1800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStage(0);

    setTimeout(() => setProcessingStage(1), 400);
    setTimeout(() => setProcessingStage(2), 800);
    setTimeout(() => setProcessingStage(3), 1200);

    setTimeout(() => {
      updateUserProfile({
        projectType: formState.projectType,
        goal: formState.goal,
        loanRequirement: Number(formState.loanRequirement),
        projectCost: Math.round(Number(formState.loanRequirement) * 1.25),
        income: Number(formState.income),
        state: formState.state,
        district: formState.district
      });

      setExtractedTokens({
        rawInput: 'Guided form entry',
        projectType: formState.projectType,
        purpose: formState.goal,
        loanRequirement: Number(formState.loanRequirement),
        projectCost: Math.round(Number(formState.loanRequirement) * 1.25),
        income: Number(formState.income),
        confidenceScore: 99,
        extractedFields: [
          { label: 'Project Type', value: formState.projectType, key: 'projectType' },
          { label: 'Primary Goal', value: formState.goal, key: 'purpose' },
          { label: 'Loan Requirement', value: `₹${Number(formState.loanRequirement).toLocaleString('en-IN')}`, key: 'loanRequirement' },
          { label: 'Estimated Project Cost', value: `₹${Math.round(Number(formState.loanRequirement) * 1.25).toLocaleString('en-IN')}`, key: 'projectCost' },
          { label: 'Annual Income', value: `₹${Number(formState.income).toLocaleString('en-IN')}`, key: 'income' }
        ]
      });

      setIsProcessing(false);
      setHasSearched(true);
    }, 1600);
  };

  // Rank schemes dynamically
  const rankedSchemes = rankSchemesForUser(user, schemes, partners);
  const topSchemes = rankedSchemes.slice(0, 3);

  const handleToggleCompare = (scheme: Scheme) => {
    if (comparedSchemes.find(s => s.id === scheme.id)) {
      setComparedSchemes(comparedSchemes.filter(s => s.id !== scheme.id));
    } else {
      if (comparedSchemes.length >= 3) {
        alert('You can compare a maximum of 3 schemes simultaneously.');
        return;
      }
      const updated = [...comparedSchemes, scheme];
      setComparedSchemes(updated);
      if (updated.length >= 2) setShowCompareModal(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Core Recommender Engine
          </span>
          <DemoBadge />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('whatAreYouAchieving')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
          Don't search through dozens of complex government manuals. Tell us what you want to do, and Sahayak AI will match the right scheme for you.
        </p>
      </div>

      {/* Input Methods Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Toggle between Natural Language & Guided Form */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setInputMode('text')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                inputMode === 'text' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Natural Language & Voice
            </button>
            <button
              onClick={() => setInputMode('form')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                inputMode === 'form' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('guidedForm')}
            </button>
          </div>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Zero financial jargon required
          </span>
        </div>

        {/* MODE 1: NATURAL LANGUAGE & VOICE */}
        {inputMode === 'text' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="relative">
              <textarea
                rows={3}
                value={naturalText}
                onChange={e => setNaturalText(e.target.value)}
                placeholder="e.g. I want to start a small tailoring shop. I need ₹1.2 lakh and my annual family income is ₹3.2 lakh."
                className="w-full p-4 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 leading-relaxed resize-none transition-all"
              />
            </div>

            {/* Quick Actions Bar below input */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <VoiceInputButton
                  onTranscript={transcript => {
                    setNaturalText(transcript);
                    handleProcessGoal(transcript);
                  }}
                />

                {/* Example Prompts Dropdown / Chips */}
                <button
                  type="button"
                  onClick={() => {
                    const sample = 'I want to purchase agricultural equipment for custom hiring in Thanjavur. I need ₹6 lakh loan and our annual income is ₹4.2 lakh.';
                    setNaturalText(sample);
                  }}
                  className="hidden sm:inline-block px-2.5 py-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Try: Agri Implements (₹6L)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sample = 'I need an education loan of ₹6 lakh for M.Tech Biotechnology. Annual family income is ₹2.8 lakh.';
                    setNaturalText(sample);
                  }}
                  className="hidden lg:inline-block px-2.5 py-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Try: Higher Education (₹6L)
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleProcessGoal()}
                disabled={isProcessing || !naturalText.trim()}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-blue-700/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Find My Matched Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: GUIDED FORM */}
        {inputMode === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Trade / Activity</label>
                <input
                  type="text"
                  required
                  value={formState.projectType}
                  onChange={e => setFormState({ ...formState, projectType: e.target.value })}
                  placeholder="e.g. Tailoring, Dairy, Pottery, Common Service Center"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Desired Loan Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={formState.loanRequirement}
                  onChange={e => setFormState({ ...formState, loanRequirement: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Household Income (₹)</label>
                <input
                  type="number"
                  required
                  value={formState.income}
                  onChange={e => setFormState({ ...formState, income: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State & District</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formState.state}
                    onChange={e => setFormState({ ...formState, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    value={formState.district}
                    onChange={e => setFormState({ ...formState, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Match Suitable Schemes</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* AI Processing Animation Stage Overlay */}
      {isProcessing && (
        <div className="p-8 rounded-3xl bg-white border border-blue-200 shadow-xl text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-700 relative">
            <Sparkles className="w-8 h-8 animate-spin text-blue-600" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 animate-pulse">
              {processingMessages[processingStage]}
            </h3>
            <p className="text-xs text-slate-400">
              Evaluating 50+ central and state schemes against 5-factor compatibility criteria
            </p>
          </div>

          <div className="max-w-xs mx-auto w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((processingStage + 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Extracted Tokens Feedback Panel */}
      {!isProcessing && extractedTokens && (
        <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>AI Extracted Parameters ({extractedTokens.confidenceScore}% parser confidence)</span>
            </span>
            <span className="text-[11px] text-slate-500">Auto-mapped into matching engine</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {extractedTokens.extractedFields.map((f, i) => (
              <div
                key={i}
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs flex items-center gap-1.5"
              >
                <span className="text-slate-400 font-medium">{f.label}:</span>
                <span className="font-bold text-blue-900">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Header & Recommendations Grid */}
      {!isProcessing && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Top 3 Recommended Schemes
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Dynamic Scores
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Scores dynamically computed using multi-factor income, loan limit, and local partner presence.
              </p>
            </div>

            {comparedSchemes.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
              >
                Compare Selected ({comparedSchemes.length}/3)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topSchemes.map(({ scheme, match }) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                match={match}
                onOpenExplain={(s, m) => setExplainScheme({ scheme: s, match: m })}
                onSelectForCompare={handleToggleCompare}
                isCompared={Boolean(comparedSchemes.find(c => c.id === scheme.id))}
              />
            ))}
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
