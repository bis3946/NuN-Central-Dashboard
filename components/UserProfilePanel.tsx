import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { DashboardCard } from './DashboardCard';
import { HashedProfilePicture } from './HashedProfilePicture';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { KeyIcon } from './icons/KeyIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { UserRole } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { VerificationProofsCard } from './VerificationProofsCard';
import { EyeSlashIcon } from './icons/EyeSlashIcon';


export const UserProfilePanel: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    // Assuming the first user is the logged-in user for this simulation
    const user = systemState.users.find(u => u.role === UserRole.SuperAdmin);
    const [showSecret, setShowSecret] = useState(false);
    const [showPassphrase, setShowPassphrase] = useState(false);


    if (!user) {
        return <DashboardCard title="User Profile">Root user data not available.</DashboardCard>;
    }

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        dispatch({ type: 'ADD_LOG', payload: { level: 'TRACE', message: `${type} copied to clipboard.` } });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', message: `${type} copied to clipboard.` } });
    };
    
    const handleRegenerateKeys = () => {
        if (window.confirm('Are you sure you want to regenerate your API keys? Your old keys will be invalidated immediately.')) {
            dispatch({ type: 'REGENERATE_API_KEYS', payload: { userId: user.id } });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', message: 'API keys have been regenerated.' } });
        }
    };
    
    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case UserRole.SuperAdmin: return 'text-nun-error';
            case UserRole.Admin: return 'text-nun-secondary';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <DashboardCard title="User Identity" icon={<UserCircleIcon />}>
                    <div className="flex flex-col items-center space-y-4">
                        <HashedProfilePicture hash={user.blockchainHash} size={120} />
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-100">{user.personalInfo?.name}</h2>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <p className="text-xs text-gray-500">{user.personalInfo?.aliases.join(', ')}</p>
                        </div>
                        <div className="w-full text-sm space-y-2 pt-4 border-t border-nun-light/20">
                             <div className="flex justify-between">
                                <span className="text-gray-400">Role:</span>
                                <span className={`font-bold ${getRoleColor(user.role)}`}>{user.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status:</span>
                                <span className={`font-bold ${user.status === 'Active' ? 'text-nun-success' : 'text-nun-error'}`}>{user.status}</span>
                            </div>
                        </div>
                    </div>
                </DashboardCard>
                 <DashboardCard title="Post-Quantum Signature" icon={<QrCodeIcon />}>
                    <p className="text-xs text-gray-400 mb-2">This unique hash is derived from your biometric and blockchain data, serving as your identifier in the post-quantum mesh.</p>
                    <div className="p-2 bg-nun-darker rounded font-mono text-xs text-nun-secondary/80 break-all">
                        {user.blockchainHash}
                    </div>
                </DashboardCard>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <VerificationProofsCard user={user} />
                <DashboardCard title="API & Wallet Security" icon={<KeyIcon />}>
                     <div className="space-y-6 text-sm">
                        
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">API Key</label>
                            <div className="flex items-center gap-2">
                                <input type="text" readOnly value={user.apiKey} className="w-full bg-nun-darker/70 border border-nun-light/50 rounded-md py-1.5 px-2 font-mono text-gray-300" />
                                <button onClick={() => handleCopy(user.apiKey, 'API Key')} className="p-2 rounded-md text-gray-400 hover:text-nun-primary hover:bg-nun-light/30 transition" title="Copy API Key">
                                    <ClipboardIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Secret Key</label>
                             <div className="flex items-center gap-2">
                                <input type={showSecret ? 'text' : 'password'} readOnly value={user.apiSecret} className="w-full bg-nun-darker/70 border border-nun-light/50 rounded-md py-1.5 px-2 font-mono text-gray-300" />
                                <button onClick={() => setShowSecret(!showSecret)} className="p-2 rounded-md text-gray-400 hover:text-nun-primary hover:bg-nun-light/30 transition" title={showSecret ? "Hide Secret Key" : "Show Secret Key"}>
                                    <EyeIcon />
                                </button>
                                <button onClick={() => handleCopy(user.apiSecret, 'Secret Key')} className="p-2 rounded-md text-gray-400 hover:text-nun-primary hover:bg-nun-light/30 transition" title="Copy Secret Key">
                                    <ClipboardIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-nun-light/20">
                             <button onClick={handleRegenerateKeys} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-warning/80 text-nun-darker rounded hover:bg-nun-warning transition" title="Invalidate current keys and generate new ones. This action cannot be undone.">
                                <ArrowPathIcon className="w-5 h-5" />
                                Regenerate API Keys
                            </button>
                        </div>
                        
                        <div className="pt-4 border-t border-nun-light/20">
                             <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Wallet Recovery Passphrase</label>
                             <p className="text-xs text-nun-warning mb-2">Store this passphrase securely. It is the only way to recover your wallet.</p>
                             <div className="flex items-center gap-2">
                                <input type={showPassphrase ? 'text' : 'password'} readOnly value={systemState.wallet.passphrase} className="w-full bg-nun-darker/70 border border-nun-light/50 rounded-md py-1.5 px-2 font-mono text-gray-300 tracking-wider" />
                                <button onClick={() => setShowPassphrase(!showPassphrase)} className="p-2 rounded-md text-gray-400 hover:text-nun-primary hover:bg-nun-light/30 transition" title={showPassphrase ? "Hide Passphrase" : "Show Passphrase"}>
                                    {showPassphrase ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                                <button onClick={() => handleCopy(systemState.wallet.passphrase, 'Wallet Passphrase')} className="p-2 rounded-md text-gray-400 hover:text-nun-primary hover:bg-nun-light/30 transition" title="Copy Passphrase">
                                    <ClipboardIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                     </div>
                </DashboardCard>
            </div>
        </div>
    );
};