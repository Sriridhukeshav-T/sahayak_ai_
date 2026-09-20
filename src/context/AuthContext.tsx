import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UploadedDocument } from '../types/user';
import { DbService } from '../services/dbService';
import { detectUploadedDocumentType } from '../services/documentService';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
}

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  userRole: 'citizen' | 'admin';
  login: (identifier: string, pass: string) => AuthResponse;
  signup: (userData: Partial<UserProfile> & { password: string }) => AuthResponse;
  logout: () => void;
  setUserRole: (role: 'citizen' | 'admin') => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  uploadUserDocument: (fileName: string, fileSize?: string) => UploadedDocument;
}

const GUEST_USER: UserProfile = {
  id: 'GUEST',
  name: 'Citizen Guest',
  email: '',
  mobile: '',
  age: 0,
  gender: 'Prefer not to say',
  state: '',
  district: '',
  pinCode: '',
  income: 0,
  monthlyExpenses: 0,
  existingLoans: false,
  existingEMI: 0,
  goal: '',
  projectType: '',
  purpose: '',
  projectCost: 0,
  loanRequirement: 0,
  ownContribution: 0,
  expectedBusinessIncome: 0,
  experienceYears: 0,
  preferredLanguage: 'en',
  educationStatus: '12th Pass',
  role: 'citizen',
  uploadedDocuments: []
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const existing = DbService.getCurrentUser();
    return existing || GUEST_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(DbService.getCurrentUser());
  });

  const [userRole, setUserRoleState] = useState<'citizen' | 'admin'>(() => {
    const existing = DbService.getCurrentUser();
    return existing ? existing.role : 'citizen';
  });

  // Re-sync if user changes
  useEffect(() => {
    if (user.id !== 'GUEST') {
      DbService.updateUser(user.id, user);
    }
  }, [user]);

  const login = (identifier: string, pass: string): AuthResponse => {
    const res = DbService.authenticate(identifier, pass);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      setUserRoleState(res.user.role);
    }
    return res;
  };

  const signup = (userData: Partial<UserProfile> & { password: string }): AuthResponse => {
    const res = DbService.registerUser(userData);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      setUserRoleState('citizen');
    }
    return res;
  };

  const logout = () => {
    DbService.clearSession();
    setUser(GUEST_USER);
    setIsAuthenticated(false);
    setUserRoleState('citizen');
  };

  const setUserRole = (role: 'citizen' | 'admin') => {
    setUserRoleState(role);
    if (user.id !== 'GUEST') {
      const updated = DbService.updateUser(user.id, { role });
      if (updated) setUser(updated);
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      if (prev.id !== 'GUEST') {
        DbService.updateUser(prev.id, next);
      }
      return next;
    });
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

    setUser(prev => {
      const updatedDocs = [newDoc, ...prev.uploadedDocuments.filter(d => d.type !== newDoc.type)];
      const next = { ...prev, uploadedDocuments: updatedDocs };
      if (prev.id !== 'GUEST') {
        DbService.updateUser(prev.id, next);
      }
      return next;
    });

    return newDoc;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userRole,
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
