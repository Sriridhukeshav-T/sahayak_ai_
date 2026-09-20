import { UserProfile } from '../types/user';

export const DEMO_PERSONAS: Record<string, UserProfile> = {
  anjali: {
    id: 'USR-DEMO-001',
    name: 'Anjali Nair',
    email: 'anjali.nair@demo.sahayak.ai',
    mobile: '+91 98471 23456',
    age: 29,
    gender: 'Female',
    category: 'OBC',
    state: 'Kerala',
    district: 'Palakkad',
    pinCode: '678001',
    income: 320000,
    monthlyExpenses: 14000,
    existingLoans: false,
    existingEMI: 0,
    goal: 'Start a business',
    projectType: 'Tailoring',
    purpose: 'New Business Setup — Purchase of two commercial motorized sewing machines, embroidery unit, and initial raw material textiles for a women boutique shop in Palakkad.',
    projectCost: 150000,
    loanRequirement: 120000,
    ownContribution: 30000,
    expectedBusinessIncome: 18500,
    experienceYears: 3,
    preferredLanguage: 'ml',
    educationStatus: '12th Pass',
    latitude: 10.7867,
    longitude: 76.6548,
    role: 'citizen',
    uploadedDocuments: [
      {
        id: 'DOC-ANJ-01',
        name: 'Aadhaar Card',
        type: 'Aadhaar Card',
        fileName: 'Aadhaar_Anjali_Nair.pdf',
        fileSize: '1.4 MB',
        uploadedAt: '2026-09-01T10:30:00Z',
        status: 'Detected',
        detectionSummary: 'UIDAI verified format detected (Masked Aadhaar)'
      },
      {
        id: 'DOC-ANJ-02',
        name: 'Income Certificate',
        type: 'Income Certificate',
        fileName: 'Revenue_Income_Cert_Palakkad.pdf',
        fileSize: '890 KB',
        uploadedAt: '2026-09-02T14:15:00Z',
        status: 'Detected',
        detectionSummary: 'Village Officer signed certificate valid till Mar 2027'
      },
      {
        id: 'DOC-ANJ-03',
        name: 'Bank Passbook',
        type: 'Bank Passbook / Cancelled Cheque',
        fileName: 'Canara_Bank_Passbook_6M.pdf',
        fileSize: '2.1 MB',
        uploadedAt: '2026-09-03T09:45:00Z',
        status: 'Detected',
        detectionSummary: 'Active savings account with regular transactions'
      },
      {
        id: 'DOC-ANJ-04',
        name: 'Tailoring Machine Quotation',
        type: 'Tailoring Machine Quotation',
        fileName: 'Juki_Singer_Commercial_Quotation.pdf',
        fileSize: '650 KB',
        uploadedAt: '2026-09-04T16:20:00Z',
        status: 'Detected',
        detectionSummary: 'Authorized machinery dealer invoice with GSTIN'
      }
    ]
  },
  ramesh: {
    id: 'USR-DEMO-002',
    name: 'Ramesh Sundaram',
    email: 'ramesh.agri@demo.sahayak.ai',
    mobile: '+91 94432 78901',
    age: 38,
    gender: 'Male',
    category: 'SC',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    pinCode: '613001',
    income: 420000,
    monthlyExpenses: 18000,
    existingLoans: true,
    existingEMI: 3500,
    goal: 'Agriculture',
    projectType: 'Agricultural Equipment',
    purpose: 'Custom hiring service — Procurement of mini-tractor, 45-blade rotavator, and drone sprayer to provide rental services to local paddy and sugarcane farmers.',
    projectCost: 800000,
    loanRequirement: 600000,
    ownContribution: 200000,
    expectedBusinessIncome: 42000,
    experienceYears: 5,
    preferredLanguage: 'ta',
    educationStatus: 'Vocational/ITI',
    latitude: 10.7870,
    longitude: 79.1378,
    role: 'citizen',
    uploadedDocuments: [
      {
        id: 'DOC-RAM-01',
        name: 'Aadhaar Card',
        type: 'Aadhaar Card',
        fileName: 'Aadhaar_Ramesh_S.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2026-08-28T11:00:00Z',
        status: 'Detected',
        detectionSummary: 'UIDAI verified format'
      },
      {
        id: 'DOC-RAM-02',
        name: 'Land Record',
        type: 'Land Record (Pattadar / ROR) or Lease Deed',
        fileName: 'Thanjavur_Patta_Chitta.pdf',
        fileSize: '3.4 MB',
        uploadedAt: '2026-08-29T15:20:00Z',
        status: 'Detected',
        detectionSummary: 'Verified 2.4 acres agricultural parcel'
      },
      {
        id: 'DOC-RAM-03',
        name: 'Machinery Quotation',
        type: 'Machinery Quotation from Authorized Dealer',
        fileName: 'Mahindra_Tractor_Quotation.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '2026-08-30T10:10:00Z',
        status: 'Detected',
        detectionSummary: 'Dealer quote for ₹7.85 Lakh with implements'
      }
    ]
  },
  priya: {
    id: 'USR-DEMO-003',
    name: 'Priya Sharma',
    email: 'priya.sharma@demo.sahayak.ai',
    mobile: '+91 97312 45678',
    age: 22,
    gender: 'Female',
    category: 'General',
    state: 'Karnataka',
    district: 'Mysuru',
    pinCode: '570006',
    income: 280000,
    monthlyExpenses: 12000,
    existingLoans: false,
    existingEMI: 0,
    goal: 'Education',
    projectType: 'Higher Education',
    purpose: 'M.Tech Biotechnology at premier state technical university — Course fee, lab workstation, thesis project, and hostel allowance.',
    projectCost: 750000,
    loanRequirement: 600000,
    ownContribution: 150000,
    expectedBusinessIncome: 0,
    experienceYears: 0,
    preferredLanguage: 'en',
    educationStatus: 'Graduate',
    latitude: 12.3168,
    longitude: 76.6215,
    role: 'citizen',
    uploadedDocuments: [
      {
        id: 'DOC-PRI-01',
        name: 'Aadhaar Card',
        type: 'Aadhaar Card',
        fileName: 'Aadhaar_Priya_Sharma.pdf',
        fileSize: '1.0 MB',
        uploadedAt: '2026-08-25T14:30:00Z',
        status: 'Detected',
        detectionSummary: 'UIDAI verified'
      },
      {
        id: 'DOC-PRI-02',
        name: 'Admission Offer Letter',
        type: 'Admission Offer Letter / Entrance Exam Rank Card',
        fileName: 'VTU_MTech_Admit_Offer.pdf',
        fileSize: '950 KB',
        uploadedAt: '2026-08-26T16:00:00Z',
        status: 'Detected',
        detectionSummary: 'Merit seat allotment order verified'
      },
      {
        id: 'DOC-PRI-03',
        name: 'Class 10 & 12 Marksheets',
        type: 'Class 10 & 12 Marksheets',
        fileName: 'Marksheets_CBSE_Cumulative.pdf',
        fileSize: '2.5 MB',
        uploadedAt: '2026-08-27T11:45:00Z',
        status: 'Detected',
        detectionSummary: 'Graduation CGPA 8.8 / 10'
      }
    ]
  }
};

