
import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import { DashboardCard } from './DashboardCard';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { User } from '../types';
import { PiIcon } from './icons/PiIcon';
import { KeyIcon } from './icons/KeyIcon';
import { AtSymbolIcon } from './icons/AtSymbolIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';

interface VerificationProofsCardProps {
    user: User;
}

export const VerificationProofsCard: React.FC<VerificationProofsCardProps> = ({ user }) => {
    const { dispatch } = useSystem();
    const [piWalletAddress, setPiWalletAddress] = useState(user.piWalletAddress || '');
    const [sessionKey, setSessionKey] = useState(user.sessionKey || '');
    const [gmail, setGmail] = useState(user.gmail || 'bojanmilanovickorcula@gmail.com');
    const [isEditing, setIsEditing] = useState(!user.piWalletAddress && !user.sessionKey && !user.gmail);

    useEffect(() => {
        setPiWalletAddress(user.piWalletAddress || '');
        setSessionKey(user.sessionKey || '');
        setGmail(user.gmail || 'bojanmilanovickorcula@gmail.com');
    }, [user]);

    const allProofsSubmitted = !!user.piWalletAddress && !!user.sessionKey && !!user.gmail;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({
            type: 'SUBMIT_VERIFICATION_PROOFS',
            payload: { userId: user.id, piWalletAddress, sessionKey, gmail }
        });
        setIsEditing(false);
    };
    
    const handleVerifyGmail = () => {
        dispatch({ type: 'VERIFY_GMAIL', payload: { userId: user.id } });
    }

    return (
        <DashboardCard title="Root Authority Verification Proofs" icon={<ShieldCheckIcon />}>
            <div className="space-y-4">
                <p className="text-xs text-nun-warning">
                    Submitting these proofs is required to enable Root Authority functions, including the 51% token allocation. This data is stored securely in the NuN Vault.
                </p>

                {allProofsSubmitted && !isEditing ? (
                    <div className="space-y-3 text-sm">
                        <div className="p-3 bg-nun-success/10 rounded-lg border border-nun-success/30 text-center">
                            <p className="font-bold text-nun-success">All verification proofs are stored in the NuN Vault.</p>
                        </div>
                        <div>
                            <p className="text-gray-400 font-bold">Pi Wallet:</p>
                            <p className="font-mono text-gray-300 break-all">{user.piWalletAddress}</p>
                        </div>
                        <div>
                             <p className="text-gray-400 font-bold">Session Key:</p>
                             <p className="font-mono text-gray-300 break-all">{user.sessionKey}</p>
                        </div>
                        <div>
                             <div className="flex justify-between items-center">
                                 <div>
                                    <p className="text-gray-400 font-bold">Gmail:</p>
                                    <p className="font-mono text-gray-300">{user.gmail}</p>
                                 </div>
                                 <div>
                                     {user.gmailVerified ? (
                                        <span className="flex items-center gap-1 text-nun-success text-xs font-bold"><CheckBadgeIcon /> Verified</span>
                                     ) : (
                                        <button onClick={handleVerifyGmail} className="px-2 py-1 text-xs font-bold bg-nun-warning/80 text-nun-darker rounded hover:bg-nun-warning transition">
                                            Verify Now
                                        </button>
                                     )}
                                 </div>
                             </div>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="w-full mt-2 px-4 py-2 text-sm font-bold bg-nun-light/50 text-gray-300 rounded-md hover:bg-nun-light/80 transition">
                            Edit Proofs
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-1">
                                <PiIcon /> Pi Network Wallet Address
                            </label>
                            <input
                                type="text"
                                value={piWalletAddress}
                                onChange={(e) => setPiWalletAddress(e.target.value)}
                                placeholder="Enter your Pi Wallet Address"
                                required
                                className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-2 font-mono"
                            />
                        </div>
                        <div>
                             <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-1">
                                <KeyIcon /> Oxen/Session Key
                            </label>
                            <input
                                type="text"
                                value={sessionKey}
                                onChange={(e) => setSessionKey(e.target.value)}
                                placeholder="Enter your Session communication key"
                                required
                                className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-2 font-mono"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-1">
                                <AtSymbolIcon /> Gmail Address
                            </label>
                            <input
                                type="email"
                                value={gmail}
                                onChange={(e) => setGmail(e.target.value)}
                                placeholder="Enter your Gmail for Google Integration"
                                required
                                className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-2 font-mono"
                            />
                             <p className="text-xs text-gray-500 mt-1">This will be used for seamless Google integration and Root Authority confirmation.</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                             {allProofsSubmitted && (
                                 <button type="button" onClick={() => setIsEditing(false)} className="w-full px-4 py-2 text-sm font-bold bg-nun-light/50 text-gray-300 rounded-md hover:bg-nun-light/80 transition">
                                     Cancel
                                 </button>
                             )}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-sm font-bold bg-nun-secondary/80 text-nun-darker rounded-md hover:bg-nun-secondary transition"
                            >
                                Submit to NuN Vault
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </DashboardCard>
    );
};