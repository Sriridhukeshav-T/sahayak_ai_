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

export type NotificationType =
  | 'SCHEME_OPENED'
  | 'SCHEME_DEADLINE_APPROACHING'
  | 'SCHEME_EXPIRED'
  | 'SCHEME_UPDATED'
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_STATUS_CHANGED'
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_REJECTED'
  | 'WAITING_PERIOD_STARTED'
  | 'WAITING_PERIOD_ENDING'
  | 'WAITING_PERIOD_COMPLETED'
  | 'info'
  | 'success'
  | 'warning'
  | 'alert';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface AppNotification {
  id: string;
  notificationId?: string;
  idempotencyKey?: string; // Key for deduplication: userId + schemeId + type + dateKey
  userId?: string;
  schemeId?: string;
  applicationId?: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  timestamp: string;
  createdAt?: string;
  readAt?: string;
  read: boolean;
  actionLink?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
}
