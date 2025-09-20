
import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { PiIcon } from './icons/PiIcon';
import { useSystem } from '../context/SystemContext';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

export const PiNetworkSync: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { piNetwork } = systemState;
    const [walletAddress, setWalletAddress] = useState('');

    const syncPercentage = piNetwork.totalPiBlocks > 0 ? (piNetwork.syncedBlocks / piNetwork.totalPiBlocks) * 100 : 0;

    const handleKycVerification = (e: React.FormEvent) => {
        e.preventDefault();
        if (!walletAddress.trim() || piNetwork.status === 'Verifying' || piNetwork.kycVerified) return;
        dispatch({ type: 'VERIFY_PI_KYC', payload: { walletAddress } });
    };

    const getStatusDisplay = () => {
        switch (piNetwork.status) {
            case 'Synced': return { text: 'SYNCED', color: 'text-nun-success' };
            case 'Syncing': return { text: 'SYNCING', color: 'text-nun-primary animate-pulse' };
            case 'Verifying': return { text: 'VERIFYING KYC', color: 'text-nun-warning animate-pulse' };
            case 'Verified': return { text: 'KYC VERIFIED', color: 'text-nun-success' };
            case 'Integrated': return { text: 'INTEGRATED', color: 'text-nun-success font-bold' };
            case 'Error': return { text: 'ERROR', color: 'text-nun-error' };
            case 'Disconnected': return { text: 'DISCONNECTED', color: 'text-gray-500' };
            default: return { text: 'IDLE', color: 'text-gray-400' };
        }
    };
    const { text, color } = getStatusDisplay();

    return (
        <DashboardCard title="Pi Network Sync & KYC" icon={<PiIcon />}>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status</span>
                    <span className={`font-bold ${color}`}>{text}</span>
                </div>
                
                {piNetwork.status === 'Integrated' ? (
                     <div className="text-center p-4 bg-nun-success/10 rounded-lg border border-nun-success/30">
                        <ShieldCheckIcon />
                        <p className="font-bold text-nun-success mt-1">NuN Protocol Active on Pi Network</p>
                        <p className="text-xs text-gray-400">Resources and validation data are being collected.</p>
                    </div>
                ) : piNetwork.kycVerified ? (
                    <div className="text-center p-4 bg-nun-success/10 rounded-lg border border-nun-success/30">
                        <ShieldCheckIcon />
                        <p className="font-bold text-nun-success mt-1">Root Authority KYC Verified</p>
                        {piNetwork.status !== 'Syncing' && <p className="text-xs text-gray-400">Awaiting full chain sync for integration.</p>}
                    </div>
                ) : (
                    <form onSubmit={handleKycVerification} className="space-y-2">
                        <input
                            type="text"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder="Enter Pi Wallet Address for KYC"
                            className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-3 text-xs focus:ring-1 focus:ring-nun-primary focus:outline-none transition"
                            disabled={piNetwork.status === 'Verifying' || piNetwork.status === 'Syncing'}
                        />
                        <button
                            type="submit"
                            disabled={!walletAddress.trim() || piNetwork.status === 'Verifying' || piNetwork.status === 'Syncing'}
                            className="w-full px-3 py-1.5 text-xs font-bold bg-nun-primary/80 text-nun-darker rounded hover:bg-nun-primary transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                            title="Verify your Root Authority status by linking your Pi wallet for KYC."
                        >
                            {piNetwork.status === 'Verifying' ? 'Verifying...' : (piNetwork.status === 'Syncing' ? 'Syncing...' : 'Verify KYC')}
                        </button>
                    </form>
                )}

                <div className="text-xs text-gray-500 border-t border-nun-light/20 pt-2 space-y-1">
                     <div>
                        <div className="flex justify-between text-gray-400 mb-1">
                            <span>Chain Sync Progress</span>
                            <span>{syncPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-nun-darker rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${piNetwork.status === 'Syncing' ? 'bg-nun-primary' : 'bg-nun-success'}`}
                                style={{ width: `${syncPercentage}%` }}
                            ></div>
                        </div>
                        {piNetwork.status === 'Syncing' && (
                             <p className="text-right text-gray-400 font-mono text-[10px] mt-1">
                                {piNetwork.syncedBlocks.toLocaleString()} / {piNetwork.totalPiBlocks.toLocaleString()} blocks
                             </p>
                        )}
                    </div>
                    {piNetwork.lastSync && <p className="flex justify-between"><span>Last Sync:</span> <span>{new Date(piNetwork.lastSync).toLocaleTimeString()}</span></p>}
                </div>
            </div>
        </DashboardCard>
    );
};