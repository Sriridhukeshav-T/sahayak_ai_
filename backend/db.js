import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'sahayak_db.json');

// Ensure local data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
export function getInitialSeedData() {
  return {
    version: '2.0-cloud-ready',
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
        title: 'Welcome to Sahayak AI Cloud Database',
        message: 'Your system is connected with real database persistence.',
        type: 'success',
        timestamp: 'Today',
        read: false,
        actionLink: '/find-scheme'
      }
    ]
  };
}

// MongoDB Connection Pool Setup
let clientPromise = null;
const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  try {
    const client = new MongoClient(mongoUri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });
    clientPromise = client.connect();
    console.log('[DATABASE] MongoDB URI detected. Connecting to MongoDB Atlas...');
  } catch (err) {
    console.error('[DATABASE] Error setting up MongoDB client:', err);
    clientPromise = null;
  }
}

async function getMongoDb() {
  if (!clientPromise) return null;
  try {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB_NAME || 'sahayak_db');
  } catch (err) {
    console.error('[DATABASE] MongoDB connection failed, falling back to local disk:', err.message);
    return null;
  }
}

// Local File Database helper functions
function readLocalFile() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[DATABASE] Error reading local DB file:', err);
    return getInitialSeedData();
  }
}

function writeLocalFile(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DATABASE] Error writing local DB file:', err);
    return false;
  }
}

// Auto-seed MongoDB collection if empty
async function ensureMongoSeed(db) {
  try {
    const userCount = await db.collection('users').countDocuments();
    if (userCount === 0) {
      const seed = getInitialSeedData();
      await db.collection('users').insertMany(seed.users);
      await db.collection('applications').insertMany(seed.applications);
      await db.collection('notifications').insertMany(seed.notifications);
      console.log('[DATABASE] Initial seed data migrated to MongoDB Atlas collections successfully!');
    }
  } catch (err) {
    console.error('[DATABASE] Seeding check error:', err.message);
  }
}

