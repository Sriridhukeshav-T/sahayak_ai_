// SAHAYAK AI — Real Persistent Backend Database Server
// Runs with native Node.js (no extra npm dependencies needed)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'sahayak_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed state if DB file does not exist
function getInitialDbState() {
  return {
    version: '2.0-real-disk',
    created: new Date().toISOString(),
    users: [
      {
        id: 'USR-ADMIN-001',
        name: 'National Portal Administrator',
        email: 'admin@sahayak.gov.in',
        mobile: '+91 98765 43210',
        password: 'Admin@Sahayak2026',
        createdAt: '2026-01-01T00:00:00Z',
        age: 40,
        gender: 'Other',
        category: 'General',
        state: 'Delhi',
        district: 'New Delhi',
        pinCode: '110001',
        income: 1200000,
        monthlyExpenses: 45000,
        existingLoans: false,
        existingEMI: 0,
        goal: 'Platform Administration',
        projectType: 'Administration',
        purpose: 'National Concessional Scheme Management and Channel Partner Routing Oversight',
        projectCost: 0,
        loanRequirement: 0,
        ownContribution: 0,
        expectedBusinessIncome: 0,
        experienceYears: 15,
        preferredLanguage: 'en',
        educationStatus: 'Post Graduate',
        role: 'admin',
        uploadedDocuments: []
      },
      {
        id: 'USR-CITIZEN-001',
        name: 'Sunita Sharma',
        email: 'citizen@sahayak.gov.in',
        mobile: '+91 98123 45678',
        password: 'Citizen@Sahayak2026',
        createdAt: '2026-02-15T10:30:00Z',
        age: 32,
        gender: 'Female',
        category: 'OBC',
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        pinCode: '221001',
        income: 280000,
        monthlyExpenses: 12000,
        existingLoans: false,
        existingEMI: 0,
        goal: 'Start a business',
        projectType: 'Handloom Weaving',
        purpose: 'Procurement of motorized handloom and organic raw silk yarns for Banarasi craft unit.',
        projectCost: 180000,
        loanRequirement: 140000,
        ownContribution: 40000,
        expectedBusinessIncome: 22000,
        experienceYears: 4,
        preferredLanguage: 'hi',
        educationStatus: '10th Pass',
        role: 'citizen',
        uploadedDocuments: [
          {
            id: 'DOC-SUN-01',
            name: 'Aadhaar Card',
            type: 'Aadhaar Card',
            fileName: 'Aadhaar_Sunita_Sharma.pdf',
            fileSize: '1.1 MB',
            uploadedAt: '2026-02-16T11:00:00Z',
            status: 'Detected',
            detectionSummary: 'UIDAI verified format detected'
          }
        ]
      }
    ],
    applications: [
      {
        id: 'SAH-2026-92841',
        userId: 'USR-CITIZEN-001',
        applicantName: 'Sunita Sharma',
        applicantMobile: '+91 98123 45678',
        applicantState: 'Uttar Pradesh',
        applicantDistrict: 'Varanasi',
        schemeId: 'SCH-MCR-001',
        schemeName: 'National Micro-Credit Assistance for Women Artisans & Tailors',
        schemeCategory: 'Micro Enterprise',
        partnerId: 'PTR-UP-001',
        partnerName: 'UP Backward Classes Welfare Corporation',
        partnerType: 'State Channelizing Agency',
        partnerBranch: 'Varanasi District Office',
        projectType: 'Handloom & Weaving Workshop',
        projectCost: 180000,
        ownContribution: 40000,
        loanAmount: 140000,
        interestRate: 4.5,
        tenureMonths: 36,
        estimatedEMI: 4165,
        matchScore: 96,
        status: 'PARTNER_REVIEW',
        submittedAt: '2026-08-22T09:30:00Z',
        updatedAt: '2026-09-02T14:20:00Z',
        documents: [
          { name: 'Aadhaar Card', status: 'Verified' },
          { name: 'Income Certificate', status: 'Verified' },
          { name: 'Bank Passbook / Cancelled Cheque', status: 'Verified' },
          { name: 'Handloom Machinery Quotation', status: 'Verified' }
        ],
        timeline: [
          { status: 'SUBMITTED', title: 'Application Submitted', description: 'Application registered on gateway.', timestamp: '2026-08-22T09:30:00Z', completed: true },
          { status: 'DOCUMENT_CHECK', title: 'AI Document Readiness Check', description: 'Mandatory certificates verified.', timestamp: '2026-08-25T11:00:00Z', completed: true },
          { status: 'FORWARDED_TO_PARTNER', title: 'Routed to Channel Partner', description: 'Forwarded to Varanasi District Office.', timestamp: '2026-08-28T14:30:00Z', completed: true },
          { status: 'PARTNER_REVIEW', title: 'Channel Partner Appraisal', description: 'Credit appraisal and field review in progress.', timestamp: '2026-09-02T14:20:00Z', completed: false, current: true }
        ],
        remarks: 'Application verified by AI Readiness Engine. Field officer inspection scheduled.'
      }
    ],
    schemes: [],
    partners: [],
    notifications: [
      {
        id: 'notif-seed-01',
        title: 'Welcome to Sahayak AI',
        message: 'Your official citizen account is ready with real persistent database storage.',
        type: 'success',
        timestamp: 'Today',
        read: false,
        actionLink: '/find-scheme'
      }
    ]
  };
}

// Read database from disk
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDbState();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB:', err);
    return getInitialDbState();
  }
}

