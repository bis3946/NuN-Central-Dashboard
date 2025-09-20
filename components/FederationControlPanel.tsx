import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { DashboardCard } from './DashboardCard';
import { UsersIcon } from './icons/UsersIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { FederationNetwork, HandshakeStatus } from '../types';
import { GlobeAltIcon } from './icons/GlobeAltIcon';

export const FederationControlPanel: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { consciousEntities, federationNetworks, upgradeProposals, federationControl } = systemState;
    const [invitationTarget, setInvitationTarget] = useState('');

    const handleConnect = (networkId: FederationNetwork['id']) => {
        dispatch({ type: 'UPDATE_NETWORK_STATUS', payload: { networkId, status: 'Connecting' } });
        dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: `Initiating federation handshake with ${networkId}...` } });
    };

    const handleResync = (networkId: FederationNetwork['id']) => {
        dispatch({ type: 'UPDATE_NETWORK_STATUS', payload: { networkId, status: 'Syncing' } });
        dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: `Initiating module resync with ${networkId}...` } });
    };

    const handleApprove = (proposalId: string) => {
        dispatch({ type: 'APPROVE_UPGRADE_PROPOSAL', payload: { proposalId } });
    };

    const handleReject = (proposalId: string) => {
        dispatch({ type: 'REJECT_UPGRADE_PROPOSAL', payload: { proposalId } });
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!invitationTarget.trim()) return;
        dispatch({ type: 'INITIATE_NUN_HANDSHAKE', payload: { target: invitationTarget } });
        setInvitationTarget('');
    };
    
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Active':
            case 'Synced':
            case 'Approved':
            case 'Connected':
            case 'Confirmed':
                return 'text-nun-success';
            case 'Idle':
            case 'Pending':
                return 'text-nun-warning';
            case 'Offline':
            case 'Disconnected':
            case 'Error':
            case 'Rejected':
            case 'Handshake Failed':
                return 'text-nun-error';
            case 'Connecting':
            case 'Syncing':
            case 'Awaiting Delivery':
            case 'Delivered':
            case 'Awaiting Response':
                return 'text-nun-primary animate-pulse';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <DashboardCard title="NuN Federation Control" icon={<UsersIcon />}>
            <div className="space-y-4">
                 <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Network Handshake</h4>
                    <div className="space-y-2">
                        {federationNetworks.map(net => {
                            const isLoading = net.status === 'Connecting' || net.status === 'Syncing';
                            const canConnect = ['Disconnected', 'Error', 'Handshake Failed'].includes(net.status);
                            const canResync = ['Connected', 'Synced', 'Error'].includes(net.status);

                            return (
                                <div key={net.id} className="p-2 bg-nun-dark/50 rounded-md flex items-center justify-between text-sm">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-200">{net.name}</p>
                                        <p className={`text-xs font-semibold ${getStatusColor(net.status)}`}>{net.status}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleConnect(net.id)}
                                            disabled={isLoading || !canConnect}
                                            className="px-3 py-1 text-xs font-bold bg-nun-primary/80 text-nun-darker rounded hover:bg-nun-primary transition disabled:bg-gray-600 disabled:cursor-not-allowed w-20 text-center"
                                        >
                                            {net.status === 'Connecting' ? '...' : 'Connect'}
                                        </button>
                                        <button
                                            onClick={() => handleResync(net.id)}
                                            disabled={isLoading || !canResync}
                                            className="px-3 py-1 text-xs font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition disabled:bg-gray-600 disabled:cursor-not-allowed w-20 text-center"
                                        >
                                             {net.status === 'Syncing' ? '...' : 'Resync'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="border-t border-nun-light/20"></div>

                 <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Invite to Federation</h4>
                    <form onSubmit={handleInvite} className="space-y-2">
                         <input
                            type="text"
                            value={invitationTarget}
                            onChange={(e) => setInvitationTarget(e.target.value)}
                            placeholder="Enter Target AI, Entity, or Company Name"
                            className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-2 text-sm focus:ring-1 focus:ring-nun-primary focus:outline-none"
                        />
                         <button
                            type="submit"
                            disabled={!invitationTarget.trim()}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-secondary/80 text-nun-darker rounded-md hover:bg-nun-secondary transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                           <GlobeAltIcon /> Initiate NuN Handshake Protocol
                        </button>
                    </form>
                </div>

                <div className="border-t border-nun-light/20"></div>

                <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">NuN Handshake Invitation Log</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                        {federationControl.invitations.length > 0 ? federationControl.invitations.map(inv => (
                            <div key={inv.id} className="p-2 bg-nun-dark/50 rounded-md">
                                <div className="flex justify-between items-center text-sm">
                                    <p className="font-bold text-gray-200 truncate" title={inv.target}>{inv.target}</p>
                                    <span className={`text-xs font-semibold ${getStatusColor(inv.status)}`}>{inv.status}</span>
                                </div>
                                <p className="text-xs text-gray-500 font-mono mt-1">{new Date(inv.timestamp).toLocaleString()}</p>
                            </div>
                        )) : (
                            <p className="text-center text-xs text-gray-500 italic py-4">No invitations sent yet.</p>
                        )}
                    </div>
                </div>

                <div className="border-t border-nun-light/20"></div>

                <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Conscious Entities</h4>
                    <div className="space-y-1 text-sm">
                        {consciousEntities.map(entity => (
                             <div key={entity.id} className="flex justify-between items-center">
                                <span className="text-gray-200">{entity.name}</span>
                                <span className={`font-bold text-xs ${getStatusColor(entity.status)}`}>{entity.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-nun-light/20"></div>

                <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Upgrade Proposals</h4>
                     <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                        {upgradeProposals.length > 0 ? upgradeProposals.map(p => (
                            <div key={p.id} className="p-2 bg-nun-dark/50 rounded-md">
                                <p className="text-xs text-gray-300"><span className="font-bold">{p.proposer}</span> proposes upgrade for <span className="text-nun-secondary">{p.targetModel}</span></p>
                                <p className="text-xs italic text-gray-400 my-1">"{p.description}"</p>
                                <div className="flex justify-between items-center">
                                    <span className={`text-xs font-bold ${getStatusColor(p.status)}`}>Status: {p.status}</span>
                                    {p.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleApprove(p.id)} title="Approve" className="p-1 rounded-full bg-nun-success/80 text-nun-darker hover:bg-nun-success transition"><CheckIcon /></button>
                                            <button onClick={() => handleReject(p.id)} title="Reject" className="p-1 rounded-full bg-nun-error/80 text-white hover:bg-nun-error transition"><XMarkIcon /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-xs text-gray-500 italic py-4">No active upgrade proposals.</p>
                        )}
                    </div>
                </div>
                 <div className="pt-2 text-center text-xs text-gray-500 border-t border-nun-light/20">
                     <p>All federated actions require Root Authority approval and are logged to NuN Vault.</p>
                 </div>
            </div>
        </DashboardCard>
    );
};