import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { GuestDashboard } from './components/GuestDashboard';
import { Header } from './components/Header';
import { SystemProvider } from './context/SystemContext';
import { AiModuleStatus } from './components/AiModuleStatus';
import { BlockchainOverview } from './components/BlockchainOverview';
import { FederationStatus } from './components/FederationStatus';
import { HealthMonitor } from './components/HealthMonitor';
import { LogViewer } from './components/LogViewer';
import { QuantumMeshVisualizer } from './components/QuantumMeshVisualizer';
import { RootAuthorityPanel } from './components/RootAuthorityPanel';
import { NotificationContainer } from './components/NotificationContainer';
import { NextGenDashboardLayout } from './components/NextGenDashboardLayout';
import { UserManagementPanel } from './components/UserManagementPanel';
import { AnaQMLMetrics } from './components/AnaQMLMetrics';
import { TaskManagementPanel } from './components/TaskManagementPanel';
import { TokenomicsDashboard } from './components/TokenomicsDashboard';
import { PiNetworkSync } from './components/PiNetworkSync';
import { BlockExplorerPanel } from './components/BlockExplorerPanel';
import { WalletPanel } from './components/WalletPanel';
import { SystemSyncStatus } from './components/SystemSyncStatus';
import { NuNVaultPanel } from './components/NuNVaultPanel';
import { UserProfilePanel } from './components/UserProfilePanel';
import { SimulationsPanel } from './components/SimulationsPanel';
import { DashboardMapLayout } from './components/DashboardMapLayout';
import { TokenPriceTicker } from './components/TokenPriceTicker';
import { AnomalyDashboard } from './components/AnomalyDashboard';
import { AnaQMLPanel } from './components/AnaQMLPanel';
import { DevicePanel } from './components/DevicePanel';
import { TokenAllocationPanel } from './components/TokenAllocationPanel';
import { FederationControlPanel } from './components/FederationControlPanel';
import { DataTransferMonitorCard } from './components/vault/DataTransferMonitorCard';
import { NodeManagementCard } from './components/vault/NodeManagementCard';
import { NetworkOrchestrationCard } from './components/vault/NetworkOrchestrationCard';

export type View = 'dashboard' | 'users' | 'tasks' | 'blockchain' | 'vault' | 'profile' | 'simulations' | 'map' | 'anomalies' | 'qml';

const RootDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            {/* Priority Section based on Ana's recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <DataTransferMonitorCard />
              <NetworkOrchestrationCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <NextGenDashboardLayout />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <TokenPriceTicker />
                <PiNetworkSync />
                <SystemSyncStatus />
                <DevicePanel />
                <WalletPanel />
              </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                 <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <HealthMonitor />
                      <FederationStatus />
                      <AiModuleStatus />
                      <BlockchainOverview />
                      <AnaQMLMetrics/>
                      <TokenomicsDashboard />
                    </div>
                 </div>
                 <div className="lg:col-span-1 space-y-6">
                     <RootAuthorityPanel />
                     <TokenAllocationPanel />
                     <FederationControlPanel />
                 </div>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <QuantumMeshVisualizer />
                </div>
                <LogViewer />
            </div>

            {/* New section for Node Join Requests */}
            <div className="mt-6">
              <NodeManagementCard />
            </div>
          </>
        );
      case 'users':
        return <UserManagementPanel />;
      case 'tasks':
        return <TaskManagementPanel />;
      case 'blockchain':
        return <BlockExplorerPanel />;
      case 'vault':
        return <NuNVaultPanel />;
      case 'profile':
        return <UserProfilePanel />;
      case 'simulations':
        return <SimulationsPanel />;
      case 'map':
        return <DashboardMapLayout />;
      case 'anomalies':
        return <AnomalyDashboard />;
      case 'qml':
        return <AnaQMLPanel />;
      default:
        return null;
    }
  };

  const NavItem: React.FC<{ view: View; label: string }> = ({ view, label }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeView === view ? 'bg-nun-primary text-nun-darker' : 'text-gray-300 hover:bg-nun-light/50'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-nun-darker text-gray-200 min-h-screen font-sans">
      <Header onLogout={onLogout} userRole="root" setActiveView={setActiveView} />
      <nav className="bg-nun-dark/50 p-2 sticky top-16 z-30 backdrop-blur-sm">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-2">
          <NavItem view="dashboard" label="Dashboard" />
          <NavItem view="anomalies" label="Anomaly Detection" />
          <NavItem view="map" label="System Map" />
          <NavItem view="qml" label="AnaQML" />
          <NavItem view="users" label="User Management" />
          <NavItem view="tasks" label="Tasks" />
          <NavItem view="blockchain" label="Block Explorer" />
          <NavItem view="vault" label="NuN Vault" />
          <NavItem view="simulations" label="Simulations" />
          <NavItem view="profile" label="My Profile" />
        </div>
      </nav>
      <main className="p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<'root' | 'guest' | null>(null);

  const handleLogin = (role: 'root' | 'guest') => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const renderContent = () => {
    if (userRole === 'root') {
      return <RootDashboard onLogout={handleLogout} />;
    }
    if (userRole === 'guest') {
      return <GuestDashboard onLogout={handleLogout} />;
    }
    return <LoginScreen onLoginSuccess={handleLogin} />;
  };

  return (
    <SystemProvider>
        {renderContent()}
        <NotificationContainer />
    </SystemProvider>
  );
};

export default App;