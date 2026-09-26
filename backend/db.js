import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { AUTHORITATIVE_SCHEMES_DATA } from './authoritativeSchemes.js';

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
    version: '3.0-authoritative-civic',
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
        schemeId: 'SCH-PMEGP-001',
        schemeName: 'Prime Minister’s Employment Generation Programme (PMEGP)',
        schemeCategory: 'Micro Enterprise',
        partnerId: 'PTR-UP-001',
        partnerName: 'UP Khadi and Village Industries Board (KVIB)',
        partnerType: 'State Channelizing Agency',
        partnerBranch: 'Varanasi District Office',
        projectType: 'Handloom Weaving',
        projectCost: 180000,
        ownContribution: 40000,
        loanAmount: 140000,
        interestRate: 8.5,
        tenureMonths: 60,
        estimatedEMI: 2872,
        matchScore: 96,
        status: 'SUBMITTED',
        statusOrigin: 'USER_REPORTED',
        waitingPeriodStart: '2026-08-22T09:30:00Z',
        expectedDecisionDate: '2026-10-15T00:00:00Z',
        waitingPeriodStatus: 'WAITING_PERIOD',
        officialApplicationRefNumber: 'PMEGP-UP-2026-92841',
        officialPortalUrl: 'https://pmegp.msme.gov.in/',
        submittedAt: '2026-08-22T09:30:00Z',
        updatedAt: '2026-09-02T14:20:00Z',
        documents: [
          { name: 'Aadhaar Card', status: 'Verified' },
          { name: 'PAN Card', status: 'Verified' },
          { name: 'Detailed Project Report (DPR)', status: 'Verified' }
        ],
        timeline: [
          {
            status: 'SUBMITTED',
            title: 'Application Recorded in Sahayak AI',
            description: 'Application details recorded as user-reported on platform.',
            timestamp: '2026-08-22T09:30:00Z',
            completed: true,
            statusOrigin: 'USER_REPORTED'
          }
        ],
        remarks: 'Application tracked on official portal pmegp.msme.gov.in.'
      }
    ],
    schemes: AUTHORITATIVE_SCHEMES_DATA,
    partners: [],
    audit_history: [],
    notifications: [
      {
        id: 'notif-seed-01',
        idempotencyKey: 'all_none_none_SYSTEM_INITIALIZED_2026-01-01',
        userId: 'all',
        title: 'Authoritative Government Scheme Repository Active',
        message: '15 verified Government of India and State flagship schemes loaded with field verification.',
        type: 'SCHEME_OPENED',
        priority: 'NORMAL',
        createdAt: '2026-01-01T00:00:00Z',
        read: false,
        actionLink: '/schemes'
      }
    ]
  };
}

// MongoDB Connection Pool Setup
let clientPromise = null;
let mongoDisabled = false;
const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  try {
    const client = new MongoClient(mongoUri, {
      connectTimeoutMS: 3000,
      serverSelectionTimeoutMS: 3000
    });
    clientPromise = client.connect();
    console.log('[DATABASE] MongoDB URI detected. Connecting to MongoDB Atlas...');
  } catch (err) {
    console.error('[DATABASE] Error setting up MongoDB client:', err);
    clientPromise = null;
    mongoDisabled = true;
  }
}

