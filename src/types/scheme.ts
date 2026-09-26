export type SchemeCategory =
  | 'Micro Enterprise'
  | 'Small Business'
  | 'Agriculture & Allied'
  | 'Artisan & Handloom'
  | 'Education & Skill'
  | 'Women Entrepreneurship'
  | 'Green & Renewable'
  | 'Service Sector'
  | 'Term Loan';

export type VerificationStatus = 'VERIFIED' | 'NEEDS_VERIFICATION' | 'NEEDS_REVIEW';

export type SchemeStatus =
  | 'OPEN'
  | 'CLOSING_SOON'
  | 'APPLICATION_WINDOW_CLOSED'
  | 'ONGOING'
  | 'EXPIRED';

export interface StructuredEligibilityRule {
  field: 'age' | 'income' | 'state' | 'gender' | 'category' | 'occupation' | 'education' | 'landHoldingAcres' | 'existingLoans';
  operator: '>=' | '<=' | '==' | 'in' | 'not_in' | 'boolean_true' | 'boolean_false' | 'custom';
  value: any;
  label: string;
  mandatory: boolean;
}

export interface SchemeBenefits {
  summary: string;
  // All financial/credit fields are strictly optional to support non-loan schemes
  subsidyPercentage?: number;
  maxSubsidyAmount?: number;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  interestRateAnnual?: number;
  interestSubventionPercent?: number;
  moratoriumMonths?: number;
  tenureMonths?: number;
  financialAssistanceDetails?: string;
  nonFinancialBenefits?: string[];
}

export interface FieldVerificationStatus {
  officialName: boolean;
  ministry: boolean;
  department: boolean;
  description: boolean;
  benefits: boolean;
  eligibility: boolean;
  documents: boolean;
  applicationUrl: boolean;
  applicationDates: boolean;
}

export interface Scheme {
  id: string; // Identifier e.g. SCH-PMEGP-001
  schemeId: string; // Alias matching id
  code: string;
  name: string; // Display name
  officialName: string;
  shortName: string;
  category: SchemeCategory | string;
  governmentDepartment: string;
  ministry: string;
  state: string; // 'Central' or specific state e.g. 'Tamil Nadu'
  description: string;
  benefits: SchemeBenefits;
  structuredEligibility: StructuredEligibilityRule[];
  eligibilityRules: string[];
  requiredDocuments: string[];
  applicationProcess: string[];

  // Time dimensions
  applicationStartDate: string | null;
  applicationEndDate: string | null;
  schemeExpiryDate: string | null;
  isOngoing: boolean;

  // Processing period (strictly without invented numbers)
  processingPeriod: string;
  processingPeriodDays: number | null;

  renewalPeriod: string;
  officialWebsite: string;
  officialApplicationUrl: string;
  sourceUrl: string;
  sourceName: string;

  // Verification & Status decoupling
  verificationStatus: VerificationStatus;
  schemeStatus: SchemeStatus;
  fieldVerificationStatus: FieldVerificationStatus;
  lastVerifiedAt: string;
  lastUpdatedAt: string;
  version: string;

  // Standard properties for calculator & matcher compatibility
  minIncome: number;
  maxIncome: number;
  minLoan: number;
  maxLoan: number;
  interestRate: number;
  tenureMonths: number;
  moratoriumMonths: number;
  projectTypes: string[];
  supportedStates: string[];
  partnerTypes: string[];
  businessEligible: boolean;
  educationEligible: boolean;
  subsidyPercentage?: number;
  illustrativeMarginMoney?: number;
  featured?: boolean;
  verified?: boolean;
  sourceType?: 'demo' | 'verified_reference';
}
