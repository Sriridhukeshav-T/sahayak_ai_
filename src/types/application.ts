export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DOCUMENT_CHECK'
  | 'FORWARDED_TO_PARTNER'
  | 'PARTNER_REVIEW'
  | 'SANCTIONED'
  | 'DISBURSED'
  | 'REJECTED';

export interface ApplicationTimelineItem {
  status: ApplicationStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
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
  submittedAt: string;
  updatedAt: string;
  documents: { name: string; status: 'Verified' | 'Pending' | 'Uploaded' }[];
  timeline: ApplicationTimelineItem[];
  remarks?: string;
  demoData?: boolean;
}
