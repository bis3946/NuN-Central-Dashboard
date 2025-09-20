import React from 'react';
import { useSystem } from '../context/SystemContext';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { Notification as NotificationType } from '../types';

const Notification: React.FC<{ notification: NotificationType }> = ({ notification }) => {
    const { dispatch } = useSystem();
    const { id, type, message } = notification;

    const baseClasses = 'relative w-full max-w-sm p-4 rounded-lg shadow-2xl border flex items-start gap-3 animate-fade-in';
    const typeClasses = {
        success: 'bg-nun-success/10 border-nun-success/50 text-nun-success',
        error: 'bg-nun-error/10 border-nun-error/50 text-nun-error',
        info: 'bg-nun-primary/10 border-nun-primary/50 text-nun-primary',
        warning: 'bg-nun-warning/10 border-nun-warning/50 text-nun-warning',
    };

    const icons = {
        success: <CheckCircleIcon />,
        error: <XCircleIcon />,
        info: <InformationCircleIcon />,
        warning: <InformationCircleIcon />,
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <div className="flex-shrink-0 w-6 h-6">{icons[type]}</div>
            <p className="flex-grow text-sm text-gray-200">{message}</p>
            <button
                onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })}
                className="flex-shrink-0 text-gray-400 hover:text-white transition"
            >
                <XMarkIcon />
            </button>
        </div>
    );
};

export const NotificationContainer: React.FC = () => {
    const { systemState } = useSystem();
    const { notifications, anomalyNotificationsEnabled } = systemState;
    
    // Filter out read notifications and anomaly notifications if they are disabled.
    const activeNotifications = notifications.filter(notification => {
        if (notification.read) return false;
        if (!anomalyNotificationsEnabled && notification.type === 'error' && notification.message.toLowerCase().includes('anomaly')) {
            return false;
        }
        return true;
    });

    return (
        <div className="fixed top-24 right-4 z-[100] space-y-2">
            {activeNotifications.map(notification => (
                <Notification key={notification.id} notification={notification} />
            ))}
        </div>
    );
};