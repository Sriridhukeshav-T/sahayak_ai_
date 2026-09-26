import React from 'react';
import {
  Building2,
  Navigation,
  Clock,
  Users,
  Award,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { ChannelPartner } from '../../types/partner';
import { PartnerSuitabilityBreakdown } from '../../types/common';

interface PartnerCardProps {
  partner: ChannelPartner;
  suitability: PartnerSuitabilityBreakdown;
  isSelected?: boolean;
  onSelect: () => void;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  suitability,
  isSelected = false,
  onSelect
}) => {
  const loadPercentage = partner.capacity > 0 ? Math.round((partner.currentLoad / partner.capacity) * 100) : 0;
  const isHighLoad = loadPercentage >= 80;

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'State Channelizing Agency': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Public Sector Bank': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Regional Rural Bank': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'NBFC-MFI': return 'bg-teal-50 text-teal-800 border-teal-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 sm:p-5 transition-all relative flex flex-col justify-between ${
        isSelected
          ? 'bg-emerald-50/40 border-emerald-700 shadow-xs ring-1 ring-emerald-700/30'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${getTypeBadgeClass(partner.partnerType)}`}>
              {partner.partnerType}
            </span>

            {suitability.isRecommended && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-emerald-800 text-white flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Recommended</span>
              </span>
            )}

            {suitability.reroutedFromNearest && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-700" />
                <span>Rerouted</span>
              </span>
            )}
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900 font-mono">
                {suitability.totalScore}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">/100</span>
            </div>
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-medium">
              Suitability
            </span>
          </div>
        </div>

        {/* Partner Name & Location */}
        <h4 className="font-semibold text-sm sm:text-base text-slate-900 leading-snug">
          {partner.name}
        </h4>
        <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
          <Navigation className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{partner.address}</span>
        </p>

        {/* Dynamic Reroute Explanatory Alert */}
        {suitability.reroutedFromNearest && suitability.rerouteReason && (
          <div className="mt-3 p-2.5 bg-amber-50 rounded-md border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            <p className="font-semibold text-amber-800">Routing Notice:</p>
            <p>{suitability.rerouteReason}</p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-md bg-slate-50 border border-slate-200 mt-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Distance</span>
            <span className="font-semibold text-slate-800">{suitability.distanceKm} km</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Processing Time</span>
            <span className="font-semibold text-slate-800">{partner.processingDays} Days</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-medium">Current Load</span>
            <span className={`font-semibold ${isHighLoad ? 'text-red-700' : 'text-emerald-800'}`}>
              {loadPercentage}% ({partner.currentLoad}/{partner.capacity})
            </span>
          </div>
        </div>

        {/* Load Bar */}
        <div className="mt-2 px-0.5">
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isHighLoad ? 'bg-red-600' : 'bg-emerald-700'
              }`}
              style={{ width: `${Math.min(100, loadPercentage)}%` }}
            />
          </div>
        </div>

        {/* Reason summary */}
        <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-2 rounded-md border border-slate-200">
          {suitability.reason}
        </p>
      </div>

      {/* Select Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 space-y-0.5 hidden sm:block">
          <p className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{partner.contactPhone}</span>
          </p>
          <p className="flex items-center gap-1 truncate max-w-[180px]">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>{partner.contactEmail}</span>
          </p>
        </div>

        <button
          onClick={onSelect}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
            isSelected
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs'
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selected Partner</span>
            </>
          ) : (
            <>
              <span>Select Partner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
