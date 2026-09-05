import { ChannelPartner } from '../types/partner';
import { Scheme } from '../types/scheme';
import { UserProfile } from '../types/user';
import { PartnerMatchResult, PartnerSuitabilityBreakdown } from '../types/common';

// Haversine formula to compute great-circle distance between two coordinates in km
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return parseFloat(d.toFixed(1));
}

// Coordinate fallbacks for Indian States/Districts if user lat/lon not explicitly set
const DISTRICT_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Palakkad': { lat: 10.7867, lon: 76.6548 },
  'Ernakulam': { lat: 9.9816, lon: 76.2999 },
  'Thrissur': { lat: 10.5276, lon: 76.2144 },
  'Thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
  'Kozhikode': { lat: 11.2588, lon: 75.7804 },
  'Thanjavur': { lat: 10.7870, lon: 79.1378 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Coimbatore': { lat: 11.0168, lon: 76.9558 },
  'Madurai': { lat: 9.9252, lon: 78.1198 },
  'Mysuru': { lat: 12.2958, lon: 76.6394 },
  'Bengaluru Urban': { lat: 12.9716, lon: 77.5946 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Mumbai Suburban': { lat: 19.0760, lon: 72.8777 },
  'Lucknow': { lat: 26.8467, lon: 80.9462 },
  'Varanasi': { lat: 25.3176, lon: 82.9739 },
  'Moradabad': { lat: 28.8386, lon: 78.7733 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Vijayawada': { lat: 16.5062, lon: 80.6480 },
  'Patna': { lat: 25.5941, lon: 85.1376 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Jaipur': { lat: 26.9124, lon: 75.7873 }
};

export function getCoordinatesForUser(user: UserProfile): { lat: number; lon: number } {
  if (user.latitude && user.longitude) {
    return { lat: user.latitude, lon: user.longitude };
  }
  if (DISTRICT_COORDINATES[user.district]) {
    return DISTRICT_COORDINATES[user.district];
  }
  return { lat: 10.7867, lon: 76.6548 }; // Default Palakkad
}

export function calculatePartnerSuitability(
  user: UserProfile,
  scheme: Scheme | null,
  partner: ChannelPartner
): PartnerSuitabilityBreakdown {
  const userCoords = getCoordinatesForUser(user);
  const distanceKm = calculateHaversineDistanceKm(
    userCoords.lat,
    userCoords.lon,
    partner.latitude,
    partner.longitude
  );

  // 1. Scheme Compatibility (Max 30 pts)
  let schemeCompatibilityScore = 0;
  if (!scheme) {
    schemeCompatibilityScore = 24;
  } else if (partner.supportedSchemes.includes('*') || partner.supportedSchemes.includes(scheme.id)) {
    schemeCompatibilityScore = 30;
  } else if (scheme.partnerTypes.includes(partner.partnerType)) {
    schemeCompatibilityScore = 18;
  } else {
    schemeCompatibilityScore = 5;
  }

  // 2. Distance Score (Max 20 pts)
  let distanceScore = 0;
  if (distanceKm <= 5) distanceScore = 20;
  else if (distanceKm <= 15) distanceScore = 16;
  else if (distanceKm <= 35) distanceScore = 12;
  else if (distanceKm <= 75) distanceScore = 8;
  else distanceScore = 4;

  // 3. Current Capacity (Max 20 pts)
  const capacityScore = Math.min(20, Math.round((partner.capacity / 100) * 20));

  // 4. Application Load Score (Max 15 pts)
  const loadRatio = partner.capacity > 0 ? partner.currentLoad / partner.capacity : 1;
  let loadScore = 0;
  if (loadRatio < 0.50) loadScore = 15;
  else if (loadRatio < 0.75) loadScore = 11;
  else if (loadRatio < 0.85) loadScore = 7;
  else loadScore = 3; // Severe bottleneck!

  // 5. Processing Efficiency Score (Max 15 pts)
  let processingScore = 0;
  if (partner.processingDays <= 7) processingScore = 15;
  else if (partner.processingDays <= 12) processingScore = 12;
  else if (partner.processingDays <= 16) processingScore = 9;
  else processingScore = 5;

  let totalScore = schemeCompatibilityScore + distanceScore + capacityScore + loadScore + processingScore;

  // If partner is marked unavailable in admin dashboard, severely penalize
  if (!partner.available) {
    totalScore = Math.min(totalScore, 20);
  }

  let reason = '';
  if (totalScore >= 80) {
    reason = `Supports ${scheme ? scheme.name.slice(0, 30) + '...' : 'selected scheme'}, is ${distanceKm} km away, and operates with healthy ${Math.round((1 - loadRatio) * 100)}% spare processing capacity.`;
  } else if (loadRatio >= 0.85) {
    reason = `Located nearby (${distanceKm} km), but currently experiencing severe application backlog (${Math.round(loadRatio * 100)}% loaded).`;
  } else {
    reason = `Located ${distanceKm} km away with standard ${partner.processingDays}-day average turnaround.`;
  }

  return {
    schemeCompatibilityScore,
    distanceScore,
    capacityScore,
    loadScore,
    processingScore,
    totalScore,
    distanceKm,
    reason,
    isRecommended: false
  };
}

export function rankPartnersForUser(
  user: UserProfile,
  scheme: Scheme | null,
  partners: ChannelPartner[]
): PartnerMatchResult[] {
  const scored = partners.map(partner => ({
    partner,
    suitability: calculatePartnerSuitability(user, scheme, partner)
  }));

  // Sort descending by total suitability score
  scored.sort((a, b) => b.suitability.totalScore - a.suitability.totalScore);

  // Find nearest partner by physical distance
  const byDistance = [...scored].sort((a, b) => a.suitability.distanceKm - b.suitability.distanceKm);
  const nearest = byDistance[0];

  if (scored.length > 0) {
    scored[0].suitability.isRecommended = true;

    // Check if dynamic rerouting occurred (i.e. if ranked #1 is not the physically closest partner)
    if (nearest && scored[0].partner.id !== nearest.partner.id) {
      scored[0].suitability.reroutedFromNearest = true;
      scored[0].suitability.rerouteReason = `Your physically nearest partner (${nearest.partner.name}, ${nearest.suitability.distanceKm} km) currently has high application backlog or longer turnaround. We routed you to ${scored[0].partner.name} for significantly faster sanctioning.`;
    }
  }

  return scored;
}
