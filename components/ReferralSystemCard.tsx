import React from 'react';
import { DashboardCard } from './DashboardCard';
import { useSystem } from '../context/SystemContext';
import { PiIcon } from './icons/PiIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

export const ReferralSystemCard: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { referralSystem } = systemState;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralSystem.sessionId);
        dispatch({ type: 'COPY_SESSION_ID' });
    };

    return (
        <DashboardCard title="Referral & Reward System" icon={<PiIcon />}>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Your Unique Session ID</label>
                    <div className="flex items-center gap-2">
                        <input type="text" readOnly value={referralSystem.sessionId} className="w-full bg-nun-darker/70 border border-nun-light/50 rounded-md py-1.5 px-2 font-mono text-gray-300" />
                        <button onClick={handleCopy} className="p-2 rounded-md text-gray-400 hover:text-nun-primary hover:bg-nun-light/30 transition" title="Copy Session ID">
                            <ClipboardIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Share this ID to earn rewards.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center p-2 bg-nun-darker/50 rounded-lg">
                     <div>
                        <p className="text-xs uppercase text-gray-400">Total Referrals</p>
                        <p className="text-2xl font-mono font-bold text-nun-secondary">{referralSystem.referralCount}</p>
                    </div>
                     <div>
                        <p className="text-xs uppercase text-gray-400">Total Rewards</p>
                        <p className="text-2xl font-mono font-bold text-nun-success">{referralSystem.totalRewards.toFixed(2)}</p>
                         <p className="text-xs text-gray-500">NUN</p>
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};