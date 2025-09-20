import React from 'react';
import { DashboardCard } from './DashboardCard';
import { StatusIndicator } from './StatusIndicator';
import { CubeTransparentIcon } from './icons/CubeTransparentIcon';
import { useSystem } from '../context/SystemContext';
import { Blockchain } from '../types';

export const BlockchainOverview: React.FC = () => {
  const { systemState } = useSystem();
  const { blockchains } = systemState;

  const getEntityTypeColor = (type: Blockchain['entityType']) => {
    switch (type) {
        case 'Human': return 'bg-nun-primary/20 text-nun-primary';
        case 'Entity': return 'bg-nun-secondary/20 text-nun-secondary';
        case 'AI': return 'bg-nun-warning/20 text-nun-warning';
    }
  }

  return (
    <DashboardCard title="Blockchain Overview" icon={<CubeTransparentIcon/>}>
      <ul className="space-y-4">
        {blockchains.map(chain => (
          <li key={chain.name}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-200 text-sm">{chain.name}</span>
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-semibold ${getEntityTypeColor(chain.entityType)}`}>{chain.entityType}</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className={`text-xs ${chain.status === 'OK' ? 'text-nun-success' : 'text-nun-warning'}`}>{chain.status}</span>
                 <StatusIndicator status={chain.status} />
              </div>
            </div>
            <div className="text-xs text-gray-400 flex justify-between">
              <span>Block: #{chain.blockHeight.toLocaleString()}</span>
              <span>TXs: {chain.transactions.toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
};