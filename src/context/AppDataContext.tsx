import React, { createContext, useContext, useState } from 'react';
import { Scheme } from '../types/scheme';
import { ChannelPartner } from '../types/partner';
import { Application, ApplicationStatus } from '../types/application';
import { AppNotification } from '../types/common';
import { StorageService } from '../services/storageService';

interface AppDataContextType {
  schemes: Scheme[];
  partners: ChannelPartner[];
  applications: Application[];
  notifications: AppNotification[];
  activeScheme: Scheme | null;
  activePartner: ChannelPartner | null;
  setActiveSchemeId: (id: string) => void;
  setActivePartnerId: (id: string) => void;
  submitApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => Application | null;
  updateApplicationStatus: (id: string, status: ApplicationStatus, remarks?: string) => void;
  updatePartner: (partner: ChannelPartner) => void;
  addScheme: (scheme: Scheme) => void;
  updateScheme: (scheme: Scheme) => void;
  deleteScheme: (id: string) => void;
  markNotificationsAsRead: () => void;
  resetDemoData: () => void;
  refreshAppData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schemes, setSchemes] = useState<Scheme[]>(() => StorageService.getSchemes());
  const [partners, setPartners] = useState<ChannelPartner[]>(() => StorageService.getPartners());
  const [applications, setApplications] = useState<Application[]>(() => StorageService.getApplications());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => StorageService.getNotifications());

  const [activeSchemeId, setActiveSchemeIdState] = useState<string>(() => StorageService.getActiveSchemeId() || 'SCH-MCR-001');
  const [activePartnerId, setActivePartnerIdState] = useState<string>(() => StorageService.getActivePartnerId() || 'PTR-KL-001');

  const activeScheme = schemes.find(s => s.id === activeSchemeId) || schemes[0] || null;
  const activePartner = partners.find(p => p.id === activePartnerId) || partners[0] || null;

  const setActiveSchemeId = (id: string) => {
    setActiveSchemeIdState(id);
    StorageService.setActiveSchemeId(id);
  };

  const setActivePartnerId = (id: string) => {
    setActivePartnerIdState(id);
    StorageService.setActivePartnerId(id);
  };

  const submitApplication = (app: Application) => {
    StorageService.createApplication(app);
    setApplications(StorageService.getApplications());
    setNotifications(StorageService.getNotifications());
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    const updated = StorageService.updateApplication(id, updates);
    setApplications(StorageService.getApplications());
    return updated;
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, remarks?: string) => {
    StorageService.updateApplicationStatus(id, status, remarks);
    setApplications(StorageService.getApplications());
  };

  const updatePartner = (partner: ChannelPartner) => {
    StorageService.updatePartner(partner);
    setPartners(StorageService.getPartners());
  };

  const addScheme = (scheme: Scheme) => {
    StorageService.saveScheme(scheme);
    setSchemes(StorageService.getSchemes());
  };

  const updateScheme = (scheme: Scheme) => {
    StorageService.saveScheme(scheme);
    setSchemes(StorageService.getSchemes());
  };

  const deleteScheme = (id: string) => {
    StorageService.deleteScheme(id);
    setSchemes(StorageService.getSchemes());
  };

  const markNotificationsAsRead = () => {
    StorageService.markAllNotificationsAsRead();
    setNotifications(StorageService.getNotifications());
  };

  const resetDemoData = () => {
    StorageService.resetToDefaults();
    setSchemes(StorageService.getSchemes());
    setPartners(StorageService.getPartners());
    setApplications(StorageService.getApplications());
    setNotifications(StorageService.getNotifications());
  };

  const refreshAppData = async () => {
    // 1. Immediately refresh from local cache
    setSchemes(StorageService.getSchemes());
    setPartners(StorageService.getPartners());
    setApplications(StorageService.getApplications());
    setNotifications(StorageService.getNotifications());

    // 2. Sync with backend API
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const backendApps: Application[] = await res.json();
        if (Array.isArray(backendApps) && backendApps.length > 0) {
          const localApps = StorageService.getApplications();
          const map = new Map<string, Application>();
          backendApps.forEach(a => map.set(a.id, a));
          localApps.forEach(a => {
            if (!map.has(a.id)) map.set(a.id, a);
          });
          const merged = Array.from(map.values());
          localStorage.setItem('sahayak_real_applications_v2', JSON.stringify(merged));
          setApplications(merged);
        }
      }
    } catch {
      // offline fallback
    }
  };

  React.useEffect(() => {
    refreshAppData();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        schemes,
        partners,
        applications,
        notifications,
        activeScheme,
        activePartner,
        setActiveSchemeId,
        setActivePartnerId,
        submitApplication,
        updateApplication,
        updateApplicationStatus,
        updatePartner,
        addScheme,
        updateScheme,
        deleteScheme,
        markNotificationsAsRead,
        resetDemoData,
        refreshAppData
      }}
    >
      {children}
    </AppDataContext.Provider>
  );

};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
