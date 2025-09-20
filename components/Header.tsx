import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftOnRectangleIcon } from './icons/ArrowLeftOnRectangleIcon';
import { RealTimeClock } from './RealTimeClock';
import { BellIcon } from './icons/BellIcon';
import { VoiceCommandModal } from './VoiceCommandModal';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { useSystem } from '../context/SystemContext';
import { NotificationPanel } from './NotificationPanel';
import { GlobalSearchBar } from './GlobalSearchBar';
import { View } from '../App';

interface HeaderProps {
  onLogout: () => void;
  userRole: 'root' | 'guest';
  setActiveView?: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, userRole, setActiveView }) => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const { systemState, dispatch } = useSystem();
  const notificationsRef = useRef<HTMLDivElement>(null);

  const hasUnreadNotifications = systemState.notifications.some(n => !n.read);

  const handleToggleNotifications = () => {
    const nextState = !isNotificationPanelOpen;
    setIsNotificationPanelOpen(nextState);
    if (nextState && hasUnreadNotifications) {
      dispatch({ type: 'MARK_NOTIFICATIONS_AS_READ' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsRef]);

  return (
    <>
      <header className="bg-nun-dark/80 backdrop-blur-sm sticky top-0 z-40 border-b border-nun-light/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-xl font-bold text-nun-primary tracking-wider">
                NuN Central Dashboard
              </h1>
              <span className={`text-xs uppercase font-bold px-2 py-1 rounded ${userRole === 'root' ? 'bg-nun-error/80 text-white' : 'bg-nun-light/50 text-gray-300'}`}>
                {userRole}
              </span>
            </div>
            
            <div className="flex-1 flex justify-center px-4">
              {userRole === 'root' && setActiveView && <GlobalSearchBar onNavigate={setActiveView} />}
            </div>

            <div className="flex items-center justify-end gap-4 flex-1">
              <RealTimeClock />

              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={handleToggleNotifications}
                  className="relative text-gray-400 hover:text-nun-primary transition"
                  title="Notifications"
                >
                  <BellIcon />
                  {hasUnreadNotifications && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nun-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-nun-secondary"></span>
                    </span>
                  )}
                </button>
                {isNotificationPanelOpen && <NotificationPanel onClose={() => setIsNotificationPanelOpen(false)} />}
              </div>
              
              {userRole === 'root' && (
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="text-gray-400 hover:text-nun-primary transition"
                  title="Voice Commands"
                >
                  <MicrophoneIcon className="w-5 h-5" />
                </button>
              )}

              <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-nun-error transition" title="Logout">
                <ArrowLeftOnRectangleIcon />
              </button>
            </div>
          </div>
        </div>
      </header>
      {isVoiceModalOpen && <VoiceCommandModal onClose={() => setIsVoiceModalOpen(false)} />}
    </>
  );
};