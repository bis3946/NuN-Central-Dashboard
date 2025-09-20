

import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { useSystem } from '../../context/SystemContext';
import { SwitchHorizontalIcon } from '../icons/SwitchHorizontalIcon';
import { StatusIndicator } from '../StatusIndicator';
import { SystemStatus } from '../../types';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';

export const NetworkOrchestrationCard: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { mode, federationPartners } = systemState.networkOrchestration;

    const handleCycleMode = () => {
        dispatch({ type: 'CYCLE_NETWORK_MODE' });
    };

    const getStatusIndicator = (status: 'Handshake OK' | 'Syncing' | 'Error') => {
        switch (status) {
            case 'Handshake OK': return <StatusIndicator status={SystemStatus.OK} />;
            case 'Syncing': return <StatusIndicator status={SystemStatus.Syncing} />;
            case 'Error': return <StatusIndicator status={SystemStatus.Error} />;
        }
    };

    const getModeInfo = () => {
        switch(mode) {
            case 'live':
                return { text: 'LIVE NETWORK', color: 'text-nun-success', next: 'Simulation' };
            case 'simulation':
                return { text: 'SIMULATION ACTIVE', color: 'text-nun-warning animate-pulse', next: 'Standby' };
            case 'standby':
                return { text: 'SYSTEM STANDBY', color: 'text-nun-primary', next: 'Live' };
        }
    }
    const modeInfo = getModeInfo();

    return (
        <DashboardCard title="Network Orchestration & Simulation" icon={<SwitchHorizontalIcon />}>
            <div className="space-y-4">
                <div className="p-3 bg-nun-dark/50 rounded-lg border border-nun-light/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-bold text-sm text-gray-200">System Mode</span>
                             <p className={`text-xs mt-1 font-bold ${modeInfo.color}`}>
                                {modeInfo.text}
                            </p>
                        </div>
                        <button 
                            onClick={handleCycleMode}
                            className="px-3 py-1.5 text-xs font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition"
                            title={`Switch to ${modeInfo.next} Mode`}
                        >
                            Switch to {modeInfo.next}
                        </button>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Federation Handshake Status</h4>
                    <ul className="space-y-2 text-sm">
                        {federationPartners.map(partner => (
                            <li key={partner.id} className="flex justify-between items-center">
                                <span className="text-gray-300">{partner.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">{partner.status}</span>
                                    {getStatusIndicator(partner.status)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-2 text-xs text-nun-success/80 pt-2 border-t border-nun-light/10">
                    <ShieldCheckIcon />
                    <span>Post-Quantum Encryption: Active</span>
                </div>
            </div>
        </DashboardCard>
    );
};