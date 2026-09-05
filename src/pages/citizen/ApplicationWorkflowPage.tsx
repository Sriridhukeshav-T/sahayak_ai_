import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Layers,
  FileCheck2,
  Building2,
  Send,
  Sparkles,
  ShieldCheck,
  Calculator,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { calculateEMI } from '../../services/affordabilityService';
import { DemoBadge } from '../../components/common/DemoBadge';

export const ApplicationWorkflowPage: React.FC = () => {
  const { user } = useAuth();
  const { schemes, partners, activeScheme, activePartner, submitApplication } = useAppData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form selections
  const schemeIdParam = searchParams.get('schemeId');
  const selectedScheme = (schemeIdParam ? schemes.find(s => s.id === schemeIdParam) : activeScheme) || schemes[0];
  const selectedPartner = activePartner || partners[0];

  const [loanAmount, setLoanAmount] = useState(user.loanRequirement || 120000);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const estimatedEMI = calculateEMI(loanAmount, selectedScheme.interestRate, selectedScheme.tenureMonths);

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else if (step === 5) {
      // Step 6 is submit
      const uniqueId = `SAH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedId(uniqueId);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      submitApplication({
        id: uniqueId,
        userId: user.id,
        applicantName: user.name,
        applicantMobile: user.mobile,
        applicantState: user.state,
        applicantDistrict: user.district,
        schemeId: selectedScheme.id,
        schemeName: selectedScheme.name,
        schemeCategory: selectedScheme.category,
        partnerId: selectedPartner.id,
        partnerName: selectedPartner.name,
        partnerType: selectedPartner.partnerType,
        partnerBranch: `${selectedPartner.district} Branch`,
        projectType: user.projectType || 'Enterprise',
        projectCost: Math.round(loanAmount * 1.25),
        ownContribution: Math.round(loanAmount * 0.25),
        loanAmount: loanAmount,
        interestRate: selectedScheme.interestRate,
        tenureMonths: selectedScheme.tenureMonths,
        estimatedEMI: estimatedEMI,
        matchScore: 94,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: selectedScheme.requiredDocuments.map(d => ({ name: d, status: 'Verified' as const })),
        timeline: [
          { status: 'SUBMITTED', title: 'Application Submitted', description: 'Application registered on Sahayak AI gateway.', timestamp: new Date().toISOString(), completed: true, current: true },
          { status: 'DOCUMENT_CHECK', title: 'AI Document Readiness Check', description: 'Mandatory certificates reviewed.', timestamp: '', completed: false },
          { status: 'FORWARDED_TO_PARTNER', title: 'Routed to Channel Partner', description: 'Forwarded to local branch.', timestamp: '', completed: false },
          { status: 'PARTNER_REVIEW', title: 'Channel Partner Appraisal', description: 'Field inspection and credit vetting.', timestamp: '', completed: false },
          { status: 'SANCTIONED', title: 'Credit Sanctioned', description: 'Concessional loan sanction letter issued.', timestamp: '', completed: false },
          { status: 'DISBURSED', title: 'Loan Disbursed', description: 'Amount credited to account.', timestamp: '', completed: false }
        ],
        remarks: 'Direct submission via Sahayak AI citizen workflow.',
        demoData: true
      });

      setStep(6);
    }
  };

  const handlePrev = () => {
    if (step > 1 && step < 6) setStep(prev => prev - 1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800">
            6-Step Application Dossier
          </span>
          <DemoBadge />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Apply for Concessional Credit
        </h1>
        <p className="text-xs text-slate-500">
          Seamless institutional loan submission routed directly to your authorized channel partner.
        </p>
      </div>

      {/* Stepper Header (1 - 6) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="grid grid-cols-6 gap-1 text-center">
          {[
            { num: 1, label: 'Profile' },
            { num: 2, label: 'Scheme' },
            { num: 3, label: 'Documents' },
            { num: 4, label: 'Partner' },
            { num: 5, label: 'Review' },
            { num: 6, label: 'Submit' }
          ].map(s => (
            <div key={s.num} className="space-y-1">
              <div
                className={`w-7 h-7 mx-auto rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  step > s.num
                    ? 'bg-emerald-600 text-white'
                    : step === s.num
                    ? 'bg-blue-600 text-white shadow-xs ring-4 ring-blue-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-[10px] block font-semibold truncate ${
                step === s.num ? 'text-blue-700' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs min-h-[380px] flex flex-col justify-between">
        
        {/* STEP 1: APPLICANT PROFILE */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Step 1 — Verify Applicant Particulars</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Full Name</span>
                <span className="font-bold text-slate-900 text-sm">{user.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Mobile Contact</span>
                <span className="font-bold text-slate-900 text-sm">{user.mobile}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Annual Household Income</span>
                <span className="font-bold text-slate-900 text-sm">₹{user.income.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="font-bold text-slate-900 text-sm">{user.district}, {user.state} ({user.pinCode})</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Need to change your particulars? You can update them directly in your <button type="button" onClick={() => navigate('/profile')} className="text-blue-600 font-bold hover:underline">Financial Profile</button>.
            </p>
          </div>
        )}

        {/* STEP 2: SCHEME DETAILS */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Step 2 — Scheme & Loan Amount</h3>
            </div>

            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Selected Scheme</span>
              <h4 className="font-extrabold text-sm text-blue-950">{selectedScheme.name}</h4>
              <p className="text-xs text-blue-900 leading-relaxed">{selectedScheme.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Interest Rate</span>
                <span className="font-bold text-emerald-700 text-sm">{selectedScheme.interestRate}% p.a.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Tenure</span>
                <span className="font-bold text-slate-800 text-sm">{selectedScheme.tenureMonths} Months</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Moratorium</span>
                <span className="font-bold text-purple-700 text-sm">{selectedScheme.moratoriumMonths} Months</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requested Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={e => setLoanAmount(Number(e.target.value))}
                min={selectedScheme.minLoan}
                max={selectedScheme.maxLoan}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold font-mono text-blue-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Allowed range: ₹{selectedScheme.minLoan.toLocaleString('en-IN')} to ₹{selectedScheme.maxLoan.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENTS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Step 3 — Attached Documents</h3>
            </div>

            <p className="text-xs text-slate-500">
              The following required documents are attached from your verified Sahayak dossier:
            </p>

            <div className="space-y-2">
              {selectedScheme.requiredDocuments.map((doc, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900">{doc}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Verified Digital Copy
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: CHANNEL PARTNER */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Step 4 — Designated Channel Partner</h3>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                  {selectedPartner.partnerType}
                </span>
                <span className="text-xs font-bold text-emerald-700">Recommended Route</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{selectedPartner.name}</h4>
              <p className="text-xs text-slate-500">{selectedPartner.address}</p>
              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                <span>Branch: {selectedPartner.district}</span>
                <span>Average Turnaround: ~{selectedPartner.processingDays} Days</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Want to route to a different branch? You can pick another authorized lender on the <button type="button" onClick={() => navigate('/partners')} className="text-blue-600 font-bold hover:underline">Find a Partner map</button>.
            </p>
          </div>
        )}

        {/* STEP 5: REVIEW DOSSIER */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Step 5 — Final Dossier Review</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Applicant</span>
                <span className="font-bold text-slate-900">{user.name} ({user.category})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Project Category</span>
                <span className="font-bold text-slate-900">{user.projectType || 'Tailoring'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Loan Amount & Scheme</span>
                <span className="font-bold text-blue-900">₹{loanAmount.toLocaleString('en-IN')} • {selectedScheme.name.slice(0, 25)}...</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Estimated EMI</span>
                <span className="font-bold text-emerald-700">₹{estimatedEMI.toLocaleString('en-IN')} / month</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 block text-[10px]">Designated Channel Partner</span>
                <span className="font-bold text-slate-900">{selectedPartner.name} ({selectedPartner.partnerType})</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>AI Match Compatibility confirmed at 94%. Dossier meets credit sanctioning prerequisites.</span>
            </div>
          </div>
        )}

        {/* STEP 6: SUBMISSION SUCCESS */}
        {step === 6 && submittedId && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                Application Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-500">
                Your dossier has been registered on the institutional network and dispatched to your channel partner.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block text-left min-w-[280px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Unique Application Tracking ID
              </span>
              <span className="text-xl font-mono font-black text-blue-700 block mt-0.5">
                {submittedId}
              </span>
              <span className="text-[11px] text-slate-600 mt-1 block">
                Assigned Partner: <strong>{selectedPartner.name}</strong>
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/applications')}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md transition-colors"
              >
                Track Application Timeline →
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Workflow Bottom Stepper Buttons */}
        {step < 6 && (
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-md shadow-blue-700/20 flex items-center gap-2"
            >
              <span>{step === 5 ? 'Submit Application' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
