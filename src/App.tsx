import React, { useState, useEffect } from 'react';
import { LeedoProvider, useLeedo } from './context/LeedoContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { ChildList } from './components/children/ChildList';
import { SheltersView } from './components/views/SheltersView';
import { SixWeekAlertsView } from './components/views/SixWeekAlertsView';
import { FamilyTracingView } from './components/views/FamilyTracingView';
import { ReintegrationView } from './components/views/ReintegrationView';
import { ReferralsView } from './components/views/ReferralsView';
import { FollowUpsView } from './components/views/FollowUpsView';
import { LeftWithoutNoticeView } from './components/views/LeftWithoutNoticeView';
import { ClinicalView } from './components/views/ClinicalView';
import { ReportsView } from './components/views/ReportsView';
import { DocumentsView } from './components/views/DocumentsView';
import { NotificationsView } from './components/views/NotificationsView';
import { UsersView } from './components/views/UsersView';
import { AuditView } from './components/views/AuditView';
import { SettingsView } from './components/views/SettingsView';
import { SUSView } from './components/views/SUSView';
import { VocationalView } from './components/views/VocationalView';
import { UserManualView } from './components/views/UserManualView';
import { LoginModal } from './components/auth/LoginModal';
import { NewChildRegistrationModal } from './components/children/NewChildRegistrationModal';
import { ChildProfileModal } from './components/children/ChildProfileModal';
import { ActionModals } from './components/modals/ActionModals';

const AppContent: React.FC = () => {
  const { activeTab, currentUser } = useLeedo();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Retain logged in state in session
    return sessionStorage.getItem('leedo_auth_session') === 'true';
  });

  const handleAuthenticated = () => {
    sessionStorage.setItem('leedo_auth_session', 'true');
    setIsAuthenticated(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'children':
        return <ChildList />;
      case 'shelters':
        return <SheltersView />;
      case 'six_weeks':
        return <SixWeekAlertsView />;
      case 'tracing':
        return <FamilyTracingView />;
      case 'health':
        return <ClinicalView mode="health" />;
      case 'counseling':
        return <ClinicalView mode="counseling" />;
      case 'reintegration':
        return <ReintegrationView />;
      case 'referrals':
        return <ReferralsView />;
      case 'follow_ups':
        return <FollowUpsView />;
      case 'left_without_notice':
        return <LeftWithoutNoticeView />;
      case 'sus':
        return <SUSView />;
      case 'vocational':
        return <VocationalView />;
      case 'user_manual':
        return <UserManualView />;
      case 'notifications':
        return <NotificationsView />;
      case 'reports':
        return <ReportsView />;
      case 'documents':
        return <DocumentsView />;
      case 'users':
        return <UsersView />;
      case 'audit':
        return <AuditView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      {/* Top Fixed Navigation */}
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-57px)]">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Security Gate: Enforces Master Passcode & Staff Verification on First Load */}
      {!isAuthenticated && (
        <LoginModal onAuthenticated={handleAuthenticated} />
      )}

      {/* Global Modals */}
      <NewChildRegistrationModal />
      <ChildProfileModal />
      <ActionModals />
    </div>
  );
};

export default function App() {
  return (
    <LeedoProvider>
      <AppContent />
    </LeedoProvider>
  );
}
