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
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { calculateEMI } from '../../services/affordabilityService';

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
          particleCount: 60,
          spread: 60,
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
        statusOrigin: 'USER_REPORTED',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: selectedScheme.requiredDocuments.map(d => ({ name: d, status: 'Verified' as const })),
        timeline: [
          { status: 'SUBMITTED', title: 'Application Recorded in Sahayak AI', description: 'Application registered as user-reported on platform.', timestamp: new Date().toISOString(), completed: true, current: true, statusOrigin: 'USER_REPORTED' },
          { status: 'DOCUMENT_CHECK', title: 'AI Document Readiness Check', description: 'Mandatory certificates reviewed.', timestamp: '', completed: false, statusOrigin: 'USER_REPORTED' },
          { status: 'FORWARDED_TO_PARTNER', title: 'Routed to Channel Partner', description: 'Forwarded to local branch.', timestamp: '', completed: false, statusOrigin: 'USER_REPORTED' },
          { status: 'PARTNER_REVIEW', title: 'Channel Partner Appraisal', description: 'Field inspection and credit vetting.', timestamp: '', completed: false, statusOrigin: 'USER_REPORTED' },
          { status: 'SANCTIONED', title: 'Credit Sanctioned', description: 'Concessional loan sanction letter issued.', timestamp: '', completed: false, statusOrigin: 'USER_REPORTED' },
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
      <div className="border-b border-slate-200 pb-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 inline-block mb-1">
          Institutional Dossier Workflow
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Application Submission
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Complete the required verification steps to route your scheme dossier to your authorized institutional lender.
        </p>
      </div>

      {/* Stepper Header (1 - 6) */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs">
        <div className="grid grid-cols-6 gap-2 text-center">
          {[
            { num: 1, label: 'Profile' },
            { num: 2, label: 'Scheme' },
            { num: 3, label: 'Documents' },
            { num: 4, label: 'Partner' },
            { num: 5, label: 'Review' },
            { num: 6, label: 'Complete' }
          ].map(s => (
            <div key={s.num} className="space-y-1">
              <div
                className={`w-7 h-7 mx-auto rounded-sm text-xs font-semibold flex items-center justify-center transition-all ${
                  step > s.num
                    ? 'bg-emerald-800 text-white'
                    : step === s.num
                    ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-300'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-[10px] block font-medium truncate ${
                step === s.num ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-lg p-6 sm:p-8 border border-slate-200 shadow-xs min-h-[380px] flex flex-col justify-between">
        
        {/* STEP 1: APPLICANT PROFILE */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <User className="w-4 h-4 text-emerald-800" />
              <h3 className="font-semibold text-sm text-slate-900">Step 1 — Verify Applicant Particulars</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Full Name</span>
                <span className="font-semibold text-slate-900 text-sm">{user.name}</span>
              </div>
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Mobile Contact</span>
                <span className="font-semibold text-slate-900 text-sm font-mono">{user.mobile}</span>
              </div>
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Annual Household Income</span>
                <span className="font-semibold text-slate-900 text-sm font-mono">₹{user.income.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Location</span>
                <span className="font-semibold text-slate-900 text-sm">{user.district}, {user.state} ({user.pinCode})</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Need to modify details? Update your records directly in your{' '}
              <button type="button" onClick={() => navigate('/profile')} className="text-emerald-800 font-semibold hover:underline">
                Citizen Profile
              </button>.
            </p>
          </div>
        )}

        {/* STEP 2: SCHEME DETAILS */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Layers className="w-4 h-4 text-emerald-800" />
              <h3 className="font-semibold text-sm text-slate-900">Step 2 — Scheme & Financing Particulars</h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">Selected Scheme</span>
              <h4 className="font-bold text-sm text-slate-900">{selectedScheme.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedScheme.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Indicative Interest</span>
                <span className="font-semibold text-emerald-800 text-sm">{selectedScheme.interestRate}% p.a.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Maximum Tenure</span>
                <span className="font-semibold text-slate-800 text-sm">{selectedScheme.tenureMonths} Months</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Moratorium Period</span>
                <span className="font-semibold text-slate-800 text-sm">{selectedScheme.moratoriumMonths} Months</span>
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
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md font-mono font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-800"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Permissible bracket: ₹{selectedScheme.minLoan.toLocaleString('en-IN')} to ₹{selectedScheme.maxLoan.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENTS */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <FileCheck2 className="w-4 h-4 text-emerald-800" />
              <h3 className="font-semibold text-sm text-slate-900">Step 3 — Attached Documents</h3>
            </div>

            <p className="text-xs text-slate-600">
              The following certificates and proofs from your record will be attached to the application package:
            </p>

            <div className="space-y-2">
              {selectedScheme.requiredDocuments.map((doc, i) => (
                <div key={i} className="p-2.5 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-medium text-slate-800">{doc}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Verified Digital Copy
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: CHANNEL PARTNER */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Building2 className="w-4 h-4 text-emerald-800" />
              <h3 className="font-semibold text-sm text-slate-900">Step 4 — Designated Channel Partner</h3>
            </div>

            <div className="p-4 rounded-md bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedPartner.partnerType}
                </span>
                <span className="text-xs font-semibold text-emerald-800">Recommended Route</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{selectedPartner.name}</h4>
              <p className="text-xs text-slate-600">{selectedPartner.address}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span>Branch: {selectedPartner.district}</span>
                <span>Average Turnaround: ~{selectedPartner.processingDays} Days</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Need to route to another branch? Select from the{' '}
              <button type="button" onClick={() => navigate('/partners')} className="text-emerald-800 font-semibold hover:underline">
                Partner Directory Map
              </button>.
            </p>
          </div>
        )}

        {/* STEP 5: REVIEW DOSSIER */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <h3 className="font-semibold text-sm text-slate-900">Step 5 — Final Dossier Review</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Applicant</span>
                <span className="font-semibold text-slate-900">{user.name} ({user.category})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Project Activity</span>
                <span className="font-semibold text-slate-900">{user.projectType || 'General Enterprise'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Loan Amount & Scheme</span>
                <span className="font-semibold text-slate-900">₹{loanAmount.toLocaleString('en-IN')} • {selectedScheme.name.slice(0, 25)}...</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Estimated EMI</span>
                <span className="font-semibold text-emerald-800 font-mono">₹{estimatedEMI.toLocaleString('en-IN')} / month</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 sm:col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Designated Channel Partner</span>
                <span className="font-semibold text-slate-900">{selectedPartner.name} ({selectedPartner.partnerType})</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Eligibility check confirms mandatory qualifications and prerequisites are met.</span>
            </div>
          </div>
        )}

        {/* STEP 6: SUBMISSION SUCCESS */}
        {step === 6 && submittedId && (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-slate-900">
                Application Successfully Logged
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your dossier has been registered in the platform tracker and queued for partner branch verification.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-md border border-slate-200 inline-block text-left min-w-[280px]">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                Platform Tracking Reference
              </span>
              <span className="text-xl font-mono font-bold text-slate-900 block mt-0.5">
                {submittedId}
              </span>
              <span className="text-[11px] text-slate-600 mt-1 block">
                Assigned Partner: <strong className="text-slate-900">{selectedPartner.name}</strong>
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/applications')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Track Application Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors"
              >
                Return to Citizen Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Workflow Bottom Stepper Buttons */}
        {step < 6 && (
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-all shadow-xs flex items-center gap-2"
            >
              <span>{step === 5 ? 'Confirm & Submit Application' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