async function getMongoDb() {
  if (mongoDisabled || !clientPromise) return null;
  try {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB_NAME || 'sahayak_db');
  } catch (err) {
    mongoDisabled = true;
    console.error('[DATABASE] MongoDB connection failed, falling back to local disk store:', err.message);
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
    const data = JSON.parse(content);
    // Ensure schemes are present
    if (!data.schemes || data.schemes.length === 0) {
      data.schemes = AUTHORITATIVE_SCHEMES_DATA;
      writeLocalFile(data);
    }
    if (!data.audit_history) {
      data.audit_history = [];
    }
    return data;
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
      await db.collection('schemes').insertMany(seed.schemes);
      await db.collection('notifications').insertMany(seed.notifications);
      console.log('[DATABASE] Initial seed data migrated to MongoDB Atlas collections successfully!');
    } else {
      // Ensure schemes collection has data
      const schemeCount = await db.collection('schemes').countDocuments();
      if (schemeCount === 0) {
        await db.collection('schemes').insertMany(AUTHORITATIVE_SCHEMES_DATA);
        console.log('[DATABASE] Seeded 15 authoritative schemes to MongoDB Atlas schemes collection.');
      }
    }
    // Create unique index for idempotencyKey on notifications if not exists
    try {
      await db.collection('notifications').createIndex({ idempotencyKey: 1 }, { unique: true, sparse: true });
    } catch (_) {}
  } catch (err) {
    console.error('[DATABASE] Seeding check error:', err.message);
  }
}

