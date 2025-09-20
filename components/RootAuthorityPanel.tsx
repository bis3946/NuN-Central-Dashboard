import React from 'react';
import { DashboardCard } from './DashboardCard';
import { CommandLineIcon } from './icons/CommandLineIcon';
import { useSystem } from '../context/SystemContext';
import { SystemStatus } from '../types';
import { apiResyncAllModules } from '../utils/api';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ScaleIcon } from './icons/ScaleIcon';

export const RootAuthorityPanel: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { tokenomics } = systemState;
    const [isResyncing, setIsResyncing] = React.useState(false);

    const handleResyncAll = async () => {
        if (window.confirm('Are you sure you want to resync all AI modules? This may cause a brief interruption.')) {
            setIsResyncing(true);
            dispatch({ type: 'RESYNC_ALL_AI_MODULES_START' });
            try {
                await apiResyncAllModules();
                dispatch({ type: 'RESYNC_ALL_AI_MODULES_SUCCESS' });
                dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', message: 'System-wide AI resync initiated successfully.' } });
            } catch (error: any) {
                dispatch({ type: 'RESYNC_ALL_AI_MODULES_FAILURE' });
                dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'error', message: `Resync failed: ${error.message}` } });
            } finally {
                setIsResyncing(false);
            }
        }
    };
    
    const canExecuteAllocation = tokenomics.multisigTimelock.status === 'Ready';

    const handleExecuteAllocation = () => {
        if(canExecuteAllocation) {
             if (window.confirm('Execute owner share allocation? This is an irreversible blockchain transaction.')) {
                dispatch({ type: 'EXECUTE_OWNER_ALLOCATION' });
            }
        } else {
            alert('Cannot execute allocation. Timelock is not ready.');
        }
    }
    
    const handleSelfHeal = () => dispatch({ type: 'TRIGGER_SELF_HEALING' });
    const handleRecalibrate = () => dispatch({ type: 'RECALIBRATE_CONSENSUS' });
    const handlePurgeLogs = () => {
        if (window.confirm('Are you sure you want to purge all non-critical, temporary logs?')) {
            dispatch({ type: 'PURGE_TEMP_LOGS' });
        }
    };

    const isAnyModuleSyncing = systemState.aiModules.some(m => m.status === SystemStatus.Syncing);

    return (
        <DashboardCard title="Root Authority Controls" icon={<CommandLineIcon />}>
            <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                        onClick={handleResyncAll}
                        disabled={isResyncing || isAnyModuleSyncing}
                        className="w-full px-2 py-2 text-xs font-bold bg-nun-primary/80 text-nun-darker rounded-md hover:bg-nun-primary transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Force a resynchronization pulse across all connected AI entities."
                    >
                        {isResyncing || isAnyModuleSyncing ? 'Resyncing...' : 'System AI Resync'}
                    </button>
                    <button
                        onClick={handleSelfHeal}
                        disabled={isAnyModuleSyncing}
                        className="w-full px-2 py-2 text-xs font-bold bg-nun-warning/80 text-nun-darker rounded-md hover:bg-nun-warning transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                        title="Trigger a system-wide self-healing and diagnostic protocol."
                    >
                         <ShieldCheckIcon /> System Self-Healing
                    </button>
                     <button
                        onClick={handleRecalibrate}
                        className="w-full px-2 py-2 text-xs font-bold bg-nun-light text-gray-200 rounded-md hover:bg-nun-light/70 transition flex items-center justify-center gap-1"
                        title="Force all federation partners to recalibrate consensus and trust scores."
                    >
                         <ScaleIcon /> Recalibrate Consensus
                    </button>
                     <button
                        onClick={handlePurgeLogs}
                        className="w-full px-2 py-2 text-xs font-bold bg-nun-light text-gray-200 rounded-md hover:bg-nun-light/70 transition flex items-center justify-center gap-1"
                        title="Purge all non-critical, temporary logs from all nodes."
                    >
                        <TrashIcon /> Purge Temp Logs
                    </button>
                </div>
                 
                {tokenomics.multisigTimelock.status === 'Executed' ? (
                     <div className="w-full px-4 py-2 text-sm font-bold text-center bg-nun-success/20 text-nun-success rounded-md flex items-center justify-center gap-2">
                        <ShieldCheckIcon />
                        <span>Owner Allocation Executed</span>
                    </div>
                ) : (
                     <button
                        onClick={handleExecuteAllocation}
                        disabled={!canExecuteAllocation}
                        className="w-full px-4 py-2 text-sm font-bold bg-nun-success/80 text-nun-darker rounded-md hover:bg-nun-success transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Execute the final transfer of the 51% owner share allocation. This is an irreversible blockchain transaction."
                    >
                        Execute Owner Allocation
                    </button>
                )}

                <p className="text-xs text-center text-gray-500">
                    All critical actions are logged to the NuN Vault.
                </p>
            </div>
        </DashboardCard>
    );
};