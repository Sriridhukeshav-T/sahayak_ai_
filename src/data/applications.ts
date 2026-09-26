import { Application, ApplicationStatus } from '../types/application';
import { SYNTHETIC_SCHEMES } from './schemes';
import { SYNTHETIC_PARTNERS } from './partners';
import { DEMO_PERSONAS, SYNTHETIC_USERS } from './users';

const STATUS_LIST: ApplicationStatus[] = [
  'SUBMITTED',
  'DOCUMENT_CHECK',
  'FORWARDED_TO_PARTNER',
  'PARTNER_REVIEW',
  'SANCTIONED',
  'DISBURSED',
  'REJECTED'
];

function buildTimeline(status: ApplicationStatus, baseDate: string) {
  const steps: { status: ApplicationStatus; title: string; description: string }[] = [
    { status: 'SUBMITTED', title: 'Application Submitted', description: 'Application received and registered on the Sahayak AI gateway.' },
    { status: 'DOCUMENT_CHECK', title: 'AI Document Readiness Check', description: 'Mandatory certificates, identity documents, and machine quotations reviewed.' },
    { status: 'FORWARDED_TO_PARTNER', title: 'Routed to Channel Partner', description: 'Application dossier forwarded to designated local channel partner.' },
    { status: 'PARTNER_REVIEW', title: 'Channel Partner Appraisal', description: 'Field officer credit appraisal and technical feasibility review in progress.' },
    { status: 'SANCTIONED', title: 'Credit Sanctioned', description: 'Concessional loan sanction letter issued by competent authority.' },
    { status: 'DISBURSED', title: 'Loan Disbursed', description: 'First tranche credited to applicant bank account / equipment dealer escrow.' }
  ];

  const statusIdx = steps.findIndex(s => s.status === status);
  const isRejected = status === 'REJECTED';

  return steps.map((s, idx) => {
    const isPastOrCurrent = isRejected ? (idx <= 2) : (idx <= statusIdx);
    const isCurrent = isRejected ? false : (idx === statusIdx);

    return {
      status: s.status,
      title: s.title,
      description: s.description,
      timestamp: isPastOrCurrent ? new Date(new Date(baseDate).getTime() + idx * 86400000 * 3).toISOString() : '',
      completed: isRejected ? (idx <= 1) : (idx < statusIdx || (idx === statusIdx && status === 'DISBURSED')),
      current: isCurrent
    };
  });
}

