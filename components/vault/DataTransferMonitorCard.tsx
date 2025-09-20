import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { useSystem } from '../../context/SystemContext';
import { ArrowTrendingUpIcon } from '../icons/ArrowTrendingUpIcon';

export const DataTransferMonitorCard: React.FC = () => {
    const { systemState } = useSystem();
    const { dataTransfer } = systemState;

    return (
        <DashboardCard title="Global Free Data Transfer Monitor" icon={<ArrowTrendingUpIcon />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-xs uppercase text-gray-400">Total Transferred</p>
                    <p className="text-3xl font-mono font-bold text-nun-primary">{dataTransfer.totalTransferredGB.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">GB</p>
                </div>
                <div>
                    <p className="text-xs uppercase text-gray-400">Active Sessions</p>
                    <p className="text-3xl font-mono font-bold text-nun-secondary">{Math.round(dataTransfer.activeSessions).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Connections</p>
                </div>
                 <div>
                    <p className="text-xs uppercase text-gray-400">Transfer Rate</p>
                    <p className="text-3xl font-mono font-bold text-nun-success">{dataTransfer.transferRateMbps.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Mbps</p>
                </div>
            </div>
             <div className="mt-4 pt-2 border-t border-nun-light/10 text-center">
                <p className="text-xs text-gray-500">Powered by NuN Quantum Mesh Global Internet</p>
            </div>
        </DashboardCard>
    );
};