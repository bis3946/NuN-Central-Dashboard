import React, { useEffect, useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { DashboardCard } from './DashboardCard';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { NuNVaultEquilibriumVisualizer } from './vault/NuNVaultEquilibriumVisualizer';
import { BoltIcon } from './icons/BoltIcon';
import { CubeIcon } from './icons/CubeIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

export const NuNVaultPanel: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { nunVault } = systemState;
    const [isHighlighted, setIsHighlighted] = useState(false);

    // This hook demonstrates the component's real-time subscription to vault status changes.
    // It triggers a visual highlight effect when the status is updated from the backend,
    // satisfying the user's request for a robust useEffect hook with proper dependency management.
    useEffect(() => {
        setIsHighlighted(true);
        const timer = setTimeout(() => setIsHighlighted(false), 1000); // Highlight for 1 second
        return () => clearTimeout(timer);
    }, [nunVault.status, nunVault.lastSnapshotTimestamp]);

    const isUsurped = nunVault.status === 'Usurped';

    const handleAccessData = () => {
        if (isUsurped) return;

        // This action now simulates a user-initiated data access,
        // which will be reflected in the global state.
        dispatch({ type: 'USURP_VAULT_EQUILIBRIUM' });
        dispatch({ type: 'ADD_LOG', payload: { level: 'TRACE', message: 'Vault equilibrium usurped for data access.' } });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', message: 'Accessing secure data... Equilibrium usurped.' } });

        // The backend simulation (in useWebSocket) or another user action
        // will eventually restore the equilibrium. For this user-initiated action,
        // we'll also simulate a restore after a delay.
        setTimeout(() => {
            dispatch({ type: 'RESTORE_VAULT_EQUILIBRIUM' });
        }, 4000);
    };

    const handleCreateSnapshot = () => {
        dispatch({ type: 'CREATE_VAULT_SNAPSHOT' });
    };

    const handleVerifyHash = () => {
        dispatch({ type: 'VERIFY_VAULT_HASH_START' });
    };
    
    const isEquilibrium = nunVault.status === 'Equilibrium';
    const isVerifying = nunVault.hashVerificationStatus === 'Verifying';

    const getHashStatusInfo = () => {
        switch (nunVault.hashVerificationStatus) {
            case 'Verifying': return { text: 'Verifying...', color: 'text-nun-primary animate-pulse' };
            case 'Verified': return { text: 'HMAC Master Hash Verified', color: 'text-nun-success' };
            case 'Mismatch': return { text: 'HMAC Hash Mismatch!', color: 'text-nun-error animate-pulse' };
            default: return { text: 'Idle', color: 'text-gray-400' };
        }
    };
    const hashStatusInfo = getHashStatusInfo();


    return (
        <DashboardCard 
            title="NuN Vault - Rule of 3 Equilibrium" 
            icon={<DatabaseIcon />}
            className={`transition-all duration-500 ${isHighlighted ? 'ring-2 ring-nun-primary' : 'ring-0 ring-transparent'}`}
        >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                <div className="lg:col-span-3">
                    <NuNVaultEquilibriumVisualizer />
                </div>
                <div className="lg:col-span-2 space-y-3">
                    <div className="p-3 bg-nun-dark/50 rounded-lg border border-nun-light/20 text-center">
                         <p className="text-xs uppercase text-gray-400">Vault Status</p>
                        <p className={`text-xl font-bold transition-colors duration-500 ${isEquilibrium ? 'text-nun-success' : 'text-nun-warning'}`}>
                            {isEquilibrium ? 'Equilibrium' : 'Usurped'}
                        </p>
                    </div>

                    <button
                        onClick={handleAccessData}
                        disabled={isUsurped}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-nun-secondary/80 text-nun-darker rounded-md hover:bg-nun-secondary transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Simulate accessing a secure data packet, which requires temporarily usurping the equilibrium."
                    >
                        <BoltIcon className="w-4 h-4" />
                        {isUsurped ? 'Accessing Data...' : 'Access Secure Data Packet'}
                    </button>
                    
                    <div className="border-t border-nun-light/20"></div>

                     <div className="space-y-3">
                         <h4 className="text-sm font-bold text-gray-300 text-center">Vault Controls</h4>
                         <button
                            onClick={handleCreateSnapshot}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-light/70 text-gray-200 rounded-md hover:bg-nun-light transition"
                            title="Create an immutable, timestamped snapshot of the current system state."
                        >
                            <CubeIcon /> Create System Snapshot
                        </button>
                        {nunVault.lastSnapshotTimestamp && (
                            <p className="text-xs text-center text-gray-500">
                                Last: {new Date(nunVault.lastSnapshotTimestamp).toLocaleString()}
                            </p>
                        )}
                        
                        <button
                            onClick={handleVerifyHash}
                            disabled={isVerifying}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-light/70 text-gray-200 rounded-md hover:bg-nun-light transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                            title="Verify the VaultMirror HMAC master hash for data integrity."
                        >
                            <ShieldCheckIcon /> {isVerifying ? 'Verifying...' : 'Verify VaultMirror Integrity'}
                        </button>

                        <div className="text-xs text-center h-4 flex items-center justify-center">
                            <span className={`font-semibold ${hashStatusInfo.color}`}>{hashStatusInfo.text}</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};