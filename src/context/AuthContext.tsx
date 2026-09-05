import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UploadedDocument } from '../types/user';
import { DEMO_PERSONAS } from '../data/users';
import { StorageService } from '../services/storageService';
import { detectUploadedDocumentType } from '../services/documentService';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  userRole: 'citizen' | 'admin';
  selectDemoPersona: (personaKey: 'anjali' | 'ramesh' | 'priya') => void;
  login: (identifier: string, pass: string) => boolean;
  signup: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  setUserRole: (role: 'citizen' | 'admin') => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  uploadUserDocument: (fileName: string, fileSize?: string) => UploadedDocument;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => StorageService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setRoleState] = useState<'citizen' | 'admin'>(() => StorageService.getUserRole());

  useEffect(() => {
    StorageService.saveCurrentUser(user);
  }, [user]);

  useEffect(() => {
    StorageService.setUserRole(userRole);
  }, [userRole]);

  const selectDemoPersona = (personaKey: 'anjali' | 'ramesh' | 'priya') => {
    const selected = DEMO_PERSONAS[personaKey];
    if (selected) {
      setUser({ ...selected });
      setIsAuthenticated(true);
      setRoleState('citizen');
      StorageService.saveCurrentUser(selected);
      // Auto set active scheme based on persona
      if (personaKey === 'anjali') StorageService.setActiveSchemeId('SCH-MCR-001');
      if (personaKey === 'ramesh') StorageService.setActiveSchemeId('SCH-AGR-001');
      if (personaKey === 'priya') StorageService.setActiveSchemeId('SCH-EDU-001');
    }
  };

  const login = (identifier: string, _pass: string): boolean => {
    // For prototype, allow login with any demo email or credentials
    if (identifier.toLowerCase().includes('admin')) {
      setRoleState('admin');
      return true;
    }
    // If identifier matches Ramesh or Priya
    if (identifier.toLowerCase().includes('ramesh')) {
      selectDemoPersona('ramesh');
      return true;
    }
    if (identifier.toLowerCase().includes('priya')) {
      selectDemoPersona('priya');
      return true;
    }
    // Default to Anjali
    selectDemoPersona('anjali');
    return true;
  };

  const signup = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      ...DEMO_PERSONAS.anjali,
      id: `USR-${Date.now()}`,
      name: userData.name || 'New Entrepreneur',
      email: userData.email || 'user@sahayak.ai',
      mobile: userData.mobile || '+91 98000 00000',
      state: userData.state || 'Kerala',
      district: userData.district || 'Palakkad',
      preferredLanguage: userData.preferredLanguage || 'en',
      role: 'citizen',
      isDemo: false,
      uploadedDocuments: []
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setRoleState('citizen');
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const setUserRole = (role: 'citizen' | 'admin') => {
    setRoleState(role);
    setUser(prev => ({ ...prev, role }));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const uploadUserDocument = (fileName: string, fileSize = '1.2 MB'): UploadedDocument => {
    const detection = detectUploadedDocumentType(fileName);
    const newDoc: UploadedDocument = {
      id: `DOC-${Date.now()}`,
      name: detection.type,
      type: detection.type,
      fileName,
      fileSize,
      uploadedAt: new Date().toISOString(),
      status: detection.status,
      detectionSummary: detection.detectionSummary
    };

    setUser(prev => ({
      ...prev,
      uploadedDocuments: [newDoc, ...prev.uploadedDocuments.filter(d => d.type !== newDoc.type)]
    }));

    return newDoc;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userRole,
        selectDemoPersona,
        login,
        signup,
        logout,
        setUserRole,
        updateUserProfile,
        uploadUserDocument
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
