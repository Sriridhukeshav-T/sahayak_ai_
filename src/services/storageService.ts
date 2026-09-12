import { Scheme } from '../types/scheme';
import { ChannelPartner } from '../types/partner';
import { UserProfile } from '../types/user';
import { Application, ApplicationStatus } from '../types/application';
import { AppNotification } from '../types/common';
import { DbService } from './dbService';

export class StorageService {
  static init() {
    // DbService handles internal initialization
  }

  // Schemes
  static getSchemes(): Scheme[] {
    return DbService.getSchemes();
  }

  static saveScheme(scheme: Scheme): void {
    DbService.saveScheme(scheme);
  }

  static deleteScheme(id: string): void {
    DbService.deleteScheme(id);
  }

  // Partners
  static getPartners(): ChannelPartner[] {
    return DbService.getPartners();
  }

  static updatePartner(partner: ChannelPartner): void {
    DbService.updatePartner(partner);
  }

  // Applications
  static getApplications(userId?: string): Application[] {
    return DbService.getApplications(userId);
  }

  static createApplication(app: Application): void {
    DbService.createApplication(app);
  }

  static updateApplicationStatus(id: string, status: ApplicationStatus, remarks?: string): void {
    DbService.updateApplicationStatus(id, status, remarks);
  }

  // User Profile
  static getCurrentUser(): UserProfile | null {
    return DbService.getCurrentUser();
  }

  static saveCurrentUser(user: UserProfile): void {
    DbService.updateUser(user.id, user);
  }

  // Notifications
  static getNotifications(): AppNotification[] {
    return DbService.getNotifications();
  }

  static addNotification(notif: AppNotification): void {
    DbService.addNotification(notif);
  }

  static markAllNotificationsAsRead(): void {
    DbService.markAllNotificationsAsRead();
  }

  // User Role
  static getUserRole(): 'citizen' | 'admin' {
    const user = DbService.getCurrentUser();
    return user ? user.role : 'citizen';
  }

  static setUserRole(_role: 'citizen' | 'admin'): void {
    // Role is bound to actual logged-in user account in real database
  }

  // Active Selected Scheme & Partner
  static getActiveSchemeId(): string | null {
    return DbService.getActiveSchemeId();
  }

  static setActiveSchemeId(id: string): void {
    DbService.setActiveSchemeId(id);
  }

  static getActivePartnerId(): string | null {
    return DbService.getActivePartnerId();
  }

  static setActivePartnerId(id: string): void {
    DbService.setActivePartnerId(id);
  }

  static resetToDefaults(): void {
    // Not needed in real mode
  }
}


