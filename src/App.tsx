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

// Layout wrapper for authenticated / portal routes
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Hide sidebar/header on landing or auth pages if desired, but here we provide consistent layout
  const isAuthOrLanding = ['/', '/login', '/signup', '/onboarding'].includes(location.pathname);

  if (isAuthOrLanding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header onOpenSearch={() => setIsSearchOpen(true)} />
        <div className="flex max-w-7xl mx-auto w-full">
          <Sidebar />
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
                  {/* Public & Landing */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/onboarding" element={<OnboardingWizard />} />

                  {/* Citizen Portal Routes */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/find-scheme" element={<FindMySchemePage />} />
                  <Route path="/schemes" element={<SchemeExplorerPage />} />
                  <Route path="/affordability" element={<AffordabilityPage />} />
                  <Route path="/documents" element={<DocumentReadinessPage />} />
                  <Route path="/partners" element={<FindPartnerPage />} />
                  <Route path="/funding-planner" element={<FundingPlannerPage />} />
                  <Route path="/apply" element={<ApplicationWorkflowPage />} />
                  <Route path="/applications" element={<MyApplicationsPage />} />
                  <Route path="/profile" element={<FinancialProfilePage />} />
                  <Route path="/literacy" element={<FinancialLiteracyPage />} />

                  {/* Admin Console Routes */}
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/schemes" element={<AdminSchemesPage />} />
                  <Route path="/admin/partners" element={<AdminPartnersPage />} />
                  <Route path="/admin/applications" element={<AdminApplicationsPage />} />

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
