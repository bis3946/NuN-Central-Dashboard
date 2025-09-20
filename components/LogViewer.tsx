


import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { DashboardCard } from './DashboardCard';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { useSystem } from '../context/SystemContext';

export const LogViewer: React.FC = () => {
  const { systemState } = useSystem();
  const { logs } = systemState;
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO': return 'text-blue-400';
      case 'WARN': return 'text-nun-warning';
      case 'ERROR': return 'text-nun-error';
      case 'TRACE': return 'text-nun-secondary';
      default: return 'text-gray-400';
    }
  };

  return (
    <DashboardCard title="VaultMirror Live Log" icon={<ClipboardDocumentListIcon />} className="h-96 flex flex-col">
       <div ref={logContainerRef} className="flex-grow overflow-y-auto pr-2 -mr-2 scrollbar-thin">
        <div className="text-xs font-mono space-y-1">
          {logs.map((log, index) => (
            <p key={index} className="whitespace-nowrap">
              <span className="text-gray-500">{log.timestamp.split('T')[1].replace('Z', '')} </span>
              <span className={`font-bold ${getLevelColor(log.level)}`}>[{log.level.padEnd(5)}] </span>
              <span className="text-gray-300">{log.message}</span>
              {log.hash && <span className="text-gray-600"> #{log.hash}</span>}
            </p>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};