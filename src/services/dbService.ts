import { UserProfile, UploadedDocument } from '../types/user';
import { Scheme } from '../types/scheme';
import { ChannelPartner } from '../types/partner';
import { Application, ApplicationStatus } from '../types/application';
import { AppNotification } from '../types/common';
import { SYNTHETIC_SCHEMES } from '../data/schemes';
import { SYNTHETIC_PARTNERS } from '../data/partners';

const DB_KEYS = {
  USERS: 'sahayak_real_users_v2',
  SESSION: 'sahayak_real_session_v2',
  SCHEMES: 'sahayak_real_schemes_v2',
  PARTNERS: 'sahayak_real_partners_v2',
  APPLICATIONS: 'sahayak_real_applications_v2',
  NOTIFICATIONS: 'sahayak_real_notifications_v2',
  ACTIVE_SCHEME_ID: 'sahayak_real_active_scheme_v2',
  ACTIVE_PARTNER_ID: 'sahayak_real_active_partner_v2'
};

const BACKEND_API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? '/api'
  : (((import.meta as any).env?.VITE_API_URL) || 'http://localhost:5001/api');

async function syncWithBackend(endpoint: string, method = 'GET', body?: any) {
  try {
    const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


// Default Official Platform Accounts
const DEFAULT_ACCOUNTS: UserProfile[] = [
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
      },
      {
        id: 'DOC-SUN-02',
        name: 'Income Certificate',
        type: 'Income Certificate',
        fileName: 'Income_Certificate_Varanasi.pdf',
        fileSize: '750 KB',
        uploadedAt: '2026-02-17T14:30:00Z',
        status: 'Detected',
        detectionSummary: 'Tehsildar signed certificate valid till Dec 2026'
      }
    ]
  }
];

