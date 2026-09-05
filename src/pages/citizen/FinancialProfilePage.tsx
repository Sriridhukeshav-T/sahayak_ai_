import React, { useState } from 'react';
import {
  User,
  IndianRupee,
  Briefcase,
  MapPin,
  Save,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DemoBadge } from '../../components/common/DemoBadge';

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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Financial Profile
            </h1>
            <DemoBadge />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain accurate socio-economic and project details for optimal scheme matching scores.
          </p>
        </div>

        {isSaved && (
          <div className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved & Matches Updated!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Personal & Demographic */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Personal & Socio-Economic Particulars</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mobile Number</label>
              <input
                type="text"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
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
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Financial Baseline & Cashflow</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Annual Household Income (₹)</label>
              <input
                type="number"
                value={formData.income}
                onChange={e => setFormData({ ...formData, income: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Monthly Household Expenses (₹)</label>
              <input
                type="number"
                value={formData.monthlyExpenses}
                onChange={e => setFormData({ ...formData, monthlyExpenses: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Existing Institutional Loans?</label>
              <select
                value={formData.existingLoans ? 'yes' : 'no'}
                onChange={e => setFormData({ ...formData, existingLoans: e.target.value === 'yes' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="no">No Existing Loans</option>
                <option value="yes">Yes, Active Loans</option>
              </select>
            </div>
            {formData.existingLoans && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Current Monthly EMI Total (₹)</label>
                <input
                  type="number"
                  value={formData.existingEMI}
                  onChange={e => setFormData({ ...formData, existingEMI: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono text-amber-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Project & Enterprise Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Enterprise & Business Plan</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Project Trade</label>
              <input
                type="text"
                value={formData.projectType}
                onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Total Project Cost (₹)</label>
              <input
                type="number"
                value={formData.projectCost}
                onChange={e => setFormData({ ...formData, projectCost: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Promoter Margin (₹)</label>
              <input
                type="number"
                value={formData.ownContribution}
                onChange={e => setFormData({ ...formData, ownContribution: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono text-blue-700"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Expected Monthly Business Net Revenue (₹)</label>
              <input
                type="number"
                value={formData.expectedBusinessIncome}
                onChange={e => setFormData({ ...formData, expectedBusinessIncome: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono text-teal-700"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Industry Experience (Years)</label>
              <input
                type="number"
                value={formData.experienceYears}
                onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Geographic Location */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-900">Geographic Routing Coordinates</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">PIN Code</label>
              <input
                type="text"
                value={formData.pinCode}
                onChange={e => setFormData({ ...formData, pinCode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Recalculate Matches</span>
          </button>
        </div>

      </form>

    </div>
  );
};
