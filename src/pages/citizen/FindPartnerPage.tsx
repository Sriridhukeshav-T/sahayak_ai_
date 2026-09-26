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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {t('Find a Partner')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('Geo-spatial router avoids congested bank branches.')}
          </p>
        </div>

        {/* Selected Partner Status Box */}
        {activePartner && (
          <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs border border-slate-200">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">Selected Partner</span>
              <span className="text-xs font-semibold text-slate-900 block truncate max-w-[200px]">{activePartner.name}</span>
            </div>
            <button
              onClick={() => navigate('/apply')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md shadow-xs transition-colors flex items-center gap-1"
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
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              selectedType === type
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
            }`}
          >
            {type === 'ALL' ? 'All Partner Categories' : type}
          </button>
        ))}
      </div>

      {/* Main Layout: Map on top/left, Cards on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map Container (7 cols) */}
        <div className="lg:col-span-7 bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-800" />
              <span className="text-xs font-semibold text-slate-900">
                District Network — {user.district}, {user.state}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Showing {rankedPartners.length} partner branches
            </span>
          </div>

          <div className="flex-1 w-full rounded-md overflow-hidden border border-slate-200">
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
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Suitability Ranking (Top to Bottom)
            </span>
            <span className="text-[11px] text-emerald-800 font-semibold">
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
