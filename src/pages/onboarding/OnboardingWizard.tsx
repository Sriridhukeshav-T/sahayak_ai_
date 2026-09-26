import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Target,
  IndianRupee,
  Briefcase,
  MapPin,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OnboardingWizard: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    name: user.name || 'Anjali Nair',
    age: user.age || 29,
    gender: user.gender || 'Female',
    category: user.category || 'OBC',
    preferredLanguage: user.preferredLanguage || 'ml',
    goal: user.goal || 'Start a business',
    income: user.income || 320000,
    monthlyExpenses: user.monthlyExpenses || 14000,
    existingLoans: user.existingLoans || false,
    existingEMI: user.existingEMI || 0,
    loanRequirement: user.loanRequirement || 120000,
    projectType: user.projectType || 'Tailoring',
    purpose: user.purpose || 'Boutique and sewing workshop',
    projectCost: user.projectCost || 150000,
    ownContribution: user.ownContribution || 30000,
    expectedBusinessIncome: user.expectedBusinessIncome || 18500,
    experienceYears: user.experienceYears || 3,
    state: user.state || 'Kerala',
    district: user.district || 'Palakkad',
    pinCode: user.pinCode || '678001'
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      // Finish onboarding
      updateUserProfile({
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender as any,
        category: formData.category as any,
        preferredLanguage: formData.preferredLanguage as any,
        goal: formData.goal,
        income: Number(formData.income),
        monthlyExpenses: Number(formData.monthlyExpenses),
        existingLoans: Boolean(formData.existingLoans),
        existingEMI: Number(formData.existingEMI),
        loanRequirement: Number(formData.loanRequirement),
        projectType: formData.projectType,
        purpose: formData.purpose,
        projectCost: Number(formData.projectCost),
        ownContribution: Number(formData.ownContribution),
        expectedBusinessIncome: Number(formData.expectedBusinessIncome),
        experienceYears: Number(formData.experienceYears),
        state: formData.state,
        district: formData.district,
        pinCode: formData.pinCode
      });
      navigate('/find-scheme');
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          updateUserProfile({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          alert('GPS location detected successfully! Coordinates saved for smart partner routing.');
        },
        () => {
          alert('Location access denied or unavailable; using Palakkad, Kerala default coordinates.');
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Wizard Top Progress */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-emerald-800 flex items-center justify-center text-white font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Citizen Profile Setup</h2>
                <p className="text-[11px] text-slate-400">Step {step} of {totalSteps}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-sm border border-slate-700">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Body Form */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Step 1 — About You</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  >
                    <option value="Female">Female (Priority for women-empowerment schemes)</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Social Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  >
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="Minority">Minority Community</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: YOUR GOAL */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Target className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Step 2 — Your Primary Goal</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Start a business',
                  'Expand business',
                  'Buy equipment',
                  'Agriculture',
                  'Service business',
                  'Education',
                  'Skill development',
                  'Other'
                ].map(goalOpt => (
                  <button
                    key={goalOpt}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: goalOpt })}
                    className={`p-3 rounded-md border text-xs font-semibold text-left transition-all ${
                      formData.goal === goalOpt
                        ? 'bg-emerald-50/60 border-emerald-700 text-emerald-950 ring-1 ring-emerald-700/30 shadow-xs'
                        : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {goalOpt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: FINANCIAL PROFILE */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <IndianRupee className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Step 3 — Financial Profile</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Household Income (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.income}
                    onChange={e => setFormData({ ...formData, income: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ₹{(formData.income / 100000).toFixed(2)} Lakh per year
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Family Expenses (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyExpenses}
                    onChange={e => setFormData({ ...formData, monthlyExpenses: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Existing Active Loans?
                  </label>
                  <select
                    value={formData.existingLoans ? 'yes' : 'no'}
                    onChange={e => setFormData({ ...formData, existingLoans: e.target.value === 'yes' })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  >
                    <option value="no">No existing loans</option>
                    <option value="yes">Yes, have existing loans</option>
                  </select>
                </div>

                {formData.existingLoans && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Monthly Total EMI (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.existingEMI}
                      onChange={e => setFormData({ ...formData, existingEMI: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: PROJECT DETAILS */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Step 4 — Project & Funding Requirements</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Type</label>
                  <input
                    type="text"
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    placeholder="e.g. Tailoring, Dairy, Agro Machinery"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trade Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Estimated Project Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.projectCost}
                    onChange={e => {
                      const cost = Number(e.target.value);
                      const own = Math.round(cost * 0.2);
                      setFormData({
                        ...formData,
                        projectCost: cost,
                        ownContribution: own,
                        loanRequirement: cost - own
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Loan Requirement (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.loanRequirement}
                    onChange={e => setFormData({ ...formData, loanRequirement: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Own Contribution / Margin Money (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.ownContribution}
                    onChange={e => setFormData({ ...formData, ownContribution: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Monthly Business Revenue (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.expectedBusinessIncome}
                    onChange={e => setFormData({ ...formData, expectedBusinessIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: LOCATION */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Step 5 — Your Location</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <select
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  >
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Punjab">Punjab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={e => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-md border border-blue-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-blue-600" />
                    <span>Use My Current GPS Location</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Navigation Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-all shadow-xs flex items-center gap-2"
          >
            <span>{step === totalSteps ? 'Complete Profile' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
