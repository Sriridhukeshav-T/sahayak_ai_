import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Award,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { rankPartnersForUser, getCoordinatesForUser } from '../../services/partnerRoutingService';
import { useLanguage } from '../../context/LanguageContext';
import { PartnerMap } from '../../components/partners/PartnerMap';
import { PartnerCard } from '../../components/partners/PartnerCard';
import { PartnerType } from '../../types/partner';
import { DemoBadge } from '../../components/common/DemoBadge';

const PARTNER_TYPES: (PartnerType | 'ALL')[] = [
  'ALL',
  'State Channelizing Agency',
  'Public Sector Bank',
  'Regional Rural Bank',
  'NBFC-MFI'
];

export const FindPartnerPage: React.FC = () => {
  const { user } = useAuth();
  const { partners, activeScheme, activePartner, setActivePartnerId } = useAppData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<PartnerType | 'ALL'>('ALL');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(activePartner?.id || partners[0]?.id || '');

  const userCoords = getCoordinatesForUser(user);

  // Dynamic ranking based on 5 factors
  const rankedPartners = useMemo(() => {
    const allRanked = rankPartnersForUser(user, activeScheme, partners);
    if (selectedType === 'ALL') return allRanked;
    return allRanked.filter(p => p.partner.partnerType === selectedType);
  }, [user, activeScheme, partners, selectedType]);

  const handleSelectPartner = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setActivePartnerId(partnerId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('Find a Partner')}
            </h1>
            <DemoBadge />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('Geo-spatial router avoids congested bank branches.')}
          </p>
        </div>

        {/* Selected Partner Status Box */}
        {activePartner && (
          <div className="bg-white p-3 rounded-2xl border border-blue-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Selected Partner:</span>
              <span className="text-xs font-bold text-slate-900 block truncate max-w-[200px]">{activePartner.name}</span>
            </div>
            <button
              onClick={() => navigate('/apply')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <span>Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PARTNER_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === type
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {type === 'ALL' ? 'All Partner Categories' : type}
          </button>
        ))}
      </div>

      {/* Main Layout: Map on top/left, Cards on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map Container (7 cols) */}
        <div className="lg:col-span-7 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 px-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">
                Geo-Spatial Map — {user.district}, {user.state}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Showing {rankedPartners.length} partner branches
            </span>
          </div>

          <div className="flex-1 w-full rounded-2xl overflow-hidden">
            <PartnerMap
              userLocation={{
                lat: userCoords.lat,
                lon: userCoords.lon,
                label: `${user.name} (${user.district})`
              }}
              partnersWithSuitability={rankedPartners}
              selectedPartnerId={selectedPartnerId}
              onSelectPartner={p => handleSelectPartner(p.id)}
            />
          </div>
        </div>

        {/* Ranked Partner Cards List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[520px]">
          <div className="pb-3 px-1 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Suitability Ranking (Top to Bottom)
            </span>
            <span className="text-[11px] text-blue-700 font-semibold">
              5-Factor Score
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {rankedPartners.map(({ partner, suitability }) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                suitability={suitability}
                isSelected={selectedPartnerId === partner.id}
                onSelect={() => handleSelectPartner(partner.id)}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
