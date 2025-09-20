import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Notification as NotificationType } from '../types';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';

interface NotificationPanelProps {
    onClose: () => void;
}

const NotificationItem: React.FC<{ notification: NotificationType }> = ({ notification }) => {
    const { dispatch } = useSystem();
    const { id, type, message } = notification;

    const typeClasses = {
        success: 'border-l-nun-success/50 text-gray-300',
        error: 'border-l-nun-error/50 text-gray-300',
        info: 'border-l-nun-primary/50 text-gray-300',
    };

    const icons = {
        success: <CheckCircleIcon />,
        error: <XCircleIcon />,
        info: <InformationCircleIcon />,
    };

    const iconColors = {
        success: 'text-nun-success',
        error: 'text-nun-error',
        info: 'text-nun-primary',
    }

    return (
        <div className={`relative p-3 border-l-4 flex items-start gap-3 bg-nun-darker/50 hover:bg-nun-light/20 transition-colors ${typeClasses[type]}`}>
            <div className={`flex-shrink-0 w-6 h-6 mt-0.5 ${iconColors[type]}`}>{icons[type]}</div>
            <p className="flex-grow text-sm text-gray-300">{message}</p>
            <button
                onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })}
                className="flex-shrink-0 text-gray-500 hover:text-white transition"
                title="Dismiss notification"
            >
                <XMarkIcon />
            </button>
        </div>
    );
};


export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const { systemState, dispatch } = useSystem();
    const { notifications } = systemState;

    const handleClearAll = () => {
        dispatch({ type: 'CLEAR_NOTIFICATIONS' });
        onClose();
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 max-w-sm bg-nun-dark border border-nun-light/30 rounded-lg shadow-2xl z-50 text-sm animate-fade-in-down">
            <div className="flex justify-between items-center p-3 border-b border-nun-light/20">
                <h3 className="font-bold text-gray-200">Notifications</h3>
                {notifications.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-xs text-nun-primary/80 hover:text-nun-primary hover:underline flex items-center gap-1"
                    >
                       <TrashIcon /> Clear All
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-nun-light/10">
                        {[...notifications].reverse().map(n => <NotificationItem key={n.id} notification={n} />)}
                    </div>
                ) : (
                    <p className="p-8 text-center text-gray-500">No new notifications.</p>
                )}
            </div>
        </div>
    );
};