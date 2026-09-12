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
  updateApplicationStatus: (id: string, status: ApplicationStatus, remarks?: string) => void;
  updatePartner: (partner: ChannelPartner) => void;
  addScheme: (scheme: Scheme) => void;
  updateScheme: (scheme: Scheme) => void;
  deleteScheme: (id: string) => void;
  markNotificationsAsRead: () => void;
  resetDemoData: () => void;
  refreshAppData: () => void;
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

  const refreshAppData = () => {
    setSchemes(StorageService.getSchemes());
    setPartners(StorageService.getPartners());
    setApplications(StorageService.getApplications());
    setNotifications(StorageService.getNotifications());
  };

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
