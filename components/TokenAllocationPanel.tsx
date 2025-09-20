import React from 'react';
import { useSystem } from '../context/SystemContext';
import { DashboardCard } from './DashboardCard';
import { WalletIcon } from './icons/WalletIcon';
import { CheckIcon } from './icons/CheckIcon';
import { CubeIcon } from './icons/CubeIcon';

export const TokenAllocationPanel: React.FC = () => {
    const { systemState } = useSystem();
    const { ownerAllocation } = systemState;
    const overallStatus = ownerAllocation.status;

    return (
        <DashboardCard title="51% Owner Share Allocation" icon={<CubeIcon />}>
            <div className="space-y-4">
                <div className="text-center p-3 bg-nun-darker/50 rounded-lg border border-nun-light/20">
                    <p className="text-xs uppercase text-gray-400">Process Status</p>
                    <p className={`text-xl font-bold ${
                        overallStatus === 'Success' ? 'text-nun-success' :
                        overallStatus === 'Failed' ? 'text-nun-error' :
                        'text-nun-primary' // Idle, Connecting, etc.
                    }`}>
                        {overallStatus === 'Success' ? 'Allocation Complete' : overallStatus}
                    </p>
                </div>

                {overallStatus === 'Success' ? (
                    <div className="flex items-center gap-3 text-sm p-3 bg-nun-success/10 rounded-lg">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-nun-darker border-2 border-nun-success">
                            <CheckIcon />
                        </div>
                        <span className="text-gray-300">Ownership confirmed and 51% share allocated successfully.</span>
                    </div>
                ) : (
                     <div className="flex items-center gap-3 text-sm p-3 bg-nun-warning/10 rounded-lg">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-nun-darker border-2 border-nun-warning">
                            <WalletIcon className="w-3 h-3 text-nun-warning"/>
                        </div>
                        <span className="text-gray-300">Awaiting ownership confirmation from the Tokenomics panel.</span>
                    </div>
                )}

                <div className="border-t border-nun-light/20"></div>
                
                <div className="text-xs space-y-1 pt-2">
                    <p className="flex justify-between"><span className="text-gray-500">Session ID:</span> <span className="font-mono text-gray-400 truncate" title={ownerAllocation.sessionId}>{ownerAllocation.sessionId.substring(0, 20)}...</span></p>
                    <p className="flex justify-between"><span className="text-gray-500">Target Wallet:</span> <span className="font-mono text-gray-400 truncate" title={ownerAllocation.targetWallet}>{ownerAllocation.targetWallet.substring(0, 20)}...</span></p>
                </div>
            </div>
        </DashboardCard>
    );
};