// Write database to disk
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB to disk:', err);
    return false;
  }
}

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', err => reject(err));
  });
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // JSON helper
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  try {
    // 1. Health & Status
    if (pathname === '/api/health' && req.method === 'GET') {
      const db = readDb();
      const stats = fs.statSync(DB_FILE);
      return sendJson(200, {
        status: 'online',
        databaseEngine: 'Physical JSON Disk Store (Node.js REST API)',
        databaseFilePath: DB_FILE,
        databaseFileSizeBytes: stats.size,
        databaseFileSizeKb: (stats.size / 1024).toFixed(1),
        lastModified: stats.mtime.toISOString(),
        recordCounts: {
          users: (db.users || []).length,
          applications: (db.applications || []).length,
          schemes: (db.schemes || []).length,
          partners: (db.partners || []).length,
          notifications: (db.notifications || []).length
        }
      });
    }

    // 2. Users / Auth
    if (pathname === '/api/users' && req.method === 'GET') {
      const db = readDb();
      return sendJson(200, db.users || []);
    }

    if ((pathname === '/api/users' || pathname === '/api/auth/register') && req.method === 'POST') {
      const body = await parseBody(req);
      const db = readDb();
      const existing = (db.users || []).find(
        u => (body.email && u.email?.toLowerCase() === body.email.toLowerCase()) ||
             (body.mobile && u.mobile === body.mobile)
      );

      if (existing) {
        return sendJson(400, { success: false, message: 'An account with this email or mobile already exists.' });
      }

      const newUser = {
        id: `USR-${Date.now()}`,
        name: body.name || 'Citizen Entrepreneur',
        email: body.email || '',
        mobile: body.mobile || '',
        password: body.password || '',
        createdAt: new Date().toISOString(),
        age: body.age || 28,
        gender: body.gender || 'Prefer not to say',
        category: body.category || 'General',
        state: body.state || 'Delhi',
        district: body.district || '',
        pinCode: body.pinCode || '',
        income: body.income || 0,
        monthlyExpenses: body.monthlyExpenses || 0,
        existingLoans: Boolean(body.existingLoans),
        existingEMI: body.existingEMI || 0,
        goal: body.goal || 'Start a business',
        projectType: body.projectType || 'Micro Enterprise',
        purpose: body.purpose || '',
        projectCost: body.projectCost || 0,
        loanRequirement: body.loanRequirement || 0,
        ownContribution: body.ownContribution || 0,
        expectedBusinessIncome: body.expectedBusinessIncome || 0,
        experienceYears: body.experienceYears || 0,
        preferredLanguage: body.preferredLanguage || 'en',
        educationStatus: body.educationStatus || '12th Pass',
        role: 'citizen',
        uploadedDocuments: []
      };

      db.users = db.users || [];
      db.users.push(newUser);
      writeDb(db);

      return sendJson(201, { success: true, user: newUser });
    }

    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const db = readDb();
      const identifier = (body.identifier || '').trim().toLowerCase();
      const password = (body.password || '').trim();

      const user = (db.users || []).find(
        u => (u.email?.toLowerCase() === identifier || u.mobile === identifier) && u.password === password
      );

      if (!user) {
        return sendJson(401, { success: false, message: 'Invalid email/mobile or password.' });
      }

      return sendJson(200, { success: true, user });
    }

    // 3. Applications
    if (pathname === '/api/applications' && req.method === 'GET') {
      const db = readDb();
      const userId = parsedUrl.searchParams.get('userId');
      let apps = db.applications || [];
      if (userId) {
        apps = apps.filter(a => a.userId === userId);
      }
      return sendJson(200, apps);
    }

    if (pathname === '/api/applications' && req.method === 'POST') {
      const body = await parseBody(req);
      const db = readDb();
      db.applications = db.applications || [];
      db.applications.unshift(body);

      // Add notification for submission
      db.notifications = db.notifications || [];
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: 'Application Stored in Real Database',
        message: `Application ${body.id} for ${body.schemeName} was recorded directly to disk on port ${PORT}.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
        actionLink: '/applications'
      });

      writeDb(db);
      return sendJson(201, { success: true, application: body });
    }

    if (pathname.startsWith('/api/applications/') && req.method === 'PUT') {
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      const db = readDb();
      const idx = (db.applications || []).findIndex(a => a.id === id);

      if (idx === -1) {
        return sendJson(404, { success: false, message: 'Application not found' });
      }

      db.applications[idx] = { ...db.applications[idx], ...body, updatedAt: new Date().toISOString() };
      writeDb(db);
      return sendJson(200, { success: true, application: db.applications[idx] });
    }

    if (pathname.startsWith('/api/applications/') && req.method === 'DELETE') {
      const id = pathname.split('/')[3];
      const db = readDb();
      db.applications = (db.applications || []).filter(a => a.id !== id);
      writeDb(db);
      return sendJson(200, { success: true, message: `Application ${id} removed from disk.` });
    }

    // 4. Notifications
    if (pathname === '/api/notifications' && req.method === 'GET') {
      const db = readDb();
      return sendJson(200, db.notifications || []);
    }

    // 5. Reset to clean defaults
    if (pathname === '/api/reset' && req.method === 'POST') {
      const initial = getInitialDbState();
      writeDb(initial);
      return sendJson(200, { success: true, message: 'Database reset to default seed state on disk.' });
    }

    // 404
    sendJson(404, { error: 'Endpoint not found' });
  } catch (error) {
    console.error('Server error:', error);
    sendJson(500, { error: 'Internal server error', details: String(error) });
  }
});

server.listen(PORT, () => {
  console.log(`[SAHAYAK DB SERVER] Real Database Server is running at http://localhost:${PORT}`);
  console.log(`[SAHAYAK DB SERVER] Storage file: ${DB_FILE}`);
});
