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

export interface Scheme {
  id: string;
  code: string;
  name: string;
  category: SchemeCategory;
  description: string;
  minIncome: number;
  maxIncome: number;
  minLoan: number;
  maxLoan: number;
  interestRate: number; // e.g. 5.5%
  tenureMonths: number;
  moratoriumMonths: number;
  projectTypes: string[];
  educationEligible: boolean;
  businessEligible: boolean;
  supportedStates: string[]; // ['ALL'] or specific states
  requiredDocuments: string[];
  partnerTypes: string[];
  eligibilityRules: string[];
  sourceType: 'demo' | 'verified_reference';
  verified: boolean;
  subsidyPercentage?: number;
  illustrativeMarginMoney?: number;
  featured?: boolean;
}
