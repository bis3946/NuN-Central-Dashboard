


import React from 'react';
import { SystemStatus } from '../types';
import { DashboardCard } from './DashboardCard';
import { StatusIndicator } from './StatusIndicator';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { useSystem } from '../context/SystemContext';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

export const AiModuleStatus: React.FC = () => {
  const { systemState, dispatch } = useSystem();

  const handleResync = (id: string) => {
    dispatch({ type: 'RESYNC_AI_MODULE', payload: id });
  };

  return (
    <DashboardCard title="AI Entity Status" icon={<CpuChipIcon />}>
      <ul className="space-y-3">
        {systemState.aiModules.map(module => (
          <li key={module.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              {module.status === SystemStatus.Syncing && (
                <ArrowPathIcon className="w-4 h-4 text-nun-primary animate-spin" />
              )}
              <div>
                <span className="font-bold text-gray-200">{module.name}</span>
                <span className="text-xs text-gray-400 ml-2">{module.version}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleResync(module.id)} 
                title={`Resync ${module.name}`}
                className="text-gray-400 hover:text-nun-primary transition disabled:text-gray-600 disabled:cursor-not-allowed"
                disabled={module.status === SystemStatus.Syncing}
              >
                  <ArrowPathIcon className="w-4 h-4" />
              </button>
              <span className={`text-xs font-semibold w-16 text-right ${
                module.status === SystemStatus.OK ? 'text-nun-success' :
                module.status === SystemStatus.Warning ? 'text-nun-warning' :
                module.status === SystemStatus.Error ? 'text-nun-error' :
                'text-nun-primary'
              }`}>{module.status}</span>
              <StatusIndicator status={module.status} />
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
};