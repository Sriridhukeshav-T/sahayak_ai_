import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  RotateCcw,
  Building2,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { rankSchemesForUser } from '../../services/schemeMatcherService';
import { evaluateStructuredEligibility, SchemeEligibilityEvaluation } from '../../services/structuredEligibilityEngine';
import { SchemeCard } from '../../components/schemes/SchemeCard';
import { SchemeCompareModal } from '../../components/schemes/SchemeCompareModal';
import { Scheme } from '../../types/scheme';

export const FindMySchemePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { schemes, partners } = useAppData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 3-step sequence: 1 = About You, 2 = Circumstances, 3 = Results
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    projectType: user.projectType || 'Micro Manufacturing / Tailoring',
    state: user.state || 'Tamil Nadu',
    district: user.district || 'Chennai',
    age: user.age || 28,
    category: user.category || 'General',
    income: user.income || 300000,
    loanRequirement: user.loanRequirement || 200000,
    educationStatus: user.educationStatus || '10th Pass',
    hasDefault: false,
    ownsLand: false
  });

  const [comparedSchemes, setComparedSchemes] = useState<Scheme[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      projectType: formData.projectType,
      state: formData.state,
      district: formData.district,
      age: Number(formData.age),
      category: formData.category as any
    });
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      income: Number(formData.income),
      loanRequirement: Number(formData.loanRequirement),
      projectCost: Math.round(Number(formData.loanRequirement) * 1.25),
      educationStatus: formData.educationStatus as any
    });
    setCurrentStep(3);
  };

  // Evaluate the primary target scheme (e.g. PMEGP or first scheme)
  const targetScheme = schemes.find(s => s.id === 'SCH-PMEGP-001') || schemes[0];
  const targetEvaluation: SchemeEligibilityEvaluation | null = targetScheme
    ? evaluateStructuredEligibility(
        {
          ...user,
          age: Number(formData.age),
          state: formData.state,
          district: formData.district,
          income: Number(formData.income),
          projectType: formData.projectType,
          educationStatus: formData.educationStatus as any,
          category: formData.category as any
        },
        targetScheme
      )
    : null;

  // Ranked recommended schemes
  const rankedSchemes = rankSchemesForUser(
    {
      ...user,
      age: Number(formData.age),
      state: formData.state,
      district: formData.district,
      income: Number(formData.income),
      projectType: formData.projectType,
      educationStatus: formData.educationStatus as any,
      category: formData.category as any
    },
    schemes,
    partners
  );

  const handleToggleCompare = (scheme: Scheme) => {
    if (comparedSchemes.find(s => s.id === scheme.id)) {
      setComparedSchemes(comparedSchemes.filter(s => s.id !== scheme.id));
    } else {
      if (comparedSchemes.length >= 3) {
        alert('You can compare a maximum of 3 schemes.');
        return;
      }
      const updated = [...comparedSchemes, scheme];
      setComparedSchemes(updated);
      if (updated.length >= 2) setShowCompareModal(true);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-5 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Eligibility Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Check your eligibility
          </h1>
          <p className="text-xs text-slate-600 max-w-xl">
            Answer a few questions about yourself and your activity to evaluate your eligibility against verified Government of India scheme criteria.
          </p>
        </div>

        {/* Restrained Step Indicator */}
        <div className="grid grid-cols-3 gap-2 text-xs border-b border-slate-200 pb-4">
          {[
            { num: '01', title: 'About you', step: 1 },
            { num: '02', title: 'Your circumstances', step: 2 },
            { num: '03', title: 'Eligibility result', step: 3 }
          ].map(s => {
            const isCurrent = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <div
                key={s.step}
                className={`p-2.5 rounded border transition-colors ${
                  isCurrent
                    ? 'bg-white border-[#065F46] text-[#065F46]'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 text-[#065F46]'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className="font-mono text-[10px] font-bold block">{s.num}</span>
                <span className="font-semibold text-xs text-slate-800 block">{s.title}</span>
              </div>
            );
          })}
        </div>

        {/* STEP 1: ABOUT YOU */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">01. Citizen & Location Information</h2>
              <p className="text-xs text-slate-500">Provide your basic profile details for regional scheme mapping.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trade / Sector of Activity *</label>
                <input
                  type="text"
                  required
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  placeholder="e.g. Tailoring, Dairy, Pottery, Handloom, Trading"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Applicant Age (Years) *</label>
                <input
                  type="number"
                  min={16}
                  max={85}
                  required
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State / Union Territory *</label>
                <select
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">District / Town *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <span>Continue to Circumstances</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: YOUR CIRCUMSTANCES */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Submit} className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">02. Financial & Household Circumstances</h2>
              <p className="text-xs text-slate-500">Government schemes use income slabs and loan caps to determine subsidy brackets.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Household Income (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.income}
                  onChange={e => setFormData({ ...formData, income: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Loan / Assistance Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.loanRequirement}
                  onChange={e => setFormData({ ...formData, loanRequirement: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Highest Educational Level</label>
                <select
                  value={formData.educationStatus}
                  onChange={e => setFormData({ ...formData, educationStatus: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                >
                  <option value="Below 10th">Below 10th Standard</option>
                  <option value="10th Pass">10th Pass (SSLC)</option>
                  <option value="12th Pass">12th Pass (Higher Secondary)</option>
                  <option value="Graduate">Graduate / Diploma</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="Vocational/ITI">Vocational / ITI</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banking Default History</label>
                <select
                  value={formData.hasDefault ? 'yes' : 'no'}
                  onChange={e => setFormData({ ...formData, hasDefault: e.target.value === 'yes' })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                >
                  <option value="no">No past defaults with banking institutions</option>
                  <option value="yes">Has unresolved past default</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#065F46] hover:bg-[#064E3B] text-white text-xs font-semibold rounded transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <span>Calculate Eligibility Result</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ELIGIBILITY RESULT — EVIDENCE FIRST */}
        {currentStep === 3 && (
          <div className="space-y-6">
            
            {/* Status Banner */}
            <div className={`p-5 rounded-lg border flex items-start gap-3.5 ${
              targetEvaluation?.result === 'ELIGIBLE'
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : targetEvaluation?.result === 'POTENTIALLY_ELIGIBLE'
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-rose-50/80 border-rose-300 text-rose-950'
            }`}>
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Eligibility Evaluation Result
                </span>
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  {targetEvaluation?.result === 'ELIGIBLE'
                    ? 'You appear eligible based on your entered profile'
                    : targetEvaluation?.result === 'POTENTIALLY_ELIGIBLE'
                    ? 'More information is required to confirm full eligibility'
                    : 'You do not meet one or more mandatory requirements'}
                </h3>
                <p className="text-xs leading-relaxed max-w-2xl opacity-90">
                  {targetEvaluation?.result === 'ELIGIBLE'
                    ? 'All mandatory conditions evaluated against official guidelines passed. You may proceed to prepare documentation for official submission.'
                    : targetEvaluation?.result === 'POTENTIALLY_ELIGIBLE'
                    ? 'Evaluated criteria pass, but certain scheme rules require supporting documents (e.g. land records or category certificates).'
                    : 'One or more non-negotiable rules were not satisfied. Review the table below for exact statutory criteria.'}
                </p>
              </div>
            </div>

            {/* Requirements Checked Evidence Table */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Requirements Checked ({targetScheme.officialName})
                  </h4>
                  <p className="text-[11px] text-slate-500">Evaluated deterministically against official scheme rules</p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#065F46] hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {targetEvaluation && (
                <div className="overflow-x-auto border border-slate-200 rounded">
                  <table className="civic-table">
                    <thead>
                      <tr>
                        <th>Requirement</th>
                        <th>Your Information</th>
                        <th>Result</th>
                        <th>Detailed Assessment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {targetEvaluation.ruleEvaluations.map((ev, i) => (
                        <tr key={i}>
                          <td className="font-semibold text-slate-900 max-w-xs">{ev.rule.label || ev.rule.field}</td>
                          <td className="font-mono text-slate-700">
                            {ev.actualValue !== null && ev.actualValue !== undefined ? String(ev.actualValue) : 'Not specified'}
                          </td>
                          <td>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                              ev.passed
                                ? 'bg-emerald-50 text-emerald-800'
                                : ev.missingData
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-rose-50 text-rose-800'
                            }`}>
                              {ev.passed ? 'Satisfied' : ev.missingData ? 'Info Required' : 'Not Satisfied'}
                            </span>
                          </td>
                          <td className="text-slate-600 text-xs">{ev.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recommended Schemes */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recommended Schemes for Your Circumstances</h3>
                  <p className="text-xs text-slate-500">Ranked by category compatibility and financial limits</p>
                </div>
                {comparedSchemes.length > 0 && (
                  <button
                    onClick={() => setShowCompareModal(true)}
                    className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold"
                  >
                    Compare Selected ({comparedSchemes.length}/3)
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rankedSchemes.slice(0, 4).map(({ scheme, match }) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    match={match}
                    onSelectForCompare={handleToggleCompare}
                    isCompared={Boolean(comparedSchemes.find(s => s.id === scheme.id))}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Compare Modal */}
      {showCompareModal && (
        <SchemeCompareModal
          schemes={comparedSchemes}
          onClose={() => setShowCompareModal(false)}
          onRemoveScheme={id => setComparedSchemes(prev => prev.filter(s => s.id !== id))}
        />
      )}
    </div>
  );
};

export default FindMySchemePage;
