import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { useSystem } from '../../context/SystemContext';
import { UsersIcon } from '../icons/UsersIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

export const NodeManagementCard: React.FC<{ className?: string }> = ({ className }) => {
    const { systemState, dispatch } = useSystem();
    const { pendingNodes } = systemState.nodeManagement;

    const handleApprove = (id: string) => {
        dispatch({ type: 'APPROVE_NODE', payload: id });
    };

    const handleReject = (id: string) => {
        dispatch({ type: 'REJECT_NODE', payload: id });
    };

    return (
        <DashboardCard title="Node Join Requests" icon={<UsersIcon />} className={className}>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                {pendingNodes.length > 0 ? (
                    pendingNodes.map(node => (
                        <div key={node.id} className="p-2 bg-nun-dark/50 rounded-md flex items-center justify-between">
                            <div>
                                <p className="font-mono text-sm text-gray-200">{node.id}</p>
                                <p className="text-xs text-gray-400">{node.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleApprove(node.id)}
                                    title="Approve Node"
                                    className="p-1.5 rounded-full text-nun-darker bg-nun-success/80 hover:bg-nun-success transition"
                                >
                                    <CheckIcon />
                                </button>
                                <button
                                    onClick={() => handleReject(node.id)}
                                    title="Reject Node"
                                    className="p-1.5 rounded-full text-white bg-nun-error/80 hover:bg-nun-error transition"
                                >
                                    <XMarkIcon />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 italic">
                        <p>No pending node requests.</p>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
};