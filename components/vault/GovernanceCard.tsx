
import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { useSystem } from '../../context/SystemContext';
import { ScaleIcon } from '../icons/ScaleIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

export const GovernanceCard: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { proposals } = systemState.governance;
    
    const handleVote = (proposalId: string, vote: 'approve' | 'reject') => {
        dispatch({ type: 'VOTE_ON_PROPOSAL', payload: { proposalId, vote } });
    };

    return (
        <DashboardCard title="Federation Governance" icon={<ScaleIcon />} className="2xl:col-span-1">
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                {proposals.map(p => {
                    const totalVotes = p.votes.approve + p.votes.reject;
                    const approvePercent = totalVotes > 0 ? (p.votes.approve / totalVotes) * 100 : 50;

                    return (
                        <div key={p.id} className="p-3 bg-nun-dark/50 rounded-lg text-sm">
                            <p className="font-bold text-gray-200">{p.title}</p>
                            <p className="text-xs text-gray-500 mb-2">Proposed by: <span className="font-mono">{p.proposer}</span></p>
                            
                            <div className="relative w-full bg-nun-error/30 rounded-full h-2.5 my-2">
                                <div className="bg-nun-success/50 h-2.5 rounded-full" style={{width: `${approvePercent}%`}}></div>
                            </div>
                             <div className="flex justify-between text-xs font-mono">
                                <span className="text-nun-success">{p.votes.approve} Approve</span>
                                <span className="text-nun-error">{p.votes.reject} Reject</span>
                            </div>

                            {p.status === 'Active' && (
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleVote(p.id, 'approve')}
                                        disabled={!!p.userVote}
                                        className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-bold bg-nun-success/80 text-nun-darker rounded hover:bg-nun-success disabled:bg-gray-600 disabled:cursor-not-allowed"
                                        title={p.userVote ? `You have already voted: ${p.userVote}` : 'Vote to approve this proposal'}
                                    >
                                        <CheckIcon/> Approve
                                    </button>
                                     <button
                                        onClick={() => handleVote(p.id, 'reject')}
                                        disabled={!!p.userVote}
                                        className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-bold bg-nun-error/80 text-white rounded hover:bg-nun-error disabled:bg-gray-600 disabled:cursor-not-allowed"
                                        title={p.userVote ? `You have already voted: ${p.userVote}` : 'Vote to reject this proposal'}
                                    >
                                        <XMarkIcon/> Reject
                                    </button>
                                </div>
                            )}
                            {p.status !== 'Active' && (
                                <div className="text-center mt-2 font-bold text-xs text-nun-warning">STATUS: {p.status.toUpperCase()}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </DashboardCard>
    );
};