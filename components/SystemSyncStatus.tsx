import React from 'react';
import { DashboardCard } from './DashboardCard';
import { useSystem } from '../context/SystemContext';
import { WifiIcon } from './icons/WifiIcon';
import { StatusIndicator } from './StatusIndicator';
import { SystemStatus } from '../types';

export const SystemSyncStatus: React.FC = () => {
    const { systemState } = useSystem();
    const { systemSync } = systemState;

    return (
        <DashboardCard title="System Sync & Device" icon={<WifiIcon />}>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Overall Sync Status</span>
                    <div className="flex items-center gap-2">
                        <span className={`font-bold ${systemSync.status === 'Synchronized' ? 'text-nun-success' : 'text-nun-warning'}`}>
                            {systemSync.status}
                        </span>
                        <StatusIndicator status={systemSync.status === 'Synchronized' ? SystemStatus.OK : SystemStatus.Warning} />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Self-Healing Protocol</span>
                    <div className="flex items-center gap-2">
                        <span className={`font-bold ${systemSync.selfHealingActive ? 'text-nun-success' : 'text-gray-500'}`}>
                            {systemSync.selfHealingActive ? 'Active' : 'Inactive'}
                        </span>
                        {systemSync.selfHealingActive ? (
                            <StatusIndicator status={SystemStatus.OK} animated={false} />
                        ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-500 shadow-[0_0_6px_rgba(107,114,128,0.5)]" title="Inactive"></div>
                        )}
                    </div>
                </div>
                <div className="border-t border-nun-light/20 my-2"></div>
                 <div className="text-xs text-gray-500 space-y-1">
                    <p className="flex justify-between">
                        <span>Target Device:</span>
                        <span className="font-mono text-gray-300">{systemSync.targetDevice.model}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Storage:</span>
                        <span className="font-mono text-gray-300">{systemSync.targetDevice.storage}</span>
                    </p>
                 </div>
            </div>
        </DashboardCard>
    );
};