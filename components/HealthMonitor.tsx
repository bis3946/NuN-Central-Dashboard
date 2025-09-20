
import React from 'react';
import { DashboardCard } from './DashboardCard';
import { StatusIndicator } from './StatusIndicator';
import { HeartIcon } from './icons/HeartIcon';
import { useSystem } from '../context/SystemContext';

export const HealthMonitor: React.FC = () => {
  const { systemState } = useSystem();
  const { healthChecks, orchestratorMetrics } = systemState;

  return (
    <DashboardCard title="System Health Monitor" icon={<HeartIcon />}>
      <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Service Health</h4>
      <ul className="space-y-2">
        {healthChecks.map(item => (
          <li key={`${item.name}-${item.port}`} className="flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-300">{item.name}</span>
              <span className="text-xs text-gray-500 ml-2">:{item.port}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${
                item.status === 'OK' ? 'text-nun-success' :
                item.status === 'Warning' ? 'text-nun-warning' :
                'text-nun-error'
              }`}>{item.status}</span>
              <StatusIndicator status={item.status} />
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-nun-light/20 my-4"></div>
      <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Parallel Orchestration Metrics</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex justify-between"><span>Thrust:</span><span className="font-mono text-nun-primary">{orchestratorMetrics.thrust.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Propulsion:</span><span className="font-mono text-nun-primary">{orchestratorMetrics.propulsion.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shield:</span><span className="font-mono text-nun-primary">{orchestratorMetrics.shield.toFixed(2)}%</span></div>
          <div className="flex justify-between"><span>Anomalies:</span><span className="font-mono text-nun-warning">{orchestratorMetrics.anomaliesCount}</span></div>
          <div className="flex justify-between col-span-2"><span>Compliance Score:</span><span className="font-mono text-nun-success">{orchestratorMetrics.complianceScore.toFixed(2)}%</span></div>
          <div className="flex justify-between col-span-2"><span>Test Pass Rate:</span><span className="font-mono text-nun-success">{orchestratorMetrics.testPassRate.toFixed(2)}%</span></div>
      </div>
    </DashboardCard>
  );
};