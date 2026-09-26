export type ApplicationStatus =
  | 'NOT_STARTED'
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_INFORMATION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'DOCUMENT_CHECK'
  | 'FORWARDED_TO_PARTNER'
  | 'PARTNER_REVIEW'
  | 'SANCTIONED'
  | 'DISBURSED';

export type StatusOrigin = 'USER_REPORTED' | 'OFFICIAL_INTEGRATION';

export type WaitingPeriodStatus =
  | 'WAITING_PERIOD'
  | 'WAITING_PERIOD_ENDING'
  | 'WAITING_PERIOD_COMPLETED'
  | 'NOT_APPLICABLE';

export interface ApplicationTimelineItem {
  status: ApplicationStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  statusOrigin?: StatusOrigin;
}

export interface Application {
  id: string; // e.g. SAH-2026-89412
  userId: string;
  applicantName: string;
  applicantMobile: string;
  applicantState: string;
  applicantDistrict: string;
  schemeId: string;
  schemeName: string;
  schemeCategory: string;
  partnerId: string;
  partnerName: string;
  partnerType: string;
  partnerBranch: string;
  projectType: string;
  projectCost: number;
  ownContribution: number;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  estimatedEMI: number;
  matchScore: number;
  status: ApplicationStatus;
  statusOrigin: StatusOrigin; // Clearly marks user-entered vs official integration
  officialApplicationRefNumber?: string;
  officialPortalUrl?: string;
  submittedAt: string;
  updatedAt: string;

  // Waiting period and decision tracking
  waitingPeriodStart?: string;
  expectedDecisionDate?: string;
  waitingPeriodEnd?: string;
  waitingPeriodStatus?: WaitingPeriodStatus;

  documents: { name: string; status: 'Verified' | 'Pending' | 'Uploaded' }[];
  timeline: ApplicationTimelineItem[];
  remarks?: string;
  demoData?: boolean;
}
