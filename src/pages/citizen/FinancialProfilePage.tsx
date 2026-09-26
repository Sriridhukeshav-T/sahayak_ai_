import React, { useState } from 'react';
import {
  User,
  IndianRupee,
  Briefcase,
  MapPin,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FinancialProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    age: user.age,
    gender: user.gender,
    category: user.category || 'OBC',
    state: user.state,
    district: user.district,
    pinCode: user.pinCode,
    income: user.income,
    monthlyExpenses: user.monthlyExpenses,
    existingLoans: user.existingLoans,
    existingEMI: user.existingEMI,
    projectType: user.projectType,
    goal: user.goal,
    projectCost: user.projectCost,
    ownContribution: user.ownContribution,
    expectedBusinessIncome: user.expectedBusinessIncome,
    experienceYears: user.experienceYears,
    preferredLanguage: user.preferredLanguage
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      age: Number(formData.age),
      gender: formData.gender as any,
      category: formData.category as any,
      state: formData.state,
      district: formData.district,
      pinCode: formData.pinCode,
      income: Number(formData.income),
      monthlyExpenses: Number(formData.monthlyExpenses),
      existingLoans: Boolean(formData.existingLoans),
      existingEMI: Number(formData.existingEMI),
      projectType: formData.projectType,
      goal: formData.goal,
      projectCost: Number(formData.projectCost),
      ownContribution: Number(formData.ownContribution),
      loanRequirement: Number(formData.projectCost) - Number(formData.ownContribution),
      expectedBusinessIncome: Number(formData.expectedBusinessIncome),
      experienceYears: Number(formData.experienceYears),
      preferredLanguage: formData.preferredLanguage as any
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Citizen Registry
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Citizen Profile
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Maintain your demographic and business particulars for deterministic scheme matching.
            </p>
          </div>

          {isSaved && (
            <div className="px-3.5 py-1.5 bg-emerald-50 text-[#065F46] border border-emerald-200 text-xs font-semibold rounded flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#065F46]" />
              <span>Profile details saved successfully</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Personal & Demographic */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-[#065F46]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">1. Personal Particulars</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Social Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                >
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Minority">Minority</option>
                  <option value="EWS">EWS</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Information */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <IndianRupee className="w-4 h-4 text-[#065F46]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">2. Financial Baseline</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Annual Household Income (₹)</label>
                <input
                  type="number"
                  value={formData.income}
                  onChange={e => setFormData({ ...formData, income: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Monthly Household Expenses (₹)</label>
                <input
                  type="number"
                  value={formData.monthlyExpenses}
                  onChange={e => setFormData({ ...formData, monthlyExpenses: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Existing Institutional Credit Default?</label>
                <select
                  value={formData.existingLoans ? 'yes' : 'no'}
                  onChange={e => setFormData({ ...formData, existingLoans: e.target.value === 'yes' })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                >
                  <option value="no">No past institutional defaults</option>
                  <option value="yes">Yes, active defaults</option>
                </select>
              </div>
              {formData.existingLoans && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Monthly EMI Total (₹)</label>
                  <input
                    type="number"
                    value={formData.existingEMI}
                    onChange={e => setFormData({ ...formData, existingEMI: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-amber-700 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Enterprise Details */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-[#065F46]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">3. Trade & Enterprise Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Trade / Activity</label>
                <input
                  type="text"
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Total Project Cost (₹)</label>
                <input
                  type="number"
                  value={formData.projectCost}
                  onChange={e => setFormData({ ...formData, projectCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Promoter Margin (₹)</label>
                <input
                  type="number"
                  value={formData.ownContribution}
                  onChange={e => setFormData({ ...formData, ownContribution: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-[#065F46] focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Location */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-[#065F46]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">4. Location & State Domicile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">State / UT</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">PIN Code</label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={e => setFormData({ ...formData, pinCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#065F46]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#065F46] hover:bg-[#064E3B] rounded shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Particulars</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default FinancialProfilePage;