function generateSyntheticApplications(): Application[] {
  const applications: Application[] = [];

  // Active demo application for Anjali
  applications.push({
    id: 'SAH-2026-92841',
    userId: DEMO_PERSONAS.anjali.id,
    applicantName: DEMO_PERSONAS.anjali.name,
    applicantMobile: DEMO_PERSONAS.anjali.mobile,
    applicantState: DEMO_PERSONAS.anjali.state,
    applicantDistrict: DEMO_PERSONAS.anjali.district,
    schemeId: 'SCH-MCR-001',
    schemeName: 'National Micro-Credit Assistance for Women Artisans & Tailors',
    schemeCategory: 'Micro Enterprise',
    partnerId: 'PTR-KL-001',
    partnerName: 'Kerala State Backward Classes Development Corporation (KSBCDC)',
    partnerType: 'State Channelizing Agency',
    partnerBranch: 'Palakkad District Office',
    projectType: 'Tailoring & Boutique Workshop',
    projectCost: 150000,
    ownContribution: 30000,
    loanAmount: 120000,
    interestRate: 4.5,
    tenureMonths: 36,
    estimatedEMI: 3570,
    matchScore: 94,
    status: 'PARTNER_REVIEW',
    statusOrigin: 'USER_REPORTED',
    submittedAt: '2026-08-22T09:30:00Z',
    updatedAt: '2026-09-02T14:20:00Z',
    documents: [
      { name: 'Aadhaar Card', status: 'Verified' },
      { name: 'Income Certificate', status: 'Verified' },
      { name: 'Bank Passbook / Cancelled Cheque', status: 'Verified' },
      { name: 'Tailoring Machine Quotation', status: 'Verified' },
      { name: 'Passport Photo', status: 'Verified' }
    ],
    timeline: buildTimeline('PARTNER_REVIEW', '2026-08-22T09:30:00Z'),
    remarks: 'Application vetted by AI Readiness Engine. Field verification scheduled by KSBCDC Palakkad Inspector.',
    demoData: true
  });

  // Application for Ramesh
  applications.push({
    id: 'SAH-2026-81044',
    userId: DEMO_PERSONAS.ramesh.id,
    applicantName: DEMO_PERSONAS.ramesh.name,
    applicantMobile: DEMO_PERSONAS.ramesh.mobile,
    applicantState: DEMO_PERSONAS.ramesh.state,
    applicantDistrict: DEMO_PERSONAS.ramesh.district,
    schemeId: 'SCH-AGR-001',
    schemeName: 'Rural Agro-Machinery & Custom Hiring Service Support Scheme',
    schemeCategory: 'Agriculture & Allied',
    partnerId: 'PTR-TN-001',
    partnerName: 'Tamil Nadu Adi Dravidar Housing and Development Corporation (THADCO)',
    partnerType: 'State Channelizing Agency',
    partnerBranch: 'Thanjavur Collectorate Annex',
    projectType: 'Custom Hiring Centre',
    projectCost: 800000,
    ownContribution: 200000,
    loanAmount: 600000,
    interestRate: 5.0,
    tenureMonths: 60,
    estimatedEMI: 11322,
    matchScore: 92,
    status: 'FORWARDED_TO_PARTNER',
    statusOrigin: 'USER_REPORTED',
    submittedAt: '2026-08-31T11:00:00Z',
    updatedAt: '2026-09-03T16:00:00Z',
    documents: [
      { name: 'Aadhaar Card', status: 'Verified' },
      { name: 'Land Record (Pattadar / ROR) or Lease Deed', status: 'Verified' },
      { name: 'Machinery Quotation from Authorized Dealer', status: 'Verified' }
    ],
    timeline: buildTimeline('FORWARDED_TO_PARTNER', '2026-08-31T11:00:00Z'),
    remarks: 'Forwarded to THADCO Thanjavur District Manager for subsidy entitlement vetting.',
    demoData: true
  });

  // Application for Priya
  applications.push({
    id: 'SAH-2026-73919',
    userId: DEMO_PERSONAS.priya.id,
    applicantName: DEMO_PERSONAS.priya.name,
    applicantMobile: DEMO_PERSONAS.priya.mobile,
    applicantState: DEMO_PERSONAS.priya.state,
    applicantDistrict: DEMO_PERSONAS.priya.district,
    schemeId: 'SCH-EDU-001',
    schemeName: 'National Higher & Technical Education Concessional Loan Scheme',
    schemeCategory: 'Education & Skill',
    partnerId: 'PTR-KA-001',
    partnerName: 'Karnataka Minorities Development Corporation (KMDC)',
    partnerType: 'State Channelizing Agency',
    partnerBranch: 'Mysuru District Office',
    projectType: 'Higher Education M.Tech',
    projectCost: 750000,
    ownContribution: 150000,
    loanAmount: 600000,
    interestRate: 3.5,
    tenureMonths: 84,
    estimatedEMI: 8060,
    matchScore: 96,
    status: 'SANCTIONED',
    statusOrigin: 'USER_REPORTED',
    submittedAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-28T12:00:00Z',
    documents: [
      { name: 'Aadhaar Card', status: 'Verified' },
      { name: 'Admission Offer Letter / Entrance Exam Rank Card', status: 'Verified' },
      { name: 'Class 10 & 12 Marksheets', status: 'Verified' }
    ],
    timeline: buildTimeline('SANCTIONED', '2026-08-10T10:00:00Z'),
    remarks: 'Sanction letter generated. Moratorium active for course duration plus 1 year.',
    demoData: true
  });

  // Generate 210 additional applications across all statuses and schemes for rich admin analytics
  for (let i = 4; i <= 215; i++) {
    const user = SYNTHETIC_USERS[(i * 3) % SYNTHETIC_USERS.length];
    const scheme = SYNTHETIC_SCHEMES[i % SYNTHETIC_SCHEMES.length];
    const partner = SYNTHETIC_PARTNERS[i % SYNTHETIC_PARTNERS.length];
    const status = STATUS_LIST[i % STATUS_LIST.length];
    const loan = scheme.minLoan + ((i * 24300) % (scheme.maxLoan - scheme.minLoan));
    const cost = Math.round(loan * 1.25);
    const own = cost - loan;
    const matchScore = 72 + (i % 26); // 72% to 98%

    const daysAgo = (i * 2) % 60;
    const submittedDate = new Date(Date.now() - daysAgo * 86400000).toISOString();

    applications.push({
      id: `SAH-2026-${String(80000 + i).padStart(5, '0')}`,
      userId: user.id,
      applicantName: user.name,
      applicantMobile: user.mobile,
      applicantState: user.state,
      applicantDistrict: user.district,
      schemeId: scheme.id,
      schemeName: scheme.name,
      schemeCategory: scheme.category,
      partnerId: partner.id,
      partnerName: partner.name,
      partnerType: partner.partnerType,
      partnerBranch: `${partner.district} Branch`,
      projectType: scheme.projectTypes[0] || 'Enterprise',
      projectCost: cost,
      ownContribution: own,
      loanAmount: loan,
      interestRate: scheme.interestRate || 8.0,
      tenureMonths: scheme.tenureMonths || 36,
      estimatedEMI: Math.round((loan * (1 + ((scheme.interestRate || 8.0) / 100) * ((scheme.tenureMonths || 36) / 12))) / (scheme.tenureMonths || 36)),
      matchScore,
      status,
      statusOrigin: 'USER_REPORTED' as const,
      submittedAt: submittedDate,
      updatedAt: new Date(new Date(submittedDate).getTime() + 86400000 * 2).toISOString(),
      documents: (scheme.requiredDocuments || []).map(d => ({ name: d, status: 'Verified' as const })),
      timeline: buildTimeline(status, submittedDate),
      remarks: status === 'REJECTED' ? 'Applicant annual family income exceeded scheme eligibility threshold.' : 'Processed through standard AI routing protocol.',
      demoData: true
    });
  }

  return applications;
}

export const SEEDED_APPLICATIONS: Application[] = generateSyntheticApplications();
