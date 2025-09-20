

import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { ScaleIcon } from './icons/ScaleIcon';
import { BrainIcon } from './icons/BrainIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { ServerStackIcon } from './icons/ServerStackIcon';
import { SystemStatus } from '../types';
import { StatusIndicator } from './StatusIndicator';
import { useSystem } from '../context/SystemContext';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { GlobeAmericasIcon } from './icons/GlobeAmericasIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { ReferralSystemCard } from './ReferralSystemCard';
import { DatabaseIcon } from './icons/DatabaseIcon';

type PingType = 'global' | 'mesh' | 'quantum' | 'federation' | 'post-quantum' | 'nun-global-mesh' | 'nun-vault';

interface PingStats {
  min: number;
  max: number;
  avg: number;
  loss: number;
}

interface PingState {
    pinging: boolean;
    message: string;
    messageType: 'success' | 'error' | null;
    stats: PingStats | null;
}

const PingStatsDisplay: React.FC<{ stats: PingStats }> = ({ stats }) => (
    <div className="grid grid-cols-4 gap-x-2 text-center w-full animate-fade-in">
        <div>
            <p className="text-gray-500 text-[10px] uppercase">Min</p>
            <p className="font-mono">{stats.min}ms</p>
        </div>
        <div>
            <p className="text-gray-500 text-[10px] uppercase">Max</p>
            <p className="font-mono">{stats.max}ms</p>
        </div>
        <div>
            <p className="text-gray-500 text-[10px] uppercase">Avg</p>
            <p className="font-mono">{stats.avg.toFixed(1)}ms</p>
        </div>
        <div>
            <p className={`text-gray-500 text-[10px] uppercase ${stats.loss > 0 ? 'text-nun-warning' : ''}`}>Loss</p>
            <p className={`font-mono ${stats.loss > 5 ? 'text-nun-error' : stats.loss > 0 ? 'text-nun-warning' : ''}`}>{stats.loss}%</p>
        </div>
    </div>
);


