import { Scheme } from '../types/scheme';
import { ChannelPartner } from '../types/partner';
import { UserProfile } from '../types/user';
import { Application, ApplicationStatus } from '../types/application';
import { AppNotification } from '../types/common';
import { SYNTHETIC_SCHEMES } from '../data/schemes';
import { SYNTHETIC_PARTNERS } from '../data/partners';
import { DEMO_PERSONAS } from '../data/users';
import { SEEDED_APPLICATIONS } from '../data/applications';

const STORAGE_KEYS = {
  SCHEMES: 'sahayak_schemes_v1',
  PARTNERS: 'sahayak_partners_v1',
  APPLICATIONS: 'sahayak_applications_v1',
  CURRENT_USER: 'sahayak_current_user_v1',
  NOTIFICATIONS: 'sahayak_notifications_v1',
  ACTIVE_SCHEME_ID: 'sahayak_active_scheme_id_v1',
  ACTIVE_PARTNER_ID: 'sahayak_active_partner_id_v1',
  USER_ROLE: 'sahayak_user_role_v1'
};

export class StorageService {
  static init() {
    if (!localStorage.getItem(STORAGE_KEYS.SCHEMES)) {
      localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(SYNTHETIC_SCHEMES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(SYNTHETIC_PARTNERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEEDED_APPLICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to Persona A (Anjali)
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_PERSONAS.anjali));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER_ROLE)) {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'citizen');
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      const initialNotifs: AppNotification[] = [
        {
          id: 'notif-1',
          title: '3 Suitable Schemes Matched',
          message: 'Based on your tailoring venture profile, 3 high-compatibility schemes were identified.',
          type: 'success',
          timestamp: '10 mins ago',
          read: false,
          actionLink: '/find-scheme'
        },
        {
          id: 'notif-2',
          title: 'Application Forwarded to Partner',
          message: 'Your application SAH-2026-92841 is under technical review with KSBCDC Palakkad.',
          type: 'info',
          timestamp: '1 day ago',
          read: false,
          actionLink: '/applications'
        },
        {
          id: 'notif-3',
          title: 'Document Readiness 78%',
          message: 'Upload your verified tailoring machinery quotation to reach 100% readiness.',
          type: 'warning',
          timestamp: '2 days ago',
          read: true,
          actionLink: '/documents'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifs));
    }
  }

  // Schemes
  static getSchemes(): Scheme[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEMES);
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
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(list));
  }

  static deleteScheme(id: string): void {
    const list = this.getSchemes().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(list));
  }

  // Partners
  static getPartners(): ChannelPartner[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PARTNERS);
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
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(list));
  }

  // Applications
  static getApplications(): Application[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : SEEDED_APPLICATIONS;
    } catch {
      return SEEDED_APPLICATIONS;
    }
  }

  static createApplication(app: Application): void {
    const list = this.getApplications();
    list.unshift(app);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));

    // Also add notification
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Application Submitted!',
      message: `Your application ${app.id} for ${app.schemeName} was submitted successfully.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      actionLink: '/applications'
    });
  }

  static updateApplicationStatus(id: string, status: ApplicationStatus, remarks?: string): void {
    const list = this.getApplications();
    const idx = list.findIndex(a => a.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      list[idx].updatedAt = new Date().toISOString();
      if (remarks) list[idx].remarks = remarks;

      // Update timeline
      const currentIdx = list[idx].timeline.findIndex(t => t.status === status);
      if (currentIdx >= 0) {
        list[idx].timeline.forEach((t, i) => {
          t.completed = i <= currentIdx;
          t.current = i === currentIdx;
          if (i === currentIdx && !t.timestamp) {
            t.timestamp = new Date().toISOString();
          }
        });
      }

      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
    }
  }

  // User Profile
  static getCurrentUser(): UserProfile {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : DEMO_PERSONAS.anjali;
    } catch {
      return DEMO_PERSONAS.anjali;
    }
  }

  static saveCurrentUser(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  // Notifications
  static getNotifications(): AppNotification[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addNotification(notif: AppNotification): void {
    const list = this.getNotifications();
    list.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  static markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  // User Role (Citizen vs Admin)
  static getUserRole(): 'citizen' | 'admin' {
    return (localStorage.getItem(STORAGE_KEYS.USER_ROLE) as 'citizen' | 'admin') || 'citizen';
  }

  static setUserRole(role: 'citizen' | 'admin'): void {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  }

  // Active Selected Scheme & Partner for application workflow
  static getActiveSchemeId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SCHEME_ID) || 'SCH-MCR-001';
  }

  static setActiveSchemeId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SCHEME_ID, id);
  }

  static getActivePartnerId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PARTNER_ID) || 'PTR-KL-001';
  }

  static setActivePartnerId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PARTNER_ID, id);
  }

  static resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(SYNTHETIC_SCHEMES));
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(SYNTHETIC_PARTNERS));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEEDED_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_PERSONAS.anjali));
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'citizen');
  }
}
