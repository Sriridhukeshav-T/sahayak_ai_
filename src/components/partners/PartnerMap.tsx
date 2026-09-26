import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ChannelPartner } from '../../types/partner';
import { PartnerSuitabilityBreakdown } from '../../types/common';
import { Building2, Navigation, Clock, Users, CheckCircle2 } from 'lucide-react';

// Fix for default Leaflet icon paths in React build
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom colored SVG pin markers
const createCustomPin = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; justify-content: center;">
          <span style="transform: rotate(45deg); font-size: 11px; font-weight: bold; color: white;">${label}</span>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const userPin = L.divIcon({
  className: 'user-marker-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="background: #dc2626; width: 32px; height: 32px; border-radius: 50%; box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.25); border: 3px solid white; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 14px;">📍</span>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20]
});

interface PartnerMapProps {
  userLocation: { lat: number; lon: number; label: string };
  partnersWithSuitability: { partner: ChannelPartner; suitability: PartnerSuitabilityBreakdown }[];
  selectedPartnerId?: string;
  onSelectPartner: (partner: ChannelPartner) => void;
}

// Map center adjustment subcomponent
const ChangeMapView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const PartnerMap: React.FC<PartnerMapProps> = ({
  userLocation,
  partnersWithSuitability,
  selectedPartnerId,
  onSelectPartner
}) => {
  const center: [number, number] = [userLocation.lat, userLocation.lon];

  const getPartnerColor = (type: string) => {
    switch (type) {
      case 'State Channelizing Agency':
        return '#1d4ed8'; // blue
      case 'Public Sector Bank':
        return '#059669'; // emerald
      case 'Regional Rural Bank':
        return '#d97706'; // amber
      case 'NBFC-MFI':
        return '#7c3aed'; // purple
      default:
        return '#475569';
    }
  };

  const getPartnerInitial = (type: string) => {
    switch (type) {
      case 'State Channelizing Agency': return 'S';
      case 'Public Sector Bank': return 'B';
      case 'Regional Rural Bank': return 'R';
      case 'NBFC-MFI': return 'M';
      default: return 'P';
    }
  };

  return (
    <div className="w-full h-full min-h-[420px] rounded-md overflow-hidden shadow-inner border border-slate-200 relative">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeMapView center={center} zoom={12} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Marker */}
        <Marker position={[userLocation.lat, userLocation.lon]} icon={userPin}>
          <Popup>
            <div className="text-xs p-1">
              <p className="font-bold text-slate-900">Your Location</p>
              <p className="text-[11px] text-slate-600">{userLocation.label}</p>
            </div>
          </Popup>
        </Marker>

        {/* Partner Markers */}
        {partnersWithSuitability.map(({ partner, suitability }) => {
          const pinColor = getPartnerColor(partner.partnerType);
          const pinInitial = getPartnerInitial(partner.partnerType);
          const isSelected = selectedPartnerId === partner.id;

          return (
            <Marker
              key={partner.id}
              position={[partner.latitude, partner.longitude]}
              icon={createCustomPin(isSelected ? '#dc2626' : pinColor, pinInitial)}
            >
              <Popup>
                <div className="text-xs p-1 max-w-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-800">
                        {partner.partnerType}
                      </span>
                      <h4 className="font-bold text-slate-900 mt-1 leading-snug">{partner.name}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-blue-700">
                        {suitability.totalScore}/100
                      </span>
                      <span className="block text-[10px] text-slate-400">Score</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">{partner.address}</p>

                  <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 rounded-lg text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px]">Distance</span>
                      <span className="font-bold text-slate-800">{suitability.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">Avg Turnaround</span>
                      <span className="font-bold text-slate-800">{partner.processingDays} Days</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[9px]">
                        Active Load ({partner.currentLoad}/{partner.capacity} capacity)
                      </span>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-0.5">
                        <div
                          className={`h-full rounded-full ${
                            partner.currentLoad / partner.capacity > 0.8 ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (partner.currentLoad / partner.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPartner(partner)}
                    className="w-full py-1.5 px-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
                  >
                    Select This Partner
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Floating Overlay */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-xs p-2.5 rounded-md border border-slate-200 shadow-xs text-[10px] space-y-1 hidden sm:block">
        <p className="font-bold text-slate-700 uppercase tracking-wider mb-1">Partner Types</p>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
          <span>State Channelizing Agency (SCA)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>Public Sector Bank (PSB)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          <span>Regional Rural Bank (RRB)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          <span>NBFC-MFI</span>
        </div>
      </div>
    </div>
  );
};