export const NextGenDashboardLayout: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { federatedDecisions, predictedEvents, neuroMetrics, sessionManager } = systemState;

    const [pingStatus, setPingStatus] = useState<Record<PingType, PingState>>({
        global: { pinging: false, message: '', messageType: null, stats: null },
        mesh: { pinging: false, message: '', messageType: null, stats: null },
        quantum: { pinging: false, message: '', messageType: null, stats: null },
        federation: { pinging: false, message: '', messageType: null, stats: null },
        'post-quantum': { pinging: false, message: '', messageType: null, stats: null },
        'nun-global-mesh': { pinging: false, message: '', messageType: null, stats: null },
        'nun-vault': { pinging: false, message: '', messageType: null, stats: null },
    });
    const [sessionAddress, setSessionAddress] = useState('');
    const [networkStats, setNetworkStats] = useState({ latency: 45, loss: 0.1 });

    useEffect(() => {
        const networkTick = setInterval(() => {
            setNetworkStats({
                latency: Math.floor(Math.random() * (120 - 30 + 1)) + 30, // 30ms to 120ms
                loss: parseFloat((Math.random() * 2).toFixed(2)), // 0% to 2%
            });
        }, 2500);

        return () => clearInterval(networkTick);
    }, []);

    const getPingerName = (type: PingType) => {
        switch (type) {
            case 'global': return 'Global';
            case 'mesh': return 'Mesh';
            case 'quantum': return 'Quantum';
            case 'federation': return 'Federation';
            case 'post-quantum': return 'Post-Quantum';
            case 'nun-global-mesh': return 'NuN Global Mesh';
            case 'nun-vault': return 'NuN Vault';
            default: return '';
        }
    }

    const PING_CONFIG: Record<PingType, { delay: number; failChance: number }> = {
        global: { delay: 1200, failChance: 0.1 },
        mesh: { delay: 3000, failChance: 0.05 },
        quantum: { delay: 800, failChance: 0.2 },
        federation: { delay: 2200, failChance: 0.15 },
        'post-quantum': { delay: 1800, failChance: 0.1 },
        'nun-global-mesh': { delay: 2500, failChance: 0.05 },
        'nun-vault': { delay: 1500, failChance: 0.02 },
    };


    const handlePing = (type: PingType) => {
        setPingStatus(prev => {
            const newState: Record<PingType, PingState> = { ...prev };
            // Reset all statuses
            for (const key in newState) {
                newState[key as PingType] = { pinging: false, message: '', messageType: null, stats: null };
            }
            // Set the current one to pinging
            newState[type] = { pinging: true, message: '', messageType: null, stats: null };
            return newState;
        });

        dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: `Initiating ${getPingerName(type)} ping...` } });

        const { delay, failChance } = PING_CONFIG[type];

        setTimeout(() => {
            if (['mesh', 'nun-global-mesh', 'nun-vault'].includes(type)) {
                const packetCount = 10;
                const latencies: number[] = [];
                const lossChance = PING_CONFIG[type].failChance;
                const baseLatency = type === 'mesh' ? 10 : (type === 'nun-global-mesh' ? 40 : 15);
                const latencyRange = type === 'mesh' ? 30 : (type === 'nun-global-mesh' ? 40 : 20);

                for (let i = 0; i < packetCount; i++) {
                    if (Math.random() > lossChance) {
                        latencies.push(Math.floor(Math.random() * latencyRange) + baseLatency);
                    }
                }

                if (latencies.length === 0) {
                    const stats: PingStats = { min: 0, max: 0, avg: 0, loss: 100 };
                    dispatch({ type: 'ADD_LOG', payload: { level: 'ERROR', message: `${getPingerName(type)} ping failed. 100% packet loss.` } });
                    setPingStatus(prev => ({ ...prev, [type]: { pinging: false, message: '', messageType: null, stats } }));
                } else {
                    const min = Math.min(...latencies);
                    const max = Math.max(...latencies);
                    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
                    const loss = ((packetCount - latencies.length) / packetCount) * 100;
                    const stats: PingStats = { min, max, avg, loss };
                    
                    dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: `${getPingerName(type)} ping successful. Avg: ${avg.toFixed(1)}ms, Loss: ${loss}%.` } });
                    setPingStatus(prev => ({ ...prev, [type]: { pinging: false, message: '', messageType: null, stats } }));
                }
                
                setTimeout(() => setPingStatus(prev => ({ ...prev, [type]: { ...prev[type], stats: null } })), 7000);
                return;
            }

            const didFail = Math.random() < failChance;

            if (didFail) {
                const errorMessage = `${getPingerName(type)} Ping failed. Connection timed out.`;
                dispatch({ type: 'ADD_LOG', payload: { level: 'ERROR', message: errorMessage } });
                setPingStatus(prev => ({
                    ...prev,
                    [type]: { pinging: false, message: errorMessage, messageType: 'error', stats: null }
                }));
                setTimeout(() => setPingStatus(prev => ({ ...prev, [type]: { ...prev[type], message: '', messageType: null } })), 5000);
                return;
            }
            
            const hash = (Math.random() + 1).toString(36).substring(2, 10);
            let successMessage = '';
            let logLevel: 'INFO' | 'TRACE' = 'INFO';
            let logMessage = '';

            switch (type) {
                case 'global':
                    successMessage = `Global Ping OK. Pkg broadcasted. Hash: ${hash}`;
                    logLevel = 'TRACE';
                    logMessage = `Global connection package ${hash} sent.`;
                    break;
                case 'quantum':
                    successMessage = `Quantum Ping OK. Entanglement established. Hash: ${hash}`;
                    logLevel = 'TRACE';
                    logMessage = `Quantum entanglement package ${hash} sent.`;
                    break;
                case 'federation':
                    successMessage = `Federation Join OK. Handshake complete. Hash: ${hash}`;
                    logLevel = 'TRACE';
                    logMessage = `Federation join handshake ${hash} sent.`;
                    break;
                case 'post-quantum':
                    successMessage = `Post-Quantum Ping OK. Kyber handshake OK. Hash: ${hash}`;
                    logLevel = 'TRACE';
                    logMessage = `Post-quantum key exchange ${hash} completed.`;
                    break;
            }

            dispatch({ type: 'ADD_LOG', payload: { level: logLevel, message: logMessage, hash } });
            setPingStatus(prev => ({ ...prev, [type]: { pinging: false, message: successMessage, messageType: 'success', stats: null } }));
            setTimeout(() => setPingStatus(prev => ({ ...prev, [type]: { ...prev[type], message: '', messageType: null } })), 5000);
            
        }, delay);
    };

    const handleDecision = (id: string, status: 'Approved' | 'Rejected') => {
      dispatch({ type: 'UPDATE_DECISION_STATUS', payload: { id, status } });
    };

    const handleSessionConnect = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionAddress.trim()) return;
        dispatch({ type: 'CONNECT_SESSION', payload: { address: sessionAddress } });
        setSessionAddress('');
    };
    
    const isConnectingSession = sessionManager.connections.some(c => c.status === 'Connecting');
    
    const activePingerType = Object.keys(pingStatus).find(key => pingStatus[key as PingType].pinging) as PingType | undefined;

    const getDisplayContent = () => {
        if (activePingerType) {
            return <span className="animate-pulse">{`Pinging ${getPingerName(activePingerType)}...`}</span>;
        }

        // Check for any error messages first
        for (const key in pingStatus) {
            const status = pingStatus[key as PingType];
            if (status.messageType === 'error') {
                return <span className="text-nun-error">{status.message}</span>;
            }
        }

        // Check for any ping stats
        const pingerKeyWithStats = (Object.keys(pingStatus) as PingType[]).find(key => pingStatus[key].stats);
        if (pingerKeyWithStats) {
            return <PingStatsDisplay stats={pingStatus[pingerKeyWithStats].stats!} />;
        }
        
        // Check for any success messages
        for (const key in pingStatus) {
            const status = pingStatus[key as PingType];
            if (status.messageType === 'success') {
                return <span className="text-nun-success">{status.message}</span>;
            }
        }

        return <span>&nbsp;</span>;
    };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard title="Federated Decisions" icon={<ScaleIcon />}>
        <ul className="space-y-3 text-sm">
          {federatedDecisions.map(d => (
            <li key={d.id}>
              <p className="text-gray-300"><span className="font-bold text-nun-primary">{d.source}: </span>{d.proposal}</p>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-gray-400">Conf: {d.confidence}%</span>
                <div className='flex items-center gap-2'>
                  <span className={`font-bold ${d.status === 'Pending' ? 'text-nun-warning animate-pulse' : d.status === 'Approved' ? 'text-nun-success' : 'text-nun-error'}`}>{d.status}</span>
                  {d.status === 'Pending' && (
                    <div className="flex gap-1">
                      <button onClick={() => handleDecision(d.id, 'Approved')} className="text-nun-success hover:scale-125 transition" title="Approve this decision"><CheckIcon /></button>
                      <button onClick={() => handleDecision(d.id, 'Rejected')} className="text-nun-error hover:scale-125 transition" title="Reject this decision"><XMarkIcon /></button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </DashboardCard>

      <DashboardCard title="Neuro-Regen Monitor" icon={<BrainIcon />}>
        <div className="space-y-3 text-sm">
            <div>
                <p className="text-gray-400 text-xs flex justify-between">Brainwave Resonance <span>{neuroMetrics.resonance.toFixed(1)}%</span></p>
                <div className="w-full bg-nun-darker rounded-full h-2.5"><div className="bg-nun-primary h-2.5 rounded-full" style={{width: `${neuroMetrics.resonance}%`}}></div></div>
            </div>
             <div>
                <p className="text-gray-400 text-xs flex justify-between">Neuroplasticity Simulation <span>{neuroMetrics.neuroplasticity.toFixed(1)}%</span></p>
                <div className="w-full bg-nun-darker rounded-full h-2.5"><div className="bg-nun-secondary h-2.5 rounded-full" style={{width: `${neuroMetrics.neuroplasticity}%`}}></div></div>
            </div>
            <div>
                 <p className="text-gray-400 text-xs">Cellular Regen Feedback</p>
                 <p className="text-nun-success font-bold">NOMINAL</p>
            </div>
        </div>
      </DashboardCard>
      
      <DashboardCard title="Predictive Analytics" icon={<ChartBarIcon />}>
         <ul className="space-y-3 text-sm">
          {predictedEvents.map(p => (
            <li key={p.id} className="border-l-2 border-nun-secondary/50 pl-2">
              <p className="text-gray-300">{p.description}</p>
              <div className="flex justify-between items-center text-xs mt-1 text-gray-400">
                <span>Prob: {p.probability}%</span>
                <span>Action: <span className="text-nun-warning">{p.recommendedAction}</span></span>
              </div>
            </li>
          ))}
        </ul>
      </DashboardCard>
      
       <DashboardCard title="Federation & Node Status" icon={<ServerStackIcon />}>
         <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Active Nodes:</span><span className="text-nun-primary font-bold">{systemState.nodes.active.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Super Nodes:</span><span className="text-nun-secondary font-bold">{systemState.nodes.super.toLocaleString()}</span></div>
             <div className="flex justify-between items-center">
                <span>Auto-Register New AI:</span>
                <div className="flex items-center gap-2">
                    <span className="text-nun-success text-xs">ACTIVE</span>
                    <StatusIndicator status={SystemStatus.OK} animated={false} />
                </div>
            </div>
         </div>
      </DashboardCard>
      
      <ReferralSystemCard />
      
      <DashboardCard title="Mesh & Session Intercom" icon={<GlobeAmericasIcon />}>
         <div className="space-y-3 text-sm">
             <div className="grid grid-cols-2 gap-2 text-center p-2 mb-2 bg-nun-darker/50 rounded-lg border border-nun-light/20">
                <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">Global Latency</p>
                    <p className="font-mono text-lg text-nun-primary">{networkStats.latency}ms</p>
                </div>
                <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">Packet Loss</p>
                    <p className={`font-mono text-lg ${
                        networkStats.loss > 1 ? 'text-nun-error' : 
                        networkStats.loss > 0.5 ? 'text-nun-warning' : 
                        'text-nun-success'
                    }`}>
                        {networkStats.loss.toFixed(2)}%
                    </p>
                </div>
            </div>
            <div>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button 
                        onClick={() => handlePing('federation')} 
                        disabled={!!activePingerType}
                        className="px-3 py-1.5 text-xs font-bold bg-nun-success/80 text-nun-darker rounded hover:bg-nun-success transition text-center disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Initiate a handshake to join the federation network."
                    >
                        Federation Join
                    </button>
                    <button 
                        onClick={() => handlePing('global')} 
                        disabled={!!activePingerType}
                        className="px-3 py-1.5 text-xs font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition text-center disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Send a standard ICMP echo request to the global network endpoint."
                    >
                        Global Ping
                    </button>
                    <button 
                        onClick={() => handlePing('mesh')} 
                        disabled={!!activePingerType}
                        className="px-3 py-1.5 text-xs font-bold bg-nun-secondary/80 text-nun-darker rounded hover:bg-nun-secondary transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Test latency and packet loss across the internal NuN mesh network."
                    >
                        Mesh Ping
                    </button>
                    <button 
                        onClick={() => handlePing('quantum')} 
                        disabled={!!activePingerType}
                        className="px-3 py-1.5 text-xs font-bold bg-nun-primary/80 text-nun-darker rounded hover:bg-nun-primary transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Establish a quantum entanglement link to test the Q-Mesh protocol latency."
                    >
                        Quantum Ping
                    </button>
                     <button 
                        onClick={() => handlePing('post-quantum')} 
                        disabled={!!activePingerType}
                        className="px-3 py-1.5 text-xs font-bold bg-nun-warning/80 text-nun-darker rounded hover:bg-nun-warning transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Perform a Kyber handshake to verify post-quantum cryptographic channel integrity."
                    >
                        Post-Quantum Ping
                    </button>
                     <button 
                        onClick={() => handlePing('nun-global-mesh')} 
                        disabled={!!activePingerType}
                        className="px-3 py-1.5 text-xs font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition text-center disabled:bg-gray-600 disabled:cursor-not-allowed"
                        title="Sync with the NuN Global Mesh using Tangle technology."
                    >
                        NuN Global Mesh
                    </button>
                    <button 
                        onClick={() => handlePing('nun-vault')} 
                        disabled={!!activePingerType}
                        className="px-3 py-1.5 text-xs font-bold bg-nun-secondary/80 text-nun-darker rounded hover:bg-nun-secondary transition disabled:bg-gray-600 disabled:cursor-not-allowed col-span-2 sm:col-span-3 flex items-center justify-center gap-2"
                        title="Ping the NuN Vault decentralized storage layer."
                    >
                       <DatabaseIcon className="w-4 h-4" /> NuN Vault Ping
                    </button>
                </div>
                <div className="text-xs text-nun-primary/90 h-8 text-center flex items-center justify-center">
                    {getDisplayContent()}
                </div>
            </div>
         
            <div className="border-t border-nun-light/20"></div>

            <div className="space-y-2">
                 <form onSubmit={handleSessionConnect} className="flex gap-2">
                    <input
                        type="text"
                        value={sessionAddress}
                        onChange={(e) => setSessionAddress(e.target.value)}
                        placeholder="Enter Session Address"
                        className="flex-grow bg-nun-darker border border-nun-light/50 rounded-md py-1 px-2 text-xs focus:ring-1 focus:ring-nun-primary focus:outline-none transition"
                        disabled={isConnectingSession}
                    />
                    <button
                        type="submit"
                        disabled={!sessionAddress.trim() || isConnectingSession}
                        className="px-3 py-1 text-xs font-bold bg-nun-secondary/80 text-nun-darker rounded hover:bg-nun-secondary transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center w-20"
                        title="Connect to a remote device session using its address."
                    >
                        {isConnectingSession ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'Connect'}
                    </button>
                </form>

                <div className="text-xs space-y-2 pt-2">
                    <h4 className="font-bold text-gray-400">Connected Devices:</h4>
                    {sessionManager.connections.length > 0 ? (
                        <ul className="space-y-1 max-h-24 overflow-y-auto pr-2 scrollbar-thin">
                            {sessionManager.connections.map(conn => (
                                <li key={conn.address} className="flex items-center justify-between p-1 bg-nun-darker/50 rounded">
                                    <span className="font-mono truncate" title={conn.address}>{conn.address.substring(0, 20)}...</span>
                                    <div className="flex items-center gap-2">
                                        {conn.status === 'Connecting' && <span className="text-nun-primary animate-pulse">Connecting</span>}
                                        {conn.status === 'Connected' && <span className="text-nun-success">Connected</span>}
                                        {conn.status === 'Error' && <span className="text-nun-error" title={conn.lastError || ''}>Error</span>}
                                        
                                        {conn.status === 'Connecting' && <ArrowPathIcon className="w-3 h-3 text-nun-primary animate-spin" />}
                                        {conn.status === 'Connected' && <StatusIndicator status={SystemStatus.OK} animated={false} />}
                                        {conn.status === 'Error' && <StatusIndicator status={SystemStatus.Error} animated={false} />}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic text-center">No active sessions.</p>
                    )}
                </div>
            </div>
         </div>
      </DashboardCard>

    </div>
  );
};