export const dbService = {
  async getHealth() {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const [uCount, aCount, sCount, nCount, audCount] = await Promise.all([
        mdb.collection('users').countDocuments(),
        mdb.collection('applications').countDocuments(),
        mdb.collection('schemes').countDocuments(),
        mdb.collection('notifications').countDocuments(),
        mdb.collection('audit_history').countDocuments()
      ]);
      return {
        status: 'online',
        databaseEngine: 'MongoDB Atlas Cloud (Production)',
        mongodbConnected: true,
        databaseName: mdb.databaseName,
        recordCounts: {
          users: uCount,
          applications: aCount,
          schemes: sCount,
          partners: 0,
          notifications: nCount,
          auditHistory: audCount
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
        notifications: (data.notifications || []).length,
        auditHistory: (data.audit_history || []).length
      }
    };
  },

  // USERS
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
      await mdb.collection('users').insertOne(newUser);
      return { success: true, user: newUser };
    }

    const data = readLocalFile();
    data.users = data.users || [];
    const existing = data.users.find(
      u => (cleanEmail && u.email?.toLowerCase() === cleanEmail) ||
           (cleanMobile && u.mobile === cleanMobile)
    );
    if (existing) {
      return { success: false, message: 'An account with this email or mobile already exists.' };
    }
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

  // SCHEMES
  async getSchemes(filters = {}) {
    const mdb = await getMongoDb();
    let schemes = [];
    if (mdb) {
      await ensureMongoSeed(mdb);
      const query = {};
      if (filters.state) {
        query.state = filters.state;
      }
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.schemeStatus) {
        query.schemeStatus = filters.schemeStatus;
      }
      if (filters.verificationStatus) {
        query.verificationStatus = filters.verificationStatus;
      }
      const raw = await mdb.collection('schemes').find(query).toArray();
      schemes = raw.map(({ _id, ...s }) => s);
    } else {
      const data = readLocalFile();
      schemes = data.schemes || AUTHORITATIVE_SCHEMES_DATA;
      if (filters.state) {
        schemes = schemes.filter(s => s.state === filters.state || (filters.state === 'Central' && s.state === 'Central'));
      }
      if (filters.category) {
        schemes = schemes.filter(s => s.category === filters.category);
      }
      if (filters.schemeStatus) {
        schemes = schemes.filter(s => s.schemeStatus === filters.schemeStatus);
      }
      if (filters.verificationStatus) {
        schemes = schemes.filter(s => s.verificationStatus === filters.verificationStatus);
      }
    }
    return schemes;
  },

  async getSchemeById(id) {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const scheme = await mdb.collection('schemes').findOne({
        $or: [{ id }, { schemeId: id }, { code: id }]
      });
      if (scheme) {
        const { _id, ...safe } = scheme;
        return safe;
      }
      return null;
    }
    const data = readLocalFile();
    const scheme = (data.schemes || []).find(s => s.id === id || s.schemeId === id || s.code === id);
    return scheme || null;
  },

  async updateScheme(id, updates) {
    const mdb = await getMongoDb();
    const nowIso = new Date().toISOString();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const res = await mdb.collection('schemes').findOneAndUpdate(
        { $or: [{ id }, { schemeId: id }] },
        { $set: { ...updates, lastUpdatedAt: nowIso } },
        { returnDocument: 'after', upsert: true }
      );
      if (!res) return { success: false, message: 'Scheme update failed' };
      const { _id, ...safe } = res;
      return { success: true, scheme: safe };
    }
    const data = readLocalFile();
    data.schemes = data.schemes || [];
    const idx = data.schemes.findIndex(s => s.id === id || s.schemeId === id);
    if (idx === -1) {
      const newRecord = { id, schemeId: id, ...updates, lastUpdatedAt: nowIso };
      data.schemes.push(newRecord);
      writeLocalFile(data);
      return { success: true, scheme: newRecord };
    }
    data.schemes[idx] = { ...data.schemes[idx], ...updates, lastUpdatedAt: nowIso };
    writeLocalFile(data);
    return { success: true, scheme: data.schemes[idx] };
  },

  async updateSchemeWithAuditDiff(id, updates, source = 'Official Notification Ingest') {
    const current = await this.getSchemeById(id);
    if (!current) return { success: false, message: 'Scheme not found' };

    // Calculate changed fields
    const changedFields = Object.keys(updates).filter(
      k => k !== 'lastUpdatedAt' && k !== 'updatedAt' && JSON.stringify(current[k]) !== JSON.stringify(updates[k])
    );

    if (changedFields.length === 0) {
      return { success: true, scheme: current, changedFields: [], message: 'No changed fields detected.' };
    }

    // High impact fields: eligibility, benefits, application dates, URLs
    const highImpactFields = [
      'structuredEligibility',
      'eligibilityRules',
      'benefits',
      'applicationEndDate',
      'officialApplicationUrl',
      'category'
    ];
    const isHighImpact = changedFields.some(f => highImpactFields.includes(f));

    const previousVersion = current.version || '2026.1';
    const versionParts = previousVersion.split('.');
    const nextMinor = versionParts.length > 1 ? parseInt(versionParts[1] || '1', 10) + 1 : 2;
    const newVersion = `${versionParts[0]}.${nextMinor}`;

    const auditEntry = {
      auditId: `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      schemeId: current.id || current.schemeId,
      schemeName: current.officialName || current.name,
      previousVersion,
      newVersion,
      changedFields,
      previousData: Object.fromEntries(changedFields.map(f => [f, current[f]])),
      updatedData: Object.fromEntries(changedFields.map(f => [f, updates[f]])),
      source,
      detectedAt: new Date().toISOString(),
      status: isHighImpact ? 'NEEDS_REVIEW' : 'AUTO_AUDITED'
    };

    // If high impact, transition verificationStatus to NEEDS_REVIEW
    const finalUpdates = {
      ...updates,
      version: newVersion,
      lastUpdatedAt: new Date().toISOString()
    };
    if (isHighImpact && !updates.verificationStatus) {
      finalUpdates.verificationStatus = 'NEEDS_REVIEW';
    }

    // Persist scheme update
    const updateResult = await this.updateScheme(id, finalUpdates);

    // Persist audit history
    const mdb = await getMongoDb();
    if (mdb) {
      await mdb.collection('audit_history').insertOne(auditEntry);
    } else {
      const data = readLocalFile();
      data.audit_history = data.audit_history || [];
      data.audit_history.unshift(auditEntry);
      writeLocalFile(data);
    }

    // Dispatched SCHEME_UPDATED notification with idempotencyKey
    const todayStr = new Date().toISOString().slice(0, 10);
    const idempotencyKey = `all_${current.id || current.schemeId}_none_SCHEME_UPDATED_${todayStr}_${newVersion}`;
    await this.createNotification({
      idempotencyKey,
      userId: 'all',
      schemeId: current.id || current.schemeId,
      type: 'SCHEME_UPDATED',
      title: `Scheme Updated: ${current.shortName || current.officialName}`,
      message: `Official parameters (${changedFields.join(', ')}) modified. Version updated to ${newVersion}.${isHighImpact ? ' Under administrative review.' : ''}`,
      priority: isHighImpact ? 'HIGH' : 'NORMAL',
      actionLink: `/schemes/${current.id || current.schemeId}`
    });

    return {
      success: true,
      scheme: updateResult.scheme,
      audit: auditEntry,
      changedFields
    };
  },

  async getAuditHistory(schemeId) {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const query = schemeId ? { schemeId } : {};
      const history = await mdb.collection('audit_history').find(query).sort({ detectedAt: -1 }).toArray();
      return history.map(({ _id, ...h }) => h);
    }
    const data = readLocalFile();
    let history = data.audit_history || [];
    if (schemeId) {
      history = history.filter(h => h.schemeId === schemeId);
    }
    return history;
  },

  // APPLICATIONS
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
    const nowIso = new Date().toISOString();
    const fullApp = {
      ...app,
      statusOrigin: app.statusOrigin || 'USER_REPORTED',
      createdAt: nowIso,
      submittedAt: app.submittedAt || nowIso,
      updatedAt: nowIso
    };

    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      await mdb.collection('applications').insertOne(fullApp);
      await this.createNotification({
        idempotencyKey: `${fullApp.userId}_${fullApp.schemeId}_${fullApp.id}_APPLICATION_SUBMITTED_${nowIso.slice(0, 10)}`,
        userId: fullApp.userId,
        schemeId: fullApp.schemeId,
        applicationId: fullApp.id,
        type: 'APPLICATION_SUBMITTED',
        title: 'Application Recorded in Sahayak AI',
        message: `Application ${fullApp.id} for ${fullApp.schemeName} was recorded as user-reported. Check the official portal for status.`,
        priority: 'NORMAL',
        actionLink: '/applications'
      });
      return { success: true, application: fullApp };
    }

    const data = readLocalFile();
    data.applications = data.applications || [];
    data.applications.unshift(fullApp);
    writeLocalFile(data);

    await this.createNotification({
      idempotencyKey: `${fullApp.userId}_${fullApp.schemeId}_${fullApp.id}_APPLICATION_SUBMITTED_${nowIso.slice(0, 10)}`,
      userId: fullApp.userId,
      schemeId: fullApp.schemeId,
      applicationId: fullApp.id,
      type: 'APPLICATION_SUBMITTED',
      title: 'Application Recorded in Sahayak AI',
      message: `Application ${fullApp.id} for ${fullApp.schemeName} was recorded as user-reported. Check the official portal for status.`,
      priority: 'NORMAL',
      actionLink: '/applications'
    });

    return { success: true, application: fullApp };
  },

  async updateApplication(id, updates) {
    const nowIso = new Date().toISOString();
    const todayStr = nowIso.slice(0, 10);

    // If citizen reports approval, strictly preserve statusOrigin as USER_REPORTED
    if (updates.status === 'APPROVED') {
      updates.statusOrigin = 'USER_REPORTED';
    }

    const mdb = await getMongoDb();
    let updatedApp = null;

    if (mdb) {
      await ensureMongoSeed(mdb);
      const res = await mdb.collection('applications').findOneAndUpdate(
        { id },
        { $set: { ...updates, updatedAt: nowIso } },
        { returnDocument: 'after' }
      );
      if (!res) return { success: false, message: 'Application not found' };
      const { _id, ...app } = res;
      updatedApp = app;
    } else {
      const data = readLocalFile();
      const idx = (data.applications || []).findIndex(a => a.id === id);
      if (idx === -1) return { success: false, message: 'Application not found' };

      data.applications[idx] = { ...data.applications[idx], ...updates, updatedAt: nowIso };
      writeLocalFile(data);
      updatedApp = data.applications[idx];
    }

    // Specific notification when user reports approval
    if (updates.status === 'APPROVED' && updatedApp) {
      await this.createNotification({
        idempotencyKey: `${updatedApp.userId}_${updatedApp.schemeId}_${updatedApp.id}_APPLICATION_APPROVED_${todayStr}`,
        userId: updatedApp.userId,
        schemeId: updatedApp.schemeId,
        applicationId: updatedApp.id,
        type: 'APPLICATION_APPROVED',
        title: 'Status Updated: Approved (User-reported)',
        message: `You reported that your application for ${updatedApp.schemeName} was approved. Please verify the approval through the official government portal.`,
        priority: 'HIGH',
        actionLink: '/applications'
      });
    }

    return { success: true, application: updatedApp };
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

  // NOTIFICATIONS (WITH IDEMPOTENCY)
  async getNotifications(userId) {
    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      const query = userId && userId !== 'all' ? { $or: [{ userId }, { userId: 'all' }] } : {};
      const list = await mdb.collection('notifications').find(query).sort({ createdAt: -1, _id: -1 }).toArray();
      return list.map(({ _id, ...n }) => n);
    }
    const data = readLocalFile();
    let notifs = data.notifications || [];
    if (userId && userId !== 'all') {
      notifs = notifs.filter(n => n.userId === userId || n.userId === 'all');
    }
    return notifs;
  },

  async createNotification(notif) {
    const nowIso = new Date().toISOString();
    const idempotencyKey =
      notif.idempotencyKey ||
      `${notif.userId || 'all'}_${notif.schemeId || 'none'}_${notif.applicationId || 'none'}_${notif.type}_${nowIso.slice(0, 10)}`;

    const fullNotif = {
      notificationId: notif.notificationId || notif.id || `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      id: notif.id || `notif-${Date.now()}`,
      idempotencyKey,
      userId: notif.userId || 'all',
      schemeId: notif.schemeId,
      applicationId: notif.applicationId,
      type: notif.type || 'SYSTEM',
      title: notif.title || 'Notification',
      message: notif.message || '',
      priority: notif.priority || 'NORMAL',
      actionLink: notif.actionLink || '',
      createdAt: notif.createdAt || nowIso,
      read: false
    };

    const mdb = await getMongoDb();
    if (mdb) {
      await ensureMongoSeed(mdb);
      // Check if duplicate idempotency key exists
      const existing = await mdb.collection('notifications').findOne({ idempotencyKey });
      if (existing) {
        return { success: false, duplicate: true, message: 'Notification with this idempotencyKey already exists.' };
      }
      try {
        await mdb.collection('notifications').insertOne(fullNotif);
        return { success: true, duplicate: false, notification: fullNotif };
      } catch (err) {
        if (err.code === 11000) {
          return { success: false, duplicate: true, message: 'Duplicate idempotency key detected.' };
        }
        throw err;
      }
    }

    const data = readLocalFile();
    data.notifications = data.notifications || [];
    const exists = data.notifications.some(n => n.idempotencyKey === idempotencyKey);
    if (exists) {
      return { success: false, duplicate: true, message: 'Notification with this idempotencyKey already exists.' };
    }

    data.notifications.unshift(fullNotif);
    writeLocalFile(data);
    return { success: true, duplicate: false, notification: fullNotif };
  },

  async resetDatabase() {
    const initial = getInitialSeedData();
    const mdb = await getMongoDb();
    if (mdb) {
      await mdb.collection('users').deleteMany({});
      await mdb.collection('applications').deleteMany({});
      await mdb.collection('schemes').deleteMany({});
      await mdb.collection('notifications').deleteMany({});
      await mdb.collection('audit_history').deleteMany({});
      await mdb.collection('users').insertMany(initial.users);
      await mdb.collection('applications').insertMany(initial.applications);
      await mdb.collection('schemes').insertMany(initial.schemes);
      await mdb.collection('notifications').insertMany(initial.notifications);
      return { success: true, message: 'MongoDB Atlas reset to default authoritative seed records.' };
    }

    writeLocalFile(initial);
    return { success: true, message: 'Local JSON disk database reset to default seed state.' };
  }
};
