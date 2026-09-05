import { Scheme } from './scheme';
import { ChannelPartner } from './partner';

export interface MatchBreakdown {
  incomeScore: number;       // Max 25
  loanScore: number;         // Max 25
  categoryScore: number;     // Max 20
  locationScore: number;     // Max 15
  profileScore: number;      // Max 15
  totalScore: number;        // Max 100
  reasons: string[];
  warnings: string[];
  improvementTips: string[];
  eligibilityStatus: 'Highly Compatible' | 'Compatible' | 'Moderate Match' | 'Not Recommended';
}

export interface SchemeMatchResult {
  scheme: Scheme;
  match: MatchBreakdown;
}

export interface PartnerSuitabilityBreakdown {
  schemeCompatibilityScore: number; // Max 30
  distanceScore: number;            // Max 20
  capacityScore: number;            // Max 20
  loadScore: number;                // Max 15
  processingScore: number;          // Max 15
  totalScore: number;               // Max 100
  distanceKm: number;
  reason: string;
  isRecommended: boolean;
  reroutedFromNearest?: boolean;
  rerouteReason?: string;
}

export interface PartnerMatchResult {
  partner: ChannelPartner;
  suitability: PartnerSuitabilityBreakdown;
}

export interface AffordabilityResult {
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  monthlyDisposableSurplus: number;
  emiToIncomeRatio: number; // percentage e.g. 18.5
  riskTier: 'COMFORTABLE' | 'MANAGEABLE' | 'HIGH_RISK';
  headline: string;
  explanation: string;
  recommendations: string[];
  breakdownChartData: {
    name: string;
    amount: number;
    color: string;
  }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
}
