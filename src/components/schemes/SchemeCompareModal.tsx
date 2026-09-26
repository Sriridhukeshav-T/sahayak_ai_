import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Award, Zap } from 'lucide-react';
import { Scheme } from '../../types/scheme';
import { calculateEMI } from '../../services/affordabilityService';
import { useAppData } from '../../context/AppDataContext';

interface SchemeCompareModalProps {
  schemes: Scheme[];
  onClose: () => void;
  onRemoveScheme: (id: string) => void;
}

export const SchemeCompareModal: React.FC<SchemeCompareModalProps> = ({
  schemes,
  onClose,
  onRemoveScheme
}) => {
  const navigate = useNavigate();
  const { setActiveSchemeId } = useAppData();

  if (schemes.length === 0) return null;

  // Find highlights
  const lowestInterestScheme = [...schemes].sort((a, b) => a.interestRate - b.interestRate)[0];
  const highestLoanScheme = [...schemes].sort((a, b) => b.maxLoan - a.maxLoan)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-5xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-800 text-slate-300 border border-slate-700">
                Scheme Comparison Matrix
              </span>
              <span className="text-xs text-slate-400 font-mono">({schemes.length}/3 schemes)</span>
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1">
              Side-by-Side Scheme Comparison
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-sm text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table Container */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          <table className="w-full border-collapse text-left text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-3 text-slate-500 font-semibold uppercase text-[10px] tracking-wider w-40">
                  Feature / Parameter
                </th>
                {schemes.map(s => {
                  const isLowestInterest = s.id === lowestInterestScheme.id;
                  const isHighestCap = s.id === highestLoanScheme.id;

                  return (
                    <th key={s.id} className="py-3 px-3 w-1/3 align-top font-normal">
                      <div className="bg-slate-50 p-3 rounded-md border border-slate-200 relative">
                        <button
                          onClick={() => onRemoveScheme(s.id)}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 rounded-sm"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex flex-wrap gap-1 mb-1">
                          {isLowestInterest && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" /> Lowest Interest
                            </span>
                          )}
                          {isHighestCap && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
                              <Award className="w-2.5 h-2.5" /> Highest Limit
                            </span>
                          )}
                        </div>

                        <p className="font-semibold text-slate-900 text-xs line-clamp-2 mt-1">
                          {s.name}
                        </p>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          {s.category}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-3 font-semibold text-slate-600 bg-slate-50/50">Maximum Loan Limit</td>
                {schemes.map(s => (
                  <td key={s.id} className="py-3 px-3 font-bold text-slate-900 text-sm font-mono">
                    ₹{(s.maxLoan / 100000).toFixed(1)} Lakh
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-semibold text-slate-600 bg-slate-50/50">Concessional Interest Rate</td>
                {schemes.map(s => (
                  <td key={s.id} className="py-3 px-3 font-bold text-emerald-800 text-sm font-mono">
                    {s.interestRate}% p.a.
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-semibold text-slate-600 bg-slate-50/50">Estimated EMI (~80% cap)</td>
                {schemes.map(s => {
                  const emi = calculateEMI(s.maxLoan * 0.8, s.interestRate, s.tenureMonths);
                  return (
                    <td key={s.id} className="py-3 px-3 font-semibold text-slate-900 font-mono">
                      ₹{emi.toLocaleString('en-IN')}/mo
                      <span className="block text-[10px] font-normal text-slate-400 font-sans">for {s.tenureMonths} mos</span>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="py-3 px-3 font-semibold text-slate-600 bg-slate-50/50">Moratorium (Repayment Holiday)</td>
                {schemes.map(s => (
                  <td key={s.id} className="py-3 px-3 font-medium text-slate-800">
                    {s.moratoriumMonths} Months
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-semibold text-slate-600 bg-slate-50/50">Annual Income Ceiling</td>
                {schemes.map(s => (
                  <td key={s.id} className="py-3 px-3 text-slate-700 font-mono">
                    Up to ₹{(s.maxIncome / 100000).toFixed(1)} Lakh
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-semibold text-slate-600 bg-slate-50/50">Capital Subsidy / Support</td>
                {schemes.map(s => (
                  <td key={s.id} className="py-3 px-3 text-slate-700">
                    {s.subsidyPercentage ? `${s.subsidyPercentage}% Margin Money Subsidy` : 'Direct Credit Guarantee'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-semibold text-slate-600 bg-slate-50/50">Required Documents</td>
                {schemes.map(s => (
                  <td key={s.id} className="py-3 px-3 space-y-1">
                    {s.requiredDocuments.map((doc, idx) => (
                      <span key={idx} className="block text-[11px] text-slate-600">
                        • {doc}
                      </span>
                    ))}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-semibold text-slate-600 bg-slate-50/50">Authorized Partner Types</td>
                {schemes.map(s => (
                  <td key={s.id} className="py-3 px-3 text-slate-600">
                    {s.partnerTypes.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Application Call to Action Row */}
              <tr>
                <td className="py-4 px-3 bg-slate-50/50 font-semibold text-slate-700">Action</td>
                {schemes.map(s => (
                  <td key={s.id} className="py-4 px-3">
                    <button
                      onClick={() => {
                        setActiveSchemeId(s.id);
                        onClose();
                        navigate(`/apply?schemeId=${s.id}`);
                      }}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
