import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  ShieldCheck
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { Scheme, SchemeCategory } from '../../types/scheme';

export const AdminSchemesPage: React.FC = () => {
  const { schemes, addScheme, updateScheme, deleteScheme } = useAppData();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = schemes.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    const id = `SCH-CUST-${Date.now()}`;
    const newScheme: Scheme = {
      id,
      schemeId: id,
      code: `SCH-NEW-${Date.now().toString().slice(-4)}`,
      name: '',
      officialName: '',
      shortName: '',
      category: 'Micro Enterprise',
      governmentDepartment: 'State Nodal Agency',
      ministry: 'State Government',
      state: 'Central',
      description: '',
      benefits: {
        summary: 'Concessional credit facility',
        minLoanAmount: 30000,
        maxLoanAmount: 200000,
        interestRateAnnual: 4.5,
        moratoriumMonths: 6,
        tenureMonths: 36
      },
      structuredEligibility: [],
      minIncome: 30000,
      maxIncome: 350000,
      minLoan: 30000,
      maxLoan: 200000,
      interestRate: 4.5,
      tenureMonths: 36,
      moratoriumMonths: 6,
      projectTypes: ['Micro Enterprise', 'Retail'],
      educationEligible: false,
      businessEligible: true,
      supportedStates: ['ALL'],
      requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Bank Passbook'],
      partnerTypes: ['State Channelizing Agency', 'Public Sector Bank'],
      eligibilityRules: ['Standard credit verification'],
      applicationProcess: ['Submit application to local DIC or authorized nodal agency'],
      applicationStartDate: null,
      applicationEndDate: null,
      schemeExpiryDate: null,
      isOngoing: true,
      processingPeriod: 'Not specified in the available official source.',
      processingPeriodDays: null,
      renewalPeriod: 'Not specified in the available official source.',
      officialWebsite: '',
      officialApplicationUrl: '',
      sourceUrl: '',
      sourceName: 'User Entry',
      verificationStatus: 'NEEDS_VERIFICATION',
      schemeStatus: 'OPEN',
      fieldVerificationStatus: {
        officialName: false,
        ministry: false,
        department: false,
        description: false,
        benefits: false,
        eligibility: false,
        documents: false,
        applicationUrl: false,
        applicationDates: false
      },
      lastVerifiedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      version: '1.0',
      sourceType: 'demo',
      verified: false
    };
    setEditingScheme(newScheme);
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheme) return;

    if (isNew) {
      addScheme(editingScheme);
    } else {
      updateScheme(editingScheme);
    }
    setEditingScheme(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Scheme Registry Management
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
              {schemes.length} Schemes Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Configure eligibility ceilings, interest subventions, and official source parameters.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md shadow-xs transition-all flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Government Scheme</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search schemes by title, sector, code..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:border-emerald-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Schemes Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Scheme Name & Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Max Loan Limit</th>
                <th className="py-3 px-4">Interest Rate</th>
                <th className="py-3 px-4">Moratorium</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 leading-snug">{s.name}</p>
                    <span className="font-mono text-[10px] text-slate-400">{s.id} • {s.code}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{s.category}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹{(s.maxLoan / 100000).toFixed(1)} Lakh
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{s.interestRate}%</td>
                  <td className="py-3.5 px-4">{s.moratoriumMonths} Mos</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => updateScheme({ ...s, verified: !s.verified })}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        s.verified
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                      title="Click to toggle verified badge"
                    >
                      {s.verified ? '✓ Verified Official' : 'Demo Synthetic'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingScheme({ ...s });
                          setIsNew(false);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit scheme"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete scheme "${s.name}"?`)) {
                            deleteScheme(s.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete scheme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Scheme Modal */}
      {editingScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {isNew ? 'Add New Scheme to Catalog' : `Edit Scheme: ${editingScheme.name}`}
              </h3>
              <button onClick={() => setEditingScheme(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scheme Name</label>
                <input
                  type="text"
                  required
                  value={editingScheme.name}
                  onChange={e => setEditingScheme({ ...editingScheme, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={editingScheme.category}
                    onChange={e => setEditingScheme({ ...editingScheme, category: e.target.value as SchemeCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md"
                  >
                    <option value="Micro Enterprise">Micro Enterprise</option>
                    <option value="Small Business">Small Business</option>
                    <option value="Agriculture & Allied">Agriculture & Allied</option>
                    <option value="Artisan & Handloom">Artisan & Handloom</option>
                    <option value="Education & Skill">Education & Skill</option>
                    <option value="Women Entrepreneurship">Women Entrepreneurship</option>
                    <option value="Green & Renewable">Green & Renewable</option>
                    <option value="Service Sector">Service Sector</option>
                    <option value="Term Loan">Term Loan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingScheme.interestRate}
                    onChange={e => setEditingScheme({ ...editingScheme, interestRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingScheme.description}
                  onChange={e => setEditingScheme({ ...editingScheme, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Loan Limit (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingScheme.maxLoan}
                    onChange={e => setEditingScheme({ ...editingScheme, maxLoan: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Annual Income Cap (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingScheme.maxIncome}
                    onChange={e => setEditingScheme({ ...editingScheme, maxIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tenure (Months)</label>
                  <input
                    type="number"
                    required
                    value={editingScheme.tenureMonths}
                    onChange={e => setEditingScheme({ ...editingScheme, tenureMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Moratorium (Months)</label>
                  <input
                    type="number"
                    required
                    value={editingScheme.moratoriumMonths}
                    onChange={e => setEditingScheme({ ...editingScheme, moratoriumMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingScheme.verified}
                    onChange={e => setEditingScheme({ ...editingScheme, verified: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-slate-700">Mark as Verified Government Scheme</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingScheme(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-xs"
                  >
                    Save Scheme
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