// Generate 150+ synthetic users across India for admin dashboard
const STATES_AND_DISTRICTS = [
  { state: 'Kerala', district: 'Palakkad' },
  { state: 'Kerala', district: 'Kozhikode' },
  { state: 'Kerala', district: 'Ernakulam' },
  { state: 'Kerala', district: 'Thrissur' },
  { state: 'Tamil Nadu', district: 'Thanjavur' },
  { state: 'Tamil Nadu', district: 'Coimbatore' },
  { state: 'Tamil Nadu', district: 'Madurai' },
  { state: 'Tamil Nadu', district: 'Chennai' },
  { state: 'Karnataka', district: 'Mysuru' },
  { state: 'Karnataka', district: 'Bengaluru Urban' },
  { state: 'Karnataka', district: 'Hubballi' },
  { state: 'Maharashtra', district: 'Pune' },
  { state: 'Maharashtra', district: 'Mumbai Suburban' },
  { state: 'Maharashtra', district: 'Nagpur' },
  { state: 'Uttar Pradesh', district: 'Lucknow' },
  { state: 'Uttar Pradesh', district: 'Varanasi' },
  { state: 'Uttar Pradesh', district: 'Moradabad' },
  { state: 'Telangana', district: 'Hyderabad' },
  { state: 'Telangana', district: 'Warangal' },
  { state: 'Andhra Pradesh', district: 'Krishna' },
  { state: 'West Bengal', district: 'Kolkata' },
  { state: 'West Bengal', district: 'Malda' },
  { state: 'Rajasthan', district: 'Jaipur' },
  { state: 'Rajasthan', district: 'Jodhpur' },
  { state: 'Bihar', district: 'Patna' },
  { state: 'Madhya Pradesh', district: 'Bhopal' },
  { state: 'Gujarat', district: 'Ahmedabad' },
  { state: 'Odisha', district: 'Khordha' },
  { state: 'Punjab', district: 'Ludhiana' },
  { state: 'Assam', district: 'Barpeta' }
];

