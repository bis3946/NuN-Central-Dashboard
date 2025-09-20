import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { useSystem } from '../context/SystemContext';
import { CubeIcon } from './icons/CubeIcon';
import { BoltIcon } from './icons/BoltIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { PasswordVerificationModal } from './PasswordVerificationModal';

export const TokenomicsDashboard: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { tokenomics } = systemState;
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    
    const handleConfirmOwnership = () => {
        dispatch({ type: 'CONFIRM_OWNERSHIP_AND_GENERATE_GENESIS_BLOCK' });
    };

    return (
        <>
            <DashboardCard title="NuN Tokenomics & Allocation" icon={<CubeIcon />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Side: Token Info */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Total Supply</h4>
                            <p className="font-mono text-2xl text-nun-primary">{tokenomics.totalSupply.toLocaleString()} NUN</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Owner Allocation (51%)</h4>
                            <div className="p-3 bg-nun-dark/50 rounded-lg">
                                <p className="text-sm font-bold text-gray-200">Owner: <span className="text-nun-secondary">{tokenomics.ownerAllocation.owner}</span></p>
                                <p className="font-mono text-lg text-nun-primary">{tokenomics.ownerAllocation.amount.toLocaleString()} NUN</p>
                                <p className={`text-xs font-bold ${tokenomics.ownerAllocation.status === 'Allocated' ? 'text-nun-success' : 'text-nun-warning'}`}>
                                    Status: {tokenomics.ownerAllocation.status}
                                </p>
                            </div>
                        </div>
                         <div>
                            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Vesting Contracts</h4>
                            <ul className="space-y-1 text-xs">
                                {tokenomics.distributionBuckets.map(c => (
                                    <li key={c.id} className="flex justify-between p-1 bg-nun-dark/30 rounded">
                                        <span className="text-gray-400">{c.bucket}</span>
                                        <span className="font-mono text-gray-200">{(c.amount).toLocaleString()} NUN</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Simplified Ownership Confirmation */}
                    <div className="p-4 bg-nun-darker/50 rounded-lg border border-nun-light/20 flex flex-col justify-center items-center text-center">
                        <h4 className="text-sm font-bold uppercase text-nun-primary/80 mb-3">Owner Share Allocation Control</h4>
                        
                        {tokenomics.multisigTimelock.status === 'Executed' ? (
                            <div className="space-y-2">
                                <ShieldCheckIcon />
                                <p className="font-bold text-nun-success">Ownership Confirmed & Genesis Block Created</p>
                                <p className="text-xs text-gray-400">The NuN Blockchain is now live.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                 <p className="text-xs text-nun-warning">This action is irreversible and will generate the genesis block for the NuN Blockchain.</p>
                                <button 
                                    onClick={() => setIsVerificationModalOpen(true)} 
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded hover:bg-nun-primary transition" 
                                    title="Confirm your Root Authority and initiate the blockchain."
                                >
                                   <BoltIcon className="w-4 h-4" /> Confirm Ownership & Generate Genesis Block
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardCard>
            {isVerificationModalOpen && (
                <PasswordVerificationModal
                    onClose={() => setIsVerificationModalOpen(false)}
                    onSuccess={handleConfirmOwnership}
                    title="Root Authority Confirmation"
                    description="Enter the Root Authority password to confirm your ownership, allocate the 51% share, and generate the NuN Blockchain genesis block."
                />
            )}
        </>
    );
};
