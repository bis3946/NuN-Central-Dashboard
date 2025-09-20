import React from 'react';
import { Header } from './Header';
import { AiModuleStatus } from './AiModuleStatus';
import { BlockchainOverview } from './BlockchainOverview';
import { FederationStatus } from './FederationStatus';
import { QuantumMeshVisualizer } from './QuantumMeshVisualizer';
import { HealthMonitor } from './HealthMonitor';
import { LogViewer } from './LogViewer';
import { TokenomicsDashboard } from './TokenomicsDashboard';
import { AnaQMLMetrics } from './AnaQMLMetrics';
import { TokenPriceTicker } from './TokenPriceTicker';

interface GuestDashboardProps {
  onLogout: () => void;
}

export const GuestDashboard: React.FC<GuestDashboardProps> = ({ onLogout }) => {
    return (
        <div className="bg-nun-darker text-gray-200 min-h-screen font-sans">
            <Header onLogout={onLogout} userRole="guest" />
            <main className="p-4 sm:p-6 lg:p-8 space-y-6">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-nun-primary tracking-wider">System Overview</h2>
                    <p className="text-sm text-gray-400">You are viewing the dashboard in Guest Mode. Controls are disabled.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <QuantumMeshVisualizer />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AiModuleStatus />
                            <BlockchainOverview />
                            <HealthMonitor />
                            <FederationStatus />
                             <AnaQMLMetrics />
                            <TokenomicsDashboard />
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <TokenPriceTicker />
                        <LogViewer />
                    </div>
                </div>
            </main>
        </div>
    );
};