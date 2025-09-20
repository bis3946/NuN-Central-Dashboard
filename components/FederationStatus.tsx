import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardCard } from './DashboardCard';
import { StatusIndicator } from './StatusIndicator';
import { GlobeAltIcon } from './icons/GlobeAltIcon';
import { useSystem } from '../context/SystemContext';
import { SystemState, SystemStatus, FederationNetwork } from '../types';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

export const FederationStatus: React.FC = () => {
  const { systemState, dispatch } = useSystem();
  const { federationNodes, federationNetworks, pqHandshakeStatus } = systemState;
  const isFetchingRef = useRef(false);

  // Refined: Handles all FederationNetwork statuses for text color and animation.
  const getNetworkStatusColor = (status: FederationNetwork['status']) => {
    switch(status) {
        case 'Connected':
        case 'Synced':
            return 'text-nun-success';
        case 'Connecting':
        case 'Syncing':
            return 'text-nun-primary animate-pulse';
        case 'Error':
        case 'Disconnected':
        case 'Handshake Failed':
            return 'text-nun-error';
        default:
            return 'text-gray-400';
    }
  };

  // Refined: A single function to determine all props for the StatusIndicator,
  // ensuring animation is correctly applied only for connecting/syncing states.
  const getNetworkIndicatorProps = (status: FederationNetwork['status']): { indicator: SystemStatus; animated: boolean } => {
    switch(status) {
        case 'Connected':
        case 'Synced':
            return { indicator: SystemStatus.OK, animated: false };
        case 'Connecting':
        case 'Syncing':
            return { indicator: SystemStatus.Syncing, animated: true };
        case 'Error':
        case 'Disconnected':
        case 'Handshake Failed':
            return { indicator: SystemStatus.Error, animated: false };
        default:
            return { indicator: SystemStatus.Warning, animated: false };
    }
  };

  const getPqStatusInfo = (status: SystemState['pqHandshakeStatus']) => {
    switch(status) {
        case 'Active':
            return { text: 'Active', color: 'text-nun-success', indicator: SystemStatus.OK, animated: false };
        case 'Establishing':
            return { text: 'Establishing...', color: 'text-nun-primary', indicator: SystemStatus.Syncing, animated: true };
        case 'Failed':
            return { text: 'Failed', color: 'text-nun-error', indicator: SystemStatus.Error, animated: false };
        case 'Pending':
        default:
            return { text: 'Pending', color: 'text-nun-warning', indicator: SystemStatus.Warning, animated: false };
    }
  };

  const handleRefreshKeys = useCallback(() => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    dispatch({ type: 'REFRESH_PQ_KEYS_START' });
    dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: 'Initiating Post-Quantum key handshake...' } });

    // In a real app, this would be an API call.
    // The result would come back via WebSocket or another mechanism.
    // The centralized simulation in useWebSocket will handle the async result.
    setTimeout(() => {
        isFetchingRef.current = false;
    }, 2500);

  }, [dispatch]);

  useEffect(() => {
    if (pqHandshakeStatus === 'Pending') {
      handleRefreshKeys();
    }
  }, [pqHandshakeStatus, handleRefreshKeys]);

  const pqStatusInfo = getPqStatusInfo(pqHandshakeStatus);
  const isRefreshing = pqHandshakeStatus === 'Establishing';

  return (
    <DashboardCard title="Federation Handshake" icon={<GlobeAltIcon />}>
      <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Network Protocols</h4>
      <ul className="space-y-2 mb-4">
        {federationNetworks.map(net => {
            const { indicator, animated } = getNetworkIndicatorProps(net.status);
            return (
              <li key={net.id} className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-200">{net.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${getNetworkStatusColor(net.status)}`}>
                    {net.status}
                  </span>
                  <StatusIndicator status={indicator} animated={animated} />
                </div>
              </li>
            );
        })}
      </ul>

      <div className="border-t border-nun-light/20 my-2"></div>
      
      <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Post-Quantum Handshake</h4>
      <div className="flex justify-between items-center text-sm mb-3">
        <span className="font-bold text-gray-200">Key Exchange Status</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${pqStatusInfo.color}`}>
            {pqStatusInfo.text}
          </span>
          <StatusIndicator status={pqStatusInfo.indicator} animated={pqStatusInfo.animated} />
        </div>
      </div>
      <button 
        onClick={handleRefreshKeys}
        disabled={isRefreshing}
        title="Manually trigger a new Post-Quantum key exchange for all federation partners."
        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh PQ Keys
      </button>
      
      <div className="border-t border-nun-light/20 my-2"></div>

      <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Super Nodes</h4>
      <ul className="space-y-2">
        {federationNodes.map(node => (
          <li key={node.name} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <StatusIndicator status={node.status} animated={false} />
              <span className="font-bold text-gray-200">{node.name}</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">{node.latency}ms</span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
};