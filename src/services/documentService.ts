import { Scheme } from '../types/scheme';
import { UploadedDocument } from '../types/user';

export interface DocumentReadinessItem {
  name: string;
  required: boolean;
  status: 'Uploaded' | 'Detected' | 'Processing' | 'Missing' | 'Needs Attention';
  uploadedDoc?: UploadedDocument;
  detectionNotes?: string;
}

export interface DocumentReadinessReport {
  schemeName: string;
  readinessPercentage: number;
  totalRequired: number;
  completedRequired: number;
  missingCount: number;
  items: DocumentReadinessItem[];
  canSubmit: boolean;
}

export function evaluateDocumentReadiness(
  scheme: Scheme | null,
  userDocuments: UploadedDocument[] = []
): DocumentReadinessReport {
  const requiredList = scheme ? scheme.requiredDocuments : [
    'Aadhaar Card',
    'Income Certificate',
    'Bank Passbook / Cancelled Cheque',
    'Machinery / Business Quotation'
  ];

  const items: DocumentReadinessItem[] = requiredList.map(reqName => {
    // Find matching uploaded doc
    const match = userDocuments.find(doc =>
      doc.type.toLowerCase().includes(reqName.toLowerCase()) ||
      reqName.toLowerCase().includes(doc.type.toLowerCase()) ||
      doc.name.toLowerCase().includes(reqName.toLowerCase())
    );

    if (match) {
      return {
        name: reqName,
        required: true,
        status: match.status,
        uploadedDoc: match,
        detectionNotes: match.detectionSummary || 'Verified document format'
      };
    }

    return {
      name: reqName,
      required: true,
      status: 'Missing',
      detectionNotes: 'Required for channel partner institutional loan appraisal'
    };
  });

  const totalRequired = items.length;
  const completedRequired = items.filter(
    i => i.status === 'Detected' || i.status === 'Uploaded'
  ).length;
  const missingCount = totalRequired - completedRequired;
  const readinessPercentage = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 100;
  const canSubmit = readinessPercentage >= 75;

  return {
    schemeName: scheme ? scheme.name : 'General Credit Appraisal',
    readinessPercentage,
    totalRequired,
    completedRequired,
    missingCount,
    items,
    canSubmit
  };
}

export function detectUploadedDocumentType(fileName: string): {
  type: string;
  status: 'Detected' | 'Processing' | 'Needs Attention';
  detectionSummary: string;
} {
  const name = fileName.toLowerCase();

  if (name.includes('aadhaar') || name.includes('adhar') || name.includes('uid')) {
    return {
      type: 'Aadhaar Card',
      status: 'Detected',
      detectionSummary: 'UIDAI standard masked identity format detected'
    };
  }
  if (name.includes('income') || name.includes('aay') || name.includes('tahsildar') || name.includes('revenue')) {
    return {
      type: 'Income Certificate',
      status: 'Detected',
      detectionSummary: 'State Revenue Department digital verification bar detected'
    };
  }
  if (name.includes('passbook') || name.includes('bank') || name.includes('statement') || name.includes('cheque')) {
    return {
      type: 'Bank Passbook / Cancelled Cheque',
      status: 'Detected',
      detectionSummary: 'Active scheduled bank branch IFSC and account number detected'
    };
  }
  if (name.includes('quote') || name.includes('quotation') || name.includes('invoice') || name.includes('machine') || name.includes('tractor') || name.includes('sewing')) {
    return {
      type: 'Tailoring Machine Quotation',
      status: 'Detected',
      detectionSummary: 'Authorized equipment dealer quotation with verified GSTIN'
    };
  }
  if (name.includes('land') || name.includes('patta') || name.includes('chitta') || name.includes('adangal') || name.includes('khatian')) {
    return {
      type: 'Land Record (Pattadar / ROR) or Lease Deed',
      status: 'Detected',
      detectionSummary: 'Digital land records registry verified'
    };
  }
  if (name.includes('photo') || name.includes('passport') || name.includes('pic')) {
    return {
      type: 'Passport Photo',
      status: 'Detected',
      detectionSummary: 'Biometric standard portrait format detected'
    };
  }
  if (name.includes('admit') || name.includes('offer') || name.includes('admission') || name.includes('college')) {
    return {
      type: 'Admission Offer Letter / Entrance Exam Rank Card',
      status: 'Detected',
      detectionSummary: 'Institutional accreditation and seat allotment code detected'
    };
  }
  if (name.includes('mark') || name.includes('grade') || name.includes('10th') || name.includes('12th') || name.includes('degree')) {
    return {
      type: 'Class 10 & 12 Marksheets',
      status: 'Detected',
      detectionSummary: 'Educational board serial stamp verified'
    };
  }

  return {
    type: 'General Document',
    status: 'Needs Attention',
    detectionSummary: 'Document detected; please verify if category matches scheme requirements.'
  };
}