export const dbService = {
  async getHealth() {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const [uCount, aCount, nCount] = await Promise.all([
        mdb.collection('users').countDocuments(),
        mdb.collection('applications').countDocuments(),
        mdb.collection('notifications').countDocuments()
      ]);
      return {
        status: 'online',
        databaseEngine: 'MongoDB Atlas Cloud (Production)',
        mongodbConnected: true,
        databaseName: mdb.databaseName,
        recordCounts: {
          users: uCount,
          applications: aCount,
          schemes: 0,
          partners: 0,
          notifications: nCount
        }
      };
    }

    // Fallback: Local JSON disk
    const data = readLocalFile();
    let stats = { size: 0, mtime: new Date() };
    if (fs.existsSync(DB_FILE)) {
      stats = fs.statSync(DB_FILE);
    }
    return {
      status: 'online',
      databaseEngine: 'Physical JSON Disk Store (Local Dev)',
      mongodbConnected: false,
      databaseFilePath: DB_FILE,
      databaseFileSizeKb: (stats.size / 1024).toFixed(1),
      lastModified: stats.mtime.toISOString(),
      recordCounts: {
        users: (data.users || []).length,
        applications: (data.applications || []).length,
        schemes: (data.schemes || []).length,
        partners: (data.partners || []).length,
        notifications: (data.notifications || []).length
      }
    };
  },

  async getUsers() {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const users = await mdb.collection('users').find({}).toArray();
      return users.map(({ _id, ...u }) => u);
    }
    const data = readLocalFile();
    return data.users || [];
  },

  async registerUser(userData) {
    const mdb = await getMongoDb();
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanMobile = (userData.mobile || '').trim();

    if (mdb) {
      await ensureMongoSeed(mdb);
      const existing = await mdb.collection('users').findOne({
        $or: [
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
          ...(cleanMobile ? [{ mobile: cleanMobile }] : [])
        ]
      });
      if (existing) {
        return { success: false, message: 'An account with this email or mobile already exists in MongoDB.' };
      }

      const newUser = {
        id: `USR-${Date.now()}`,
        name: userData.name || 'Citizen Entrepreneur',
        email: cleanEmail,
        mobile: cleanMobile,
        password: userData.password || '',
        createdAt: new Date().toISOString(),
        age: userData.age || 28,
        gender: userData.gender || 'Prefer not to say',
        category: userData.category || 'General',
        state: userData.state || 'Delhi',
        district: userData.district || '',
        pinCode: userData.pinCode || '',
        income: userData.income || 0,
        monthlyExpenses: userData.monthlyExpenses || 0,
        existingLoans: Boolean(userData.existingLoans),
        existingEMI: userData.existingEMI || 0,
        goal: userData.goal || 'Start a business',
        projectType: userData.projectType || 'Micro Enterprise',
        purpose: userData.purpose || '',
        projectCost: userData.projectCost || 0,
        loanRequirement: userData.loanRequirement || 0,
        ownContribution: userData.ownContribution || 0,
        expectedBusinessIncome: userData.expectedBusinessIncome || 0,
        experienceYears: userData.experienceYears || 0,
        preferredLanguage: userData.preferredLanguage || 'en',
        educationStatus: userData.educationStatus || '12th Pass',
        role: 'citizen',
        uploadedDocuments: []
      };

      await mdb.collection('users').insertOne(newUser);
      return { success: true, user: newUser };
    }

    // Local Disk
    const data = readLocalFile();
    data.users = data.users || [];
    const existing = data.users.find(
      u => (cleanEmail && u.email?.toLowerCase() === cleanEmail) ||
           (cleanMobile && u.mobile === cleanMobile)
    );
    if (existing) {
      return { success: false, message: 'An account with this email or mobile already exists.' };
    }

    const newUser = {
      id: `USR-${Date.now()}`,
      name: userData.name || 'Citizen Entrepreneur',
      email: cleanEmail,
      mobile: cleanMobile,
      password: userData.password || '',
      createdAt: new Date().toISOString(),
      age: userData.age || 28,
      gender: userData.gender || 'Prefer not to say',
      category: userData.category || 'General',
      state: userData.state || 'Delhi',
      district: userData.district || '',
      pinCode: userData.pinCode || '',
      income: userData.income || 0,
      monthlyExpenses: userData.monthlyExpenses || 0,
      existingLoans: Boolean(userData.existingLoans),
      existingEMI: userData.existingEMI || 0,
      goal: userData.goal || 'Start a business',
      projectType: userData.projectType || 'Micro Enterprise',
      purpose: userData.purpose || '',
      projectCost: userData.projectCost || 0,
      loanRequirement: userData.loanRequirement || 0,
      ownContribution: userData.ownContribution || 0,
      expectedBusinessIncome: userData.expectedBusinessIncome || 0,
      experienceYears: userData.experienceYears || 0,
      preferredLanguage: userData.preferredLanguage || 'en',
      educationStatus: userData.educationStatus || '12th Pass',
      role: 'citizen',
      uploadedDocuments: []
    };

    data.users.push(newUser);
    writeLocalFile(data);
    return { success: true, user: newUser };
  },

  async loginUser(identifier, password) {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const user = await mdb.collection('users').findOne({
        $or: [{ email: cleanId }, { mobile: cleanId }],
        password: cleanPass
      });
      if (!user) {
        return { success: false, message: 'Invalid email/mobile or password.' };
      }
      const { _id, ...safeUser } = user;
      return { success: true, user: safeUser };
    }

    const data = readLocalFile();
    const user = (data.users || []).find(
      u => (u.email?.toLowerCase() === cleanId || u.mobile === cleanId) && u.password === cleanPass
    );
    if (!user) {
      return { success: false, message: 'Invalid email/mobile or password.' };
    }
    return { success: true, user };
  },

  async getApplications(userId) {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const query = userId ? { userId } : {};
      const apps = await mdb.collection('applications').find(query).sort({ submittedAt: -1 }).toArray();
      return apps.map(({ _id, ...a }) => a);
    }

    const data = readLocalFile();
    let apps = data.applications || [];
    if (userId) {
      apps = apps.filter(a => a.userId === userId);
    }
    return apps;
  },

  async createApplication(app) {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      await mdb.collection('applications').insertOne({ ...app, createdAt: new Date().toISOString() });
      await mdb.collection('notifications').insertOne({
        id: `notif-${Date.now()}`,
        title: 'Application Stored in MongoDB Atlas',
        message: `Application ${app.id} for ${app.schemeName} was recorded directly to cloud MongoDB.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
        actionLink: '/applications'
      });
      return { success: true, application: app };
    }

    const data = readLocalFile();
    data.applications = data.applications || [];
    data.applications.unshift(app);
    data.notifications = data.notifications || [];
    data.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Application Stored in Real Database',
      message: `Application ${app.id} for ${app.schemeName} was recorded directly to disk.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      actionLink: '/applications'
    });
    writeLocalFile(data);
    return { success: true, application: app };
  },

  async updateApplication(id, updates) {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const res = await mdb.collection('applications').findOneAndUpdate(
        { id },
        { $set: { ...updates, updatedAt: new Date().toISOString() } },
        { returnDocument: 'after' }
      );
      if (!res) return { success: false, message: 'Application not found' };
      const { _id, ...app } = res;
      return { success: true, application: app };
    }

    const data = readLocalFile();
    const idx = (data.applications || []).findIndex(a => a.id === id);
    if (idx === -1) return { success: false, message: 'Application not found' };

    data.applications[idx] = { ...data.applications[idx], ...updates, updatedAt: new Date().toISOString() };
    writeLocalFile(data);
    return { success: true, application: data.applications[idx] };
  },

  async deleteApplication(id) {
    const mdb = await getMongoDb();
    if (mdb) {
      await mdb.collection('applications').deleteOne({ id });
      return { success: true, message: `Application ${id} removed from MongoDB.` };
    }

    const data = readLocalFile();
    data.applications = (data.applications || []).filter(a => a.id !== id);
    writeLocalFile(data);
    return { success: true, message: `Application ${id} removed from disk.` };
  },

  async getNotifications() {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const list = await mdb.collection('notifications').find({}).sort({ _id: -1 }).toArray();
      return list.map(({ _id, ...n }) => n);
    }
    const data = readLocalFile();
    return data.notifications || [];
  },

  async resetDatabase() {
    const initial = getInitialSeedData();
    const mdb = await getMongoDb();
    if (mdb) {
      await mdb.collection('users').deleteMany({});
      await mdb.collection('applications').deleteMany({});
      await mdb.collection('notifications').deleteMany({});
      await mdb.collection('users').insertMany(initial.users);
      await mdb.collection('applications').insertMany(initial.applications);
      await mdb.collection('notifications').insertMany(initial.notifications);
      return { success: true, message: 'MongoDB Atlas reset to default seed records.' };
    }

    writeLocalFile(initial);
    return { success: true, message: 'Local JSON disk database reset to default seed state.' };
  }
};
