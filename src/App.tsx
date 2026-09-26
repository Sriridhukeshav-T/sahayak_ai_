import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';

// Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { FloatingAssistant } from './components/ai/FloatingAssistant';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { OnboardingWizard } from './pages/onboarding/OnboardingWizard';
import { DashboardPage } from './pages/citizen/DashboardPage';
import { FindMySchemePage } from './pages/citizen/FindMySchemePage';
import { SchemeExplorerPage } from './pages/citizen/SchemeExplorerPage';
import { SchemeDetailPage } from './pages/citizen/SchemeDetailPage';
import { AffordabilityPage } from './pages/citizen/AffordabilityPage';
import { DocumentReadinessPage } from './pages/citizen/DocumentReadinessPage';
import { FindPartnerPage } from './pages/citizen/FindPartnerPage';
import { FundingPlannerPage } from './pages/citizen/FundingPlannerPage';
import { ApplicationWorkflowPage } from './pages/citizen/ApplicationWorkflowPage';
import { MyApplicationsPage } from './pages/citizen/MyApplicationsPage';
import { FinancialProfilePage } from './pages/citizen/FinancialProfilePage';
import { FinancialLiteracyPage } from './pages/citizen/FinancialLiteracyPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminSchemesPage } from './pages/admin/AdminSchemesPage';
import { AdminPartnersPage } from './pages/admin/AdminPartnersPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminDatabasePage } from './pages/admin/AdminDatabasePage';

// Protected Route wrapper for citizen portal
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin Route wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Layout wrapper for authenticated / portal routes
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header onOpenSearch={() => setIsSearchOpen(true)} />
        <div className="flex max-w-7xl mx-auto w-full">
          {isAuthenticated && <Sidebar />}
          <main className="flex-1 w-full overflow-x-hidden min-h-[calc(100vh-130px)]">
            {children}
          </main>
        </div>
      </div>
      <Footer />
      <FloatingAssistant />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <AppDataProvider>
            <Router>
              <AppLayout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/schemes" element={<SchemeExplorerPage />} />
                  <Route path="/schemes/:id" element={<SchemeDetailPage />} />
                  <Route path="/literacy" element={<FinancialLiteracyPage />} />

                  {/* Protected Citizen Portal Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/find-scheme" element={<ProtectedRoute><FindMySchemePage /></ProtectedRoute>} />
                  <Route path="/affordability" element={<ProtectedRoute><AffordabilityPage /></ProtectedRoute>} />
                  <Route path="/documents" element={<ProtectedRoute><DocumentReadinessPage /></ProtectedRoute>} />
                  <Route path="/partners" element={<ProtectedRoute><FindPartnerPage /></ProtectedRoute>} />
                  <Route path="/funding-planner" element={<ProtectedRoute><FundingPlannerPage /></ProtectedRoute>} />
                  <Route path="/apply" element={<ProtectedRoute><ApplicationWorkflowPage /></ProtectedRoute>} />
                  <Route path="/applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><FinancialProfilePage /></ProtectedRoute>} />
                  <Route path="/onboarding" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />

                  {/* Protected Admin Console Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                  <Route path="/admin/schemes" element={<AdminRoute><AdminSchemesPage /></AdminRoute>} />
                  <Route path="/admin/partners" element={<AdminRoute><AdminPartnersPage /></AdminRoute>} />
                  <Route path="/admin/applications" element={<AdminRoute><AdminApplicationsPage /></AdminRoute>} />
                  <Route path="/admin/database" element={<AdminRoute><AdminDatabasePage /></AdminRoute>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </Router>
          </AppDataProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}

export default App;
