export interface UploadedDocument {
  id: string;
  name: string;
  type: string; // 'Aadhaar', 'PAN', 'Income Certificate', etc.
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Uploaded' | 'Processing' | 'Detected' | 'Needs Attention';
  detectionSummary?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'Minority' | 'EWS';
  state: string;
  district: string;
  pinCode: string;
  income: number; // annual family income
  monthlyExpenses: number;
  existingLoans: boolean;
  existingEMI: number;
  goal: string; // 'Start a business' | 'Expand business' | 'Agriculture' | etc.
  projectType: string; // e.g. 'Tailoring', 'Poultry', 'Food Processing'
  purpose: string;
  projectCost: number;
  loanRequirement: number;
  ownContribution: number;
  expectedBusinessIncome: number;
  experienceYears: number;
  preferredLanguage: 'en' | 'ml' | 'ta' | 'hi';
  educationStatus: 'Below 10th' | '10th Pass' | '12th Pass' | 'Graduate' | 'Post Graduate' | 'Vocational/ITI';
  latitude?: number;
  longitude?: number;
  role: 'citizen' | 'admin';
  uploadedDocuments: UploadedDocument[];
  isDemo?: boolean;
}