const FIRST_NAMES = ['Kavitha', 'Arun', 'Sneha', 'Manoj', 'Revathi', 'Deepak', 'Geetha', 'Suresh', 'Fatima', 'Vikram', 'Meena', 'Pradeep', 'Ananya', 'Rajesh', 'Sunita', 'Imran', 'Laxmi', 'Harish', 'Pallavi', 'Santosh'];
const LAST_NAMES = ['Kumar', 'Devi', 'Patel', 'Reddy', 'Sharma', 'Gowda', 'Menon', 'Singh', 'Banerjee', 'Yadav', 'Khan', 'Pillai', 'Rao', 'Verma', 'Das', 'Joshi', 'Chavan', 'Kaur', 'Soni', 'Naik'];
const PROJECT_TYPES = ['Tailoring', 'Retail Shop', 'Agricultural Equipment', 'Dairy Farming', 'Handloom Weaving', 'Food Processing', 'Higher Education', 'Solar Water Pump', 'E-Rickshaw Fleet', 'Common Service Center'];

function generateSyntheticUsers(): UserProfile[] {
  const users: UserProfile[] = [DEMO_PERSONAS.anjali, DEMO_PERSONAS.ramesh, DEMO_PERSONAS.priya];

  for (let i = 4; i <= 160; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[Math.floor(i * 3) % LAST_NAMES.length];
    const loc = STATES_AND_DISTRICTS[i % STATES_AND_DISTRICTS.length];
    const pType = PROJECT_TYPES[i % PROJECT_TYPES.length];
    const income = 35000 + ((i * 18700) % 450000);
    const loanReq = 40000 + ((i * 34200) % 750000);
    const cost = Math.round(loanReq * 1.25);
    const own = cost - loanReq;

    users.push({
      id: `USR-SYN-${String(i).padStart(4, '0')}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      mobile: `+91 ${9000000000 + (i * 123456) % 999999999}`,
      age: 20 + (i % 40),
      gender: i % 3 === 0 ? 'Female' : i % 3 === 1 ? 'Male' : 'Female',
      category: i % 4 === 0 ? 'SC' : i % 4 === 1 ? 'OBC' : i % 4 === 2 ? 'Minority' : 'General',
      state: loc.state,
      district: loc.district,
      pinCode: `${600000 + (i * 137) % 99999}`,
      income,
      monthlyExpenses: Math.round(income / 22),
      existingLoans: i % 4 === 0,
      existingEMI: i % 4 === 0 ? 2500 : 0,
      goal: pType.includes('Education') ? 'Education' : pType.includes('Agri') || pType.includes('Dairy') ? 'Agriculture' : 'Start a business',
      projectType: pType,
      purpose: `Establishment of sustainable ${pType} venture in ${loc.district}.`,
      projectCost: cost,
      loanRequirement: loanReq,
      ownContribution: own,
      expectedBusinessIncome: Math.round(loanReq * 0.12),
      experienceYears: i % 7,
      preferredLanguage: loc.state === 'Kerala' ? 'ml' : loc.state === 'Tamil Nadu' ? 'ta' : loc.state === 'Karnataka' ? 'en' : 'hi',
      educationStatus: i % 3 === 0 ? '12th Pass' : i % 3 === 1 ? 'Graduate' : 'Vocational/ITI',
      role: 'citizen',
      uploadedDocuments: []
    });
  }

  return users;
}

export const SYNTHETIC_USERS: UserProfile[] = generateSyntheticUsers();
