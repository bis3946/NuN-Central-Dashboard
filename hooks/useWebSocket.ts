// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { WEBSOCKET_URL, REALTIME_UPDATE_INTERVAL } from '../config';
import { SystemState, LogEntry, FederationNode, SystemStatus, OwnerAllocationState, FederationNetwork, Simulation, WebSocketMessage, OrchestratorMetric, SimulationProposal, AITaskSuggestion, HandshakeStatus, HealthCheck } from '../types';

// This is a *simulated* WebSocket hook. In a real application,
// this would use the WebSocket API (`new WebSocket(...)`).
const generateRandomLog = (): LogEntry => {
    const levels: LogEntry['level'][] = ['INFO', 'INFO', 'INFO', 'TRACE', 'WARN', 'ERROR'];
    const messages = [
        'Heartbeat ACK received from EU-Central-1',
        'VaultMirror HMAC hash verified.',
        'AnaAGI workload balanced. CPU at 65%.',
        'Post-quantum key rotation initiated.',
        'High latency detected on AP-1 node.',
        'Federation handshake with Grok failed. Retrying...',
        'User bis3946 executed macro: System-Wide AI Resync',
    ];
    return {
        timestamp: new Date().toISOString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        hash: Math.random() > 0.3 ? [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') : undefined,
    };
};

const generateRandomNodeUpdate = (nodes: FederationNode[]): { name: string; status: SystemStatus; latency: number } => {
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const newLatency = Math.max(1, node.latency + Math.floor((Math.random() - 0.5) * 20));
    return {
        name: node.name,
        status: Math.random() > 0.9 ? SystemStatus.Warning : SystemStatus.OK,
        latency: newLatency,
    };
};

const generateHealthCheckUpdates = (healthChecks: HealthCheck[]): { updates: Array<{ name: string; status: SystemStatus }> } => {
    // 10% chance to send an "all clear" signal, which satisfies the user's request
    if (Math.random() < 0.1) {
        return {
            updates: healthChecks.map(check => ({ name: check.name, status: SystemStatus.OK }))
        };
    }

    // Otherwise, update one random check
    const check = healthChecks[Math.floor(Math.random() * healthChecks.length)];
    const randomStatusValue = Math.random();
    let newStatus: SystemStatus;
    if (randomStatusValue < 0.7) { // 70% chance to be OK
        newStatus = SystemStatus.OK;
    } else if (randomStatusValue < 0.9) { // 20% chance to be Warning
        newStatus = SystemStatus.Warning;
    } else { // 10% chance to be Error
        newStatus = SystemStatus.Error;
    }
    
    return {
        updates: [{ name: check.name, status: newStatus }]
    };
};

const metricsToUpdate: OrchestratorMetric[] = ['thrust', 'propulsion', 'shield', 'anomaliesCount', 'complianceScore', 'testPassRate'];

const generateRandomMetricUpdate = (): { metric: OrchestratorMetric; value: number } => {
    const metric = metricsToUpdate[Math.floor(Math.random() * metricsToUpdate.length)];
    let value: number;
    switch (metric) {
        case 'thrust': value = 0.95 + Math.random() * 0.1; break;
        case 'propulsion': value = 1.15 + Math.random() * 0.1; break;
        case 'shield': value = 99.5 + Math.random() * 0.5; break;
        case 'anomaliesCount': value = Math.random() < 0.05 ? 1 : 0; break;
        case 'complianceScore': value = Math.random() < 0.05 ? 99.90 + Math.random() * 0.08 : 99.98 + Math.random() * 0.02; break;
        case 'testPassRate': value = Math.random() < 0.02 ? 99.99 : 100.0; break;
        default: value = 0;
    }
    return { metric, value };
};

const aiTaskSuggestionsPool = [
    { title: 'Optimize Q-Mesh Latency', reasoning: 'Network analysis shows a 5% increase in cross-continental latency. Optimizing the routing algorithm is recommended.', proposer: 'Ana AGI', priority: 'High', orchestrators: ['Ana AGI', 'AnaQML'] },
    { title: 'Audit Federation Handshake Security', reasoning: 'A new cryptographic vulnerability (CVE-2024-XXXX) has been reported. An audit is required to ensure our PQ handshake is not affected.', proposer: 'AnnE', priority: 'High', orchestrators: ['AnnE'] },
    { title: 'Increase Resource Allocation to US-East-1', reasoning: 'Predictive analytics forecast a 30% traffic surge in the US-East-1 region. Proactively increasing resources will prevent performance degradation.', proposer: 'Ana AGI', priority: 'Medium', orchestrators: ['Ana AGI'] },
    { title: 'Update AnnA Analytics Model', reasoning: 'The current compliance score model has a 2% drift. Updating to the latest model will improve accuracy.', proposer: 'AnnA', priority: 'Low', orchestrators: ['AnnA'] }
];

const simulationProposalsPool = [
    { proposer: 'Ana AGI', description: 'Simulate a cascading node failure in the Asia-Pacific-1 cluster to test failover protocols.' },
    { proposer: 'AnnE', description: 'Run a parallel stress test on the Post-Quantum handshake under simulated solar flare interference.' },
    { proposer: 'Entity CE-001', description: 'Model the economic impact of adjusting staking rewards by +2.5% over 6 months.' },
    { proposer: 'AnaQML', description: 'Evaluate a new quantum error-correction algorithm against current Qubit decoherence rates.' },
    { proposer: 'Ana ASI', description: 'Test VaultMirror data integrity and restore times after a simulated corruption event.' }
];

export const useWebSocket = (
    onMessage: (message: WebSocketMessage) => void,
    state: SystemState
) => {
    const intervalRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        console.log(`[WebSocket] Simulated connection to ${WEBSOCKET_URL}`);

        intervalRef.current = window.setInterval(() => {
            // --- State-Aware Simulation Logic ---
            // Create a queue of potential actions based on the current state
            const potentialActions: (() => void)[] = [];

            // 1. Pi Network Sync
            if (state.piNetwork.status === 'Syncing') {
                const newSyncedBlocks = Math.min(state.piNetwork.totalPiBlocks, state.piNetwork.syncedBlocks + Math.floor(Math.random() * 500));
                potentialActions.push(() => onMessage({ type: 'PI_NETWORK_SYNC_PROGRESS', payload: { syncedBlocks: newSyncedBlocks } }));
            }
            
            // 2. AI Anomaly & Self-Heal Simulation (less frequent)
            if (Math.random() < 0.08) { // ~8% chance per tick
                const okModules = state.aiModules.filter(m => m.status === SystemStatus.OK);
                if (okModules.length > 0) {
                    const targetModule = okModules[Math.floor(Math.random() * okModules.length)];
                    potentialActions.push(() => {
                        onMessage({ type: 'AI_ANOMALY_DETECTED', payload: { moduleId: targetModule.id } });
                        setTimeout(() => {
                            const versionParts = targetModule.version.split('.').map(Number);
                            versionParts[2] += 1;
                            const newVersion = versionParts.join('.');
                            onMessage({ type: 'AI_SELF_HEAL_COMPLETE', payload: { moduleId: targetModule.id, newVersion } });
                        }, 4000); // 4-second delay for healing
                    });
                }
            }
            
            // 3. Vault Hash Verification
            if (state.nunVault.hashVerificationStatus === 'Verifying') {
                potentialActions.push(() => {
                    // Simulate a delay for the verification process
                    setTimeout(() => {
                        // Send back the result. The status will remain 'Verified' or 'Mismatch' until the user re-initiates.
                        onMessage({ type: 'VAULT_HASH_VERIFIED', payload: { success: Math.random() > 0.1 } });
                    }, 2500);
                });
            }

            // 4. Owner Allocation Process
            const { status } = state.ownerAllocation;
            if (status === 'Connecting') {
                potentialActions.push(() => onMessage({ type: 'OWNER_ALLOCATION_UPDATE', payload: { status: 'Syncing', networksConnected: true } }));
            } else if (status === 'Syncing') {
                potentialActions.push(() => onMessage({ type: 'OWNER_ALLOCATION_UPDATE', payload: { status: 'Executing', chainsSynced: true } }));
            } else if (status === 'Executing') {
                potentialActions.push(() => onMessage({ type: 'OWNER_ALLOCATION_UPDATE', payload: { status: 'Success' } }));
            }

            // 5. Module Syncing
            const syncingModule = state.aiModules.find(m => m.status === SystemStatus.Syncing);
            if (syncingModule) {
                potentialActions.push(() => onMessage({ type: 'MODULE_SYNC_COMPLETE', payload: { moduleId: syncingModule.id } }));
            }
            
            // 6. KYC Verification
            if (state.piNetwork.status === 'Verifying') {
                potentialActions.push(() => onMessage({ type: 'KYC_VERIFICATION_RESULT', payload: { success: Math.random() > 0.1 } }));
            }

            // 7. Session Connections
            const connectingSession = state.sessionManager.connections.find(c => c.status === 'Connecting');
            if (connectingSession) {
                const success = Math.random() > 0.15;
                potentialActions.push(() => onMessage({ type: 'SESSION_CONNECTION_RESULT', payload: { address: connectingSession.address, success, error: success ? undefined : 'Handshake failed' } }));
            }
            
            // 8. Federation Network Connections
            const connectingNetwork = state.federationNetworks.find(n => n.status === 'Connecting' || n.status === 'Syncing');
            if(connectingNetwork) {
                 const success = Math.random() > 0.2;
                 const finalStatus = connectingNetwork.status === 'Connecting' ? (success ? 'Connected' : 'Handshake Failed') : (success ? 'Synced' : 'Error');
                 potentialActions.push(() => onMessage({ type: 'FEDERATION_NETWORK_UPDATE', payload: { networkId: connectingNetwork.id, status: finalStatus }}));
            }

            // 9. PQ Handshake
            if (state.pqHandshakeStatus === 'Establishing') {
                potentialActions.push(() => onMessage({ type: 'PQ_HANDSHAKE_RESULT', payload: { success: Math.random() > 0.15 } }));
            }
            
            // 10. Simulation Progress
            const activeSim = state.simulations.find(s => s.status === 'Ongoing' || s.status === 'Parallel');
            if (activeSim) {
                const newProgress = Math.min(100, activeSim.progress + (Math.random() * 10 * activeSim.speed));
                const isFinished = newProgress >= 100;
                potentialActions.push(() => onMessage({
                    type: 'SIMULATION_PROGRESS', payload: {
                        simulationId: activeSim.id,
                        progress: newProgress,
                        report: isFinished ? `Simulation completed with target '${activeSim.targetParameter}'.\nSUCCESS RATE: 98.7%.\nNetwork remained stable under stress.\nCONCLUSION: Protocol upgrade candidate identified.\nLOGS WRITTEN TO NUN VAULT.` : undefined,
                        participants: isFinished ? ['Ana AGI', 'AnnE', 'AnaQML'] : undefined,
                        successRate: isFinished ? (65 + (Math.random() * 35)) : undefined
                    }
                }));
            }
            
            // 11. Device Sync
            const syncingDevice = state.connectedDevices.find(d => d.status === 'syncing');
            if (syncingDevice) {
                potentialActions.push(() => {
                    setTimeout(() => {
                        onMessage({ type: 'DEVICE_SYNC_COMPLETE', payload: { deviceId: syncingDevice.deviceId } });
                    }, 1500);
                });
            }

            // 12. New Simulation Proposal (increased frequency)
            if (Math.random() < 0.20 && state.simulationProposals.filter(p => p.status === 'Pending').length < 5) {
                const proposal = simulationProposalsPool[Math.floor(Math.random() * simulationProposalsPool.length)];
                const newProposal: SimulationProposal = {
                    id: `sp-${Date.now()}`,
                    proposer: proposal.proposer,
                    description: proposal.description,
                    status: 'Pending',
                };
                 potentialActions.push(() => onMessage({ type: 'NEW_SIMULATION_PROPOSAL', payload: newProposal }));
            }
            
            // 13. New AI Task Suggestion (new feature)
            if (Math.random() < 0.15 && state.taskSuggestions.length < 5) {
                const suggestion = aiTaskSuggestionsPool[Math.floor(Math.random() * aiTaskSuggestionsPool.length)];
                const newSuggestion: AITaskSuggestion = {
                    id: `sugg-${Date.now()}`,
                    title: suggestion.title,
                    proposer: suggestion.proposer,
                    reasoning: suggestion.reasoning,
                    priority: suggestion.priority as any,
                    recommendedOrchestrators: suggestion.orchestrators
                };
                potentialActions.push(() => onMessage({ type: 'NEW_TASK_SUGGESTION', payload: newSuggestion }));
            }

            // 14. Handshake Status update
            const invitationToUpdate = state.federationControl.invitations.find(inv => inv.status !== 'Confirmed' && inv.status !== 'Rejected');
            if (invitationToUpdate && Math.random() < 0.25) { // 25% chance to update an invitation
                const statuses: HandshakeStatus[] = ['Awaiting Delivery', 'Delivered', 'Awaiting Response', 'Confirmed', 'Rejected'];
                const currentStatusIndex = statuses.indexOf(invitationToUpdate.status);
                
                if (currentStatusIndex < statuses.length - 2) { // Can't go past confirmed/rejected randomly
                    let nextStatus = statuses[currentStatusIndex + 1];
                    // If it's awaiting response, randomly decide confirmed/rejected
                    if (nextStatus === 'Confirmed') { 
                        nextStatus = Math.random() > 0.2 ? 'Confirmed' : 'Rejected';
                    }
                    potentialActions.push(() => onMessage({ type: 'HANDSHAKE_STATUS_UPDATE', payload: { invitationId: invitationToUpdate.id, status: nextStatus } }));
                }
            }

            // 15. NuN Vault real-time events (less frequent)
            if (Math.random() < 0.05) { // 5% chance per tick
                // Simulate another user usurping the vault briefly
                if (state.nunVault.status === 'Equilibrium') {
                    potentialActions.push(() => {
                        onMessage({ type: 'VAULT_STATUS_UPDATE', payload: { status: 'Usurped' } });
                        setTimeout(() => {
                            onMessage({ type: 'VAULT_STATUS_UPDATE', payload: { status: 'Equilibrium' } });
                        }, 3000); // Restore after 3 seconds
                    });
                }
            } else if (Math.random() < 0.02) { // 2% chance per tick for snapshot
                potentialActions.push(() => onMessage({ type: 'VAULT_SNAPSHOT_CREATED', payload: { timestamp: new Date().toISOString() } }));
            }


            // --- Execute a prioritized action or a random one ---
            if (potentialActions.length > 0) {
                // Execute the first high-priority task found
                potentialActions[0]();
            } else {
                // Fallback to random ambient updates if no specific process is active
                const messageType = Math.random();
                if (messageType < 0.5) {
                    onMessage({ type: 'NEW_LOG', payload: generateRandomLog() });
                } else if (messageType < 0.75) {
                    onMessage({ type: 'NODE_STATUS_UPDATE', payload: generateRandomNodeUpdate(state.federationNodes) });
                } else if (messageType < 0.95) {
                    if (state.healthChecks.length > 0) {
                        onMessage({ type: 'HEALTH_CHECK_UPDATE', payload: generateHealthCheckUpdates(state.healthChecks) });
                    }
                } else {
                    onMessage({ type: 'METRIC_UPDATE', payload: generateRandomMetricUpdate() });
                }
            }
        }, REALTIME_UPDATE_INTERVAL);

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
            console.log('[WebSocket] Simulated connection closed.');
        };
    }, [onMessage, state]); // Rerun effect if onMessage or state changes
};