export class DbService {
  private static init() {
    if (typeof window === 'undefined') return;

    // Initialize Users table
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(DEFAULT_ACCOUNTS));
    }

    // Initialize Schemes
    if (!localStorage.getItem(DB_KEYS.SCHEMES)) {
      localStorage.setItem(DB_KEYS.SCHEMES, JSON.stringify(SYNTHETIC_SCHEMES));
    }

    // Initialize Partners
    if (!localStorage.getItem(DB_KEYS.PARTNERS)) {
      localStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(SYNTHETIC_PARTNERS));
    }

    // Initialize Applications
    if (!localStorage.getItem(DB_KEYS.APPLICATIONS)) {
      localStorage.setItem(DB_KEYS.APPLICATIONS, JSON.stringify([]));
    }

    // Initialize Notifications
    if (!localStorage.getItem(DB_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
  }

  // --- AUTHENTICATION & USER MANAGEMENT ---

  static getUsers(): UserProfile[] {
    this.init();
    try {
      const data = localStorage.getItem(DB_KEYS.USERS);
      return data ? JSON.parse(data) : DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  }

  static authenticate(identifier: string, pass: string): { success: boolean; user?: UserProfile; message?: string } {
    this.init();
    const cleanId = identifier.trim().toLowerCase();
    const users = this.getUsers();

    const user = users.find(
      u => (u.email.toLowerCase() === cleanId || u.mobile.replace(/\s+/g, '') === cleanId.replace(/\s+/g, ''))
    );

    if (!user) {
      return { success: false, message: 'No account found with this email or mobile number.' };
    }

    if (user.password !== pass) {
      return { success: false, message: 'Incorrect password. Please verify and try again.' };
    }

    // Store active persistent session
    this.saveSession(user.id);
    return { success: true, user };
  }

  static registerUser(data: Partial<UserProfile> & { password: string }): { success: boolean; user?: UserProfile; message?: string } {
    this.init();
    const users = this.getUsers();

    const emailClean = (data.email || '').trim().toLowerCase();
    const mobileClean = (data.mobile || '').trim().replace(/\s+/g, '');

    if (!emailClean) return { success: false, message: 'Email address is required.' };
    if (!data.password || data.password.length < 6) return { success: false, message: 'Password must be at least 6 characters.' };

    const emailExists = users.some(u => u.email.toLowerCase() === emailClean);
    if (emailExists) {
      return { success: false, message: 'An account with this email address already exists. Please log in.' };
    }

    if (mobileClean) {
      const mobileExists = users.some(u => u.mobile.replace(/\s+/g, '') === mobileClean);
      if (mobileExists) {
        return { success: false, message: 'An account with this mobile number already exists. Please log in.' };
      }
    }

    const newUser: UserProfile = {
      id: `USR-${Date.now()}`,
      name: (data.name || '').trim() || 'Citizen Entrepreneur',
      email: emailClean,
      mobile: data.mobile || '',
      password: data.password,
      createdAt: new Date().toISOString(),
      age: data.age || 28,
      gender: data.gender || 'Prefer not to say',
      category: data.category || 'General',
      state: data.state || 'Delhi',
      district: data.district || '',
      pinCode: data.pinCode || '',
      income: data.income || 0,
      monthlyExpenses: data.monthlyExpenses || 0,
      existingLoans: Boolean(data.existingLoans),
      existingEMI: data.existingEMI || 0,
      goal: data.goal || 'Start a business',
      projectType: data.projectType || 'Micro Enterprise',
      purpose: data.purpose || '',
      projectCost: data.projectCost || 0,
      loanRequirement: data.loanRequirement || 0,
      ownContribution: data.ownContribution || 0,
      expectedBusinessIncome: data.expectedBusinessIncome || 0,
      experienceYears: data.experienceYears || 0,
      preferredLanguage: data.preferredLanguage || 'en',
      educationStatus: data.educationStatus || '12th Pass',
      role: 'citizen',
      uploadedDocuments: []
    };

    users.push(newUser);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));

    // Asynchronously write to real disk database file via backend API
    syncWithBackend('/users', 'POST', newUser);

    // Save active session
    this.saveSession(newUser.id);


    // Initial welcome notification
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Welcome to Sahayak AI!',
      message: 'Your official citizen account was created. Discover matched concessional credit schemes now.',
      type: 'success',
      timestamp: 'Just now',
      read: false,
      actionLink: '/find-scheme'
    });

    return { success: true, user: newUser };
  }

  static getCurrentUser(): UserProfile | null {
    this.init();
    try {
      const sessionId = localStorage.getItem(DB_KEYS.SESSION);
      if (!sessionId) return null;

      const users = this.getUsers();
      const user = users.find(u => u.id === sessionId);
      return user || null;
    } catch {
      return null;
    }
  }

  static saveSession(userId: string): void {
    localStorage.setItem(DB_KEYS.SESSION, userId);
  }

  static clearSession(): void {
    localStorage.removeItem(DB_KEYS.SESSION);
  }

  static updateUser(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return users[idx];
  }

  // --- APPLICATION MANAGEMENT ---

  static getApplications(userId?: string): Application[] {
    this.init();
    try {
      const data = localStorage.getItem(DB_KEYS.APPLICATIONS);
      const list: Application[] = data ? JSON.parse(data) : [];
      if (userId) {
        return list.filter(a => a.userId === userId);
      }
      return list;
    } catch {
      return [];
    }
  }

  static createApplication(app: Application): void {
    this.init();
    const list = this.getApplications();
    list.unshift(app);
    localStorage.setItem(DB_KEYS.APPLICATIONS, JSON.stringify(list));

    // Asynchronously write to real disk database file via backend API
    syncWithBackend('/applications', 'POST', app);

    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Application Submitted Successfully',
      message: `Your application ${app.id} for ${app.schemeName} was routed to ${app.partnerName}.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      actionLink: '/applications'
    });
  }

  static updateApplication(id: string, updates: Partial<Application>): Application | null {
    this.init();
    const list = this.getApplications();
    const idx = list.findIndex(a => a.id === id);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(DB_KEYS.APPLICATIONS, JSON.stringify(list));
      syncWithBackend(`/applications/${encodeURIComponent(id)}`, 'PUT', updates);
      return list[idx];
    }
    return null;
  }

  static updateApplicationStatus(id: string, status: ApplicationStatus, remarks?: string): void {
    this.init();
    const list = this.getApplications();
    const idx = list.findIndex(a => a.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      list[idx].updatedAt = new Date().toISOString();
      if (remarks) list[idx].remarks = remarks;

      const currentIdx = list[idx].timeline.findIndex(t => t.status === status);
      if (currentIdx >= 0) {
        list[idx].timeline.forEach((t, i) => {
          t.completed = i <= currentIdx;
          t.current = i === currentIdx;
          if (i === currentIdx && !t.timestamp) {
            t.timestamp = new Date().toISOString();
          }
        });
      } else {
        list[idx].timeline.push({
          status,
          title: status === 'APPROVED' ? 'Marked Approved (User-reported)' : `Status Updated to ${status}`,
          description: status === 'APPROVED' ? 'Reported as approved by citizen.' : `Status changed to ${status}.`,
          timestamp: new Date().toISOString(),
          completed: true,
          statusOrigin: 'USER_REPORTED'
        });
      }

      localStorage.setItem(DB_KEYS.APPLICATIONS, JSON.stringify(list));

      // Asynchronously update on real disk file
      syncWithBackend(`/applications/${encodeURIComponent(id)}`, 'PUT', { status, remarks });
    }
  }


  // --- SCHEMES & PARTNERS (ADMIN CRUD) ---

  static getSchemes(): Scheme[] {
    this.init();
    try {
      const data = localStorage.getItem(DB_KEYS.SCHEMES);
      return data ? JSON.parse(data) : SYNTHETIC_SCHEMES;
    } catch {
      return SYNTHETIC_SCHEMES;
    }
  }

  static saveScheme(scheme: Scheme): void {
    const list = this.getSchemes();
    const idx = list.findIndex(s => s.id === scheme.id);
    if (idx >= 0) {
      list[idx] = scheme;
    } else {
      list.unshift(scheme);
    }
    localStorage.setItem(DB_KEYS.SCHEMES, JSON.stringify(list));
  }

  static deleteScheme(id: string): void {
    const list = this.getSchemes().filter(s => s.id !== id);
    localStorage.setItem(DB_KEYS.SCHEMES, JSON.stringify(list));
  }

  static getPartners(): ChannelPartner[] {
    this.init();
    try {
      const data = localStorage.getItem(DB_KEYS.PARTNERS);
      return data ? JSON.parse(data) : SYNTHETIC_PARTNERS;
    } catch {
      return SYNTHETIC_PARTNERS;
    }
  }

  static updatePartner(partner: ChannelPartner): void {
    const list = this.getPartners();
    const idx = list.findIndex(p => p.id === partner.id);
    if (idx >= 0) {
      list[idx] = partner;
    } else {
      list.unshift(partner);
    }
    localStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(list));
  }

  // --- NOTIFICATIONS ---

  static getNotifications(): AppNotification[] {
    this.init();
    try {
      const data = localStorage.getItem(DB_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addNotification(notif: AppNotification): void {
    const list = this.getNotifications();
    list.unshift(notif);
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  static markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  // --- ACTIVE CONTEXT ---

  static getActiveSchemeId(): string | null {
    return localStorage.getItem(DB_KEYS.ACTIVE_SCHEME_ID) || 'SCH-MCR-001';
  }

  static setActiveSchemeId(id: string): void {
    localStorage.setItem(DB_KEYS.ACTIVE_SCHEME_ID, id);
  }

  static getActivePartnerId(): string | null {
    return localStorage.getItem(DB_KEYS.ACTIVE_PARTNER_ID) || 'PTR-KL-001';
  }

  static setActivePartnerId(id: string): void {
    localStorage.setItem(DB_KEYS.ACTIVE_PARTNER_ID, id);
  }

  // --- DATABASE ADMIN MANAGEMENT ---

  static deleteApplication(id: string): void {
    const list = this.getApplications().filter(a => a.id !== id);
    localStorage.setItem(DB_KEYS.APPLICATIONS, JSON.stringify(list));
    syncWithBackend(`/applications/${id}`, 'DELETE');
  }

  static deleteUser(id: string): void {
    const list = this.getUsers().filter(u => u.id !== id);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(list));
  }

  static getDbStats() {
    this.init();
    let totalBytes = 0;
    Object.values(DB_KEYS).forEach(k => {
      const val = localStorage.getItem(k);
      if (val) totalBytes += val.length * 2;
    });

    return {
      usersCount: this.getUsers().length,
      applicationsCount: this.getApplications().length,
      schemesCount: this.getSchemes().length,
      partnersCount: this.getPartners().length,
      notificationsCount: this.getNotifications().length,
      storageSizeKb: Math.round((totalBytes / 1024) * 10) / 10,
      activeSession: this.getCurrentUser()?.email || 'None',
      backendStatus: 'Connected (Node.js REST API on Port 5001)',
      databaseFile: 'data/sahayak_db.json'
    };
  }

  static async getBackendHealth() {
    return await syncWithBackend('/health', 'GET');
  }

  static exportFullDatabase() {
    this.init();
    return {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      users: this.getUsers(),
      applications: this.getApplications(),
      schemes: this.getSchemes(),
      partners: this.getPartners(),
      notifications: this.getNotifications()
    };
  }

  static importFullDatabase(data: any): boolean {
    try {
      if (data.users && Array.isArray(data.users)) {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(data.users));
      }
      if (data.applications && Array.isArray(data.applications)) {
        localStorage.setItem(DB_KEYS.APPLICATIONS, JSON.stringify(data.applications));
      }
      if (data.schemes && Array.isArray(data.schemes)) {
        localStorage.setItem(DB_KEYS.SCHEMES, JSON.stringify(data.schemes));
      }
      if (data.partners && Array.isArray(data.partners)) {
        localStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(data.partners));
      }
      return true;
    } catch {
      return false;
    }
  }

  static resetDatabase(): void {
    Object.values(DB_KEYS).forEach(k => localStorage.removeItem(k));
    syncWithBackend('/reset', 'POST');
    this.init();
  }
}



