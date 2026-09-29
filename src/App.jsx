import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useVehicle } from './context/VehicleContext';

// Layout Components
import { DemoControlBar } from './components/layout/DemoControlBar';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { AlertModal } from './components/common/AlertModal';

// Views
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { VehicleSetupView } from './views/VehicleSetupView';
import { HomeDashboardView } from './views/HomeDashboardView';
import { VehicleHealthView } from './views/VehicleHealthView';
import { BatteryHealthView } from './views/BatteryHealthView';
import { AIPredictionView } from './views/AIPredictionView';
import { AnalyticsView } from './views/AnalyticsView';
import { TripHistoryView } from './views/TripHistoryView';
import { NotificationsView } from './views/NotificationsView';
import { RecommendationsView } from './views/RecommendationsView';
import { PredictionHistoryView } from './views/PredictionHistoryView';
import { ProfileSettingsView } from './views/ProfileSettingsView';

export function App() {
  const { isAuthenticated, vehicleSetupComplete } = useAuth();
  const { activeAlertModal, setActiveAlertModal, setSelectedFaultDetail, currentPredictionState } = useVehicle();

  const [currentTab, setCurrentTab] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication & Onboarding Guards
  if (!isAuthenticated) {
    if (currentTab === 'register') {
      return <RegisterView onNavigate={setCurrentTab} />;
    }
    return <LoginView onNavigate={setCurrentTab} />;
  }

  if (!vehicleSetupComplete || currentTab === 'vehicle-setup') {
    return <VehicleSetupView onNavigate={setCurrentTab} />;
  }

  const handleNavigate = (tabId) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAlertViewDetails = () => {
    const primaryFault = currentPredictionState?.faults?.[0];
    if (primaryFault) setSelectedFaultDetail(primaryFault);
    handleNavigate('prediction');
  };

  // Render view router
  const renderCurrentView = () => {
    switch (currentTab) {
      case 'home':
        return <HomeDashboardView onNavigate={handleNavigate} />;
      case 'vehicle':
        return <VehicleHealthView />;
      case 'battery':
        return <BatteryHealthView />;
      case 'prediction':
        return <AIPredictionView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'trips':
        return <TripHistoryView />;
      case 'notifications':
        return <NotificationsView onNavigate={handleNavigate} />;
      case 'recommendations':
        return <RecommendationsView onNavigate={handleNavigate} />;
      case 'prediction-history':
        return <PredictionHistoryView />;
      case 'profile':
        return <ProfileSettingsView onNavigate={handleNavigate} />;
      default:
        return <HomeDashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Global Demo State Simulator Controls */}
      <DemoControlBar />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onNavigate={handleNavigate}
        currentTab={currentTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* 3. Mobile Slide-out Menu (when hamburger is tapped on small screens) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="font-mono font-bold text-white text-lg">EV GUARDIAN MENU</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-4 overflow-y-auto">
            {[
              { id: 'home', label: 'Home Dashboard' },
              { id: 'vehicle', label: 'Vehicle Health' },
              { id: 'battery', label: 'Battery Health' },
              { id: 'prediction', label: 'AI Fault Prediction' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'trips', label: 'Trip History' },
              { id: 'recommendations', label: 'Recommendations' },
              { id: 'prediction-history', label: 'Prediction History' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'profile', label: 'Profile & Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`py-3 px-4 rounded-xl text-left font-semibold text-sm transition-all ${
                  currentTab === item.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Main Application Body with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {renderCurrentView()}
        </main>
      </div>

      {/* 5. Mobile Bottom Tab Bar */}
      <BottomNavigation
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />

      {/* 6. Reactive Predictive Alert Modal */}
      {activeAlertModal && (
        <AlertModal
          isOpen={Boolean(activeAlertModal)}
          onClose={() => setActiveAlertModal(null)}
          onViewDetails={handleAlertViewDetails}
          severity={activeAlertModal.severity}
          title={activeAlertModal.title}
          riskProbability={activeAlertModal.riskProbability}
          predictedIssue={activeAlertModal.predictedIssue}
          recommendation={activeAlertModal.recommendation}
        />
      )}
    </div>
  );
}

export default App;
