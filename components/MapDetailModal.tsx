
import React from 'react';
import { Modal } from './Modal';
import { useSystem } from '../context/SystemContext';
import { MapItem } from './DashboardMapLayout';
import { StatusIndicator } from './StatusIndicator';
import { SystemStatus, UserRole } from '../types';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { apiResyncAllModules } from '../utils/api';

interface MapDetailModalProps {
    item: MapItem;
    onClose: () => void;
}

export const MapDetailModal: React.FC<MapDetailModalProps> = ({ item, onClose }) => {
    const { systemState, dispatch } = useSystem();
    const [isResyncing, setIsResyncing] = React.useState(false);

    const renderContent = () => {
        switch (item.id) {
            case 'ai-entities':
                const aiLogs = systemState.logs.filter(log => 
                    log.message.toLowerCase().includes('ana') || 
                    log.message.toLowerCase().includes('anna') ||
                    log.message.toLowerCase().includes('anne')
                ).slice(0, 5);

                return (
                    <div className="space-y-4">
                        <ul className="space-y-3">
                            {systemState.aiModules.map(module => (
                                <li key={module.id} className="flex justify-between items-center text-sm p-2 bg-nun-dark/50 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <StatusIndicator status={module.status} />
                                        <div>
                                            <span className="font-bold text-gray-200">{module.name}</span>
                                            <span className="text-xs text-gray-400 ml-2">{module.version}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold ${
                                        module.status === SystemStatus.OK ? 'text-nun-success' :
                                        module.status === SystemStatus.Warning ? 'text-nun-warning' :
                                        module.status === SystemStatus.Error ? 'text-nun-error' :
                                        'text-nun-primary'
                                    }`}>{module.status}</span>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Recent Relevant Logs</h4>
                            <div className="text-xs font-mono space-y-1 bg-nun-darker p-2 rounded max-h-40 overflow-y-auto scrollbar-thin">
                                {aiLogs.length > 0 ? aiLogs.map((log, index) => (
                                    <p key={index} className="whitespace-nowrap text-gray-400">
                                        <span className="text-gray-600">{log.timestamp.split('T')[1].replace('Z', '')} </span>
                                        <span className="text-gray-300">{log.message}</span>
                                    </p>
                                )) : <p className="italic text-gray-500">No recent logs found for AI entities.</p>}
                            </div>
                        </div>
                    </div>
                );

            case 'resync-all-ai': {
                const handleResyncAll = async () => {
                    setIsResyncing(true);
                    dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: 'Global AI module resync initiated by Root Authority.' } });
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
                        onClose();
                    }
                };
                return (
                     <div className="text-center space-y-4">
                        <p>Are you sure you want to initiate a system-wide resynchronization for all AI modules?</p>
                        <p className="text-xs text-nun-warning">This may cause a brief interruption in autonomous operations.</p>
                        <button 
                            onClick={handleResyncAll}
                            disabled={isResyncing}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded hover:bg-nun-primary transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            <ArrowPathIcon className={`w-5 h-5 ${isResyncing ? 'animate-spin' : ''}`} />
                            {isResyncing ? 'Resyncing...' : 'Confirm & Resync All'}
                        </button>
                    </div>
                );
            }

            case 'user-management':
                const roleCounts = systemState.users.reduce((acc, user) => {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                    return acc;
                }, {} as Record<UserRole, number>);

                return (
                    <div className="space-y-3">
                        <div className="text-center p-3 bg-nun-dark/50 rounded">
                            <p className="text-xs uppercase text-gray-400">Total Registered Users</p>
                            <p className="text-3xl font-bold text-nun-primary">{systemState.users.length}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Breakdown by Role</h4>
                             <ul className="space-y-1 text-sm">
                                {Object.entries(roleCounts).map(([role, count]) => (
                                    <li key={role} className="flex justify-between p-1">
                                        <span className="text-gray-300">{role}</span>
                                        <span className="font-mono text-nun-primary">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="text-center text-gray-400 space-y-2">
                        <p><span className="font-bold text-gray-200">Functionality:</span> {item.functionality}</p>
                        <p className="text-xs p-2 bg-nun-darker/50 rounded"><span className="font-bold text-gray-500">Logic:</span> {item.logic}</p>
                        <p className="pt-4 text-sm italic">Detailed view for this module is not yet implemented.</p>
                    </div>
                );
        }
    };

    return (
        <Modal title={item.name} onClose={onClose}>
            {renderContent()}
        </Modal>
    );
};