import React, { useState } from 'react';
import {
  Building2,
  Search,
  Edit2,
  CheckCircle2,
  XCircle,
  X,
  Save,
  Users,
  Clock,
  Navigation
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { ChannelPartner, PartnerType } from '../../types/partner';

export const AdminPartnersPage: React.FC = () => {
  const { partners, updatePartner } = useAppData();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingPartner, setEditingPartner] = useState<ChannelPartner | null>(null);

  const filtered = partners.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.partnerType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;
    updatePartner(editingPartner);
    setEditingPartner(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Channel Partner Network Management
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
              {partners.length} Authorized Partners
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Maintain branch capacities and active load. Real-time updates immediately calibrate routing suitability scores.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search partners by branch name, city, district, state..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:border-emerald-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Partner Name & Branch</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Monthly Capacity</th>
                <th className="py-3 px-4">Active Load</th>
                <th className="py-3 px-4">Turnaround</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Edit</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(p => {
                const loadPct = p.capacity > 0 ? Math.round((p.currentLoad / p.capacity) * 100) : 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 leading-snug">{p.name}</p>
                      <span className="font-mono text-[10px] text-slate-400">{p.id} • {p.branchCode}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{p.partnerType}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-900">{p.district}</span>, {p.state}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{p.capacity} cases</td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`font-bold font-mono ${loadPct >= 80 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {p.currentLoad} ({loadPct}%)
                        </span>
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${loadPct >= 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, loadPct)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{p.processingDays} Days</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => updatePartner({ ...p, available: !p.available })}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                          p.available
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }`}
                        title="Click to toggle availability"
                      >
                        {p.available ? '● Active' : '✕ Disabled'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setEditingPartner({ ...p })}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit partner properties"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Partner Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Update Partner Capacity & Load
              </h3>
              <button onClick={() => setEditingPartner(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Partner Branch Name</label>
                <input
                  type="text"
                  required
                  value={editingPartner.name}
                  onChange={e => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Monthly Capacity (Cases)</label>
                  <input
                    type="number"
                    required
                    value={editingPartner.capacity}
                    onChange={e => setEditingPartner({ ...editingPartner, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Active Backlog Load</label>
                  <input
                    type="number"
                    required
                    value={editingPartner.currentLoad}
                    onChange={e => setEditingPartner({ ...editingPartner, currentLoad: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md font-bold font-mono text-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Avg Turnaround (Days)</label>
                  <input
                    type="number"
                    required
                    value={editingPartner.processingDays}
                    onChange={e => setEditingPartner({ ...editingPartner, processingDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={editingPartner.available ? 'yes' : 'no'}
                    onChange={e => setEditingPartner({ ...editingPartner, available: e.target.value === 'yes' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md"
                  >
                    <option value="yes">Available & Accepting Applications</option>
                    <option value="no">Unavailable / Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-xs"
                >
                  Save & Update Routing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
