

import { SystemState, User, UserRole, Task, TaskPriority, AIModule, SystemStatus, Simulation, SimulationStatus, Block, LogEntry, Device, FederationNetwork, UpgradeProposal, WebSocketMessage, FederationNode, SimulationProposal, AITaskSuggestion } from '../types';

// Helper function to generate a random hash
function generateRandomHash(length: number = 64): string {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Helper to generate coordinates from location string for new nodes
const parseLocation = (location: string): [number, number] | undefined => {
    // This is a dummy implementation. A real one would use a geocoding service.
    if (location.toLowerCase().includes('america')) return [39.82, -98.57];
    if (location.toLowerCase().includes('europe')) return [54.52, 15.25];
    if (location.toLowerCase().includes('asia')) return [34.04, 108.94];
    return [Math.random() * 180 - 90, Math.random() * 360 - 180];
}


// Action type definitions
export type Action =
    // Real-time updates from WebSocket
    | { type: 'WEBSOCKET_MESSAGE_RECEIVED', payload: WebSocketMessage }
    // Auth Actions
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { role: UserRole } }
    | { type: 'LOGIN_FAILURE' }
    // Generic Log/Notification
    | { type: 'ADD_LOG'; payload: Omit<LogEntry, 'timestamp'> }
    | { type: 'ADD_NOTIFICATION'; payload: { type: 'success' | 'error' | 'info' | 'warning'; message: string } }
    | { type: 'REMOVE_NOTIFICATION'; payload: string }
    | { type: 'CLEAR_NOTIFICATIONS' }
    | { type: 'MARK_NOTIFICATIONS_AS_READ' }
    // AI Module Actions
    | { type: 'RESYNC_AI_MODULE'; payload: string }
    | { type: 'RESYNC_ALL_AI_MODULES_START' }
    | { type: 'RESYNC_ALL_AI_MODULES_SUCCESS' }
    | { type: 'RESYNC_ALL_AI_MODULES_FAILURE' }
    // General System Actions
// FIX: Replaced TOGGLE_SIMULATION with CYCLE_NETWORK_MODE to match component usage and correct state structure.
    | { type: 'CYCLE_NETWORK_MODE' }
    | { type: 'UPDATE_DECISION_STATUS'; payload: { id: string; status: 'Approved' | 'Rejected' } }
    | { type: 'CONNECT_SESSION'; payload: { address: string } }
// FIX: Added missing UPDATE_HEALTH_CHECK_STATUS action type.
    | { type: 'UPDATE_HEALTH_CHECK_STATUS'; payload: { name: string; status: SystemStatus } }
    // User Management
    | { type: 'ADD_USER'; payload: { email: string } }
    | { type: 'DELETE_USER'; payload: string }
    | { type: 'CHANGE_USER_ROLE'; payload: { userId: string; newRole: UserRole } }
    // Pi Network
    | { type: 'VERIFY_PI_KYC'; payload: { walletAddress: string } }
    // Wallet Actions
    | { type: 'SEND_TRANSACTION_START'; payload: { recipient: string; amount: number; chainId: string } }
    | { type: 'SEND_TRANSACTION_SUCCESS'; payload: { amount: number; transactionHash: string; chainId: string } }
    | { type: 'SEND_TRANSACTION_FAILURE'; payload: { chainId: string } }
    // Task Management
// FIX: Updated ADD_TASK payload to include dependencies, matching component usage.
    | { type: 'ADD_TASK'; payload: { title: string; priority: TaskPriority; dependencies: string[] } }
    | { type: 'UPDATE_TASK_PRIORITY'; payload: { taskId: string; priority: TaskPriority } }
    | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: Task['status'] } }
    | { type: 'SORT_TASKS_BY_PRIORITY' }
    | { type: 'SORT_TASKS_BY_STATUS' }
    | { type: 'ASSIGN_TASK_ORCHESTRATORS', payload: { taskId: string, orchestratorIds: string[] } }
// FIX: Added missing task-related action types.
    | { type: 'ASSIGN_ALL_ORCHESTRATORS_TO_TASK', payload: { taskId: string } }
    | { type: 'UPDATE_TASK_DEPENDENCIES', payload: { taskId: string, dependencies: string[] } }
    | { type: 'ACCEPT_AI_TASK_SUGGESTION', payload: { suggestionId: string } }
    | { type: 'REJECT_AI_TASK_SUGGESTION', payload: { suggestionId: string } }
    // Simulation
    | { type: 'START_SIMULATION'; payload: { name: string; type: 'Ongoing' | 'Parallel'; proposal?: SimulationProposal } }
    | { type: 'UPDATE_SIMULATION_PARAMETERS'; payload: { simulationId: string; speed: number; targetParameter: Simulation['targetParameter'] } }
    | { type: 'APPROVE_SIMULATION_PROPOSAL', payload: { proposalId: string } }
    // Governance & Nodes
    | { type: 'VOTE_ON_PROPOSAL'; payload: { proposalId: string; vote: 'approve' | 'reject' } }
    | { type: 'TOGGLE_RESOURCE_CONTRIBUTION' }
    | { type: 'APPROVE_NODE'; payload: string }
    | { type: 'REJECT_NODE'; payload: string }
    // Profile & Security
    | { type: 'REGENERATE_API_KEYS'; payload: { userId: string } }
    | { type: 'INITIATE_PASSWORD_RESET', payload: { email: string } }
    | { type: 'COPY_SESSION_ID' }
    // Voice Auth
    | { type: 'SET_VOICE_AUTH_STATUS', payload: 'prompting' | 'recording' | 'verifying' | 'enrolling' | 'mismatch' | 'matched' | 'brainwave-sync' | 'confirmed' | 'error' }
    | { type: 'ENROLL_VOICE', payload: string }
    // Device Management
    | { type: 'REGISTER_DEVICE', payload: Omit<Device, 'deviceId' | 'nodeId' | 'status' | 'resourcesAllocated' | 'resourcesUsed' | 'rewardsEarned' | 'lastSync'> & { deviceId: string } }
    | { type: 'SYNC_DEVICE', payload: { deviceId: string } }
    | { type: 'ALLOCATE_RESOURCES', payload: { deviceId: string; amount: number } }
    // Tokenomics
    | { type: 'INITIATE_GENESIS_MINT' }
    | { type: 'APPROVE_MULTISIG', payload: { signer: string } }
    | { type: 'EXECUTE_OWNER_ALLOCATION' }
    | { type: 'CONFIRM_OWNERSHIP_AND_GENERATE_GENESIS_BLOCK' }
    | { type: 'INITIATE_OWNER_ALLOCATION' }
    | { type: 'UPDATE_OWNER_ALLOCATION_STATUS', payload: SystemState['ownerAllocation'] }
    // Federation
    | { type: 'UPDATE_NETWORK_STATUS'; payload: { networkId: 'pi' | 'session' | 'nun'; status: FederationNetwork['status'] } }
    | { type: 'APPROVE_UPGRADE_PROPOSAL'; payload: { proposalId: string } }
    | { type: 'REJECT_UPGRADE_PROPOSAL', payload: { proposalId: string } }
    | { type: 'REFRESH_PQ_KEYS_START' }
    | { type: 'REFRESH_PQ_KEYS_SUCCESS' }
    | { type: 'REFRESH_PQ_KEYS_FAILURE' }
    | { type: 'INITIATE_NUN_HANDSHAKE', payload: { target: string } }
    // AnaQML
    | { type: 'ANAQML_ADD_TASK', payload: { taskName: string, parameters: object } }
    | { type: 'ANAQML_UPDATE_TASK_RESULT', payload: { taskName: string, result: any } }
    // Verification
    | { type: 'SUBMIT_VERIFICATION_PROOFS', payload: { userId: string, piWalletAddress: string, sessionKey: string, gmail: string } }
    | { type: 'VERIFY_GMAIL', payload: { userId: string } }
    // Anomaly
    | { type: 'UPDATE_AI_MODULE_THRESHOLD', payload: { moduleId: string, newThreshold: number } }
    | { type: 'TOGGLE_ANOMALY_NOTIFICATIONS' }
    // NuN Vault
    | { type: 'USURP_VAULT_EQUILIBRIUM' }
    | { type: 'RESTORE_VAULT_EQUILIBRIUM' }
    | { type: 'CREATE_VAULT_SNAPSHOT' }
    | { type: 'VERIFY_VAULT_HASH_START' }
    // New Root Authority Actions
    | { type: 'TRIGGER_SELF_HEALING' }
    | { type: 'RECALIBRATE_CONSENSUS' }
    | { type: 'PURGE_TEMP_LOGS' };


// Reducer function
export const systemReducer = (state: SystemState, action: Action): SystemState => {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'LOGIN_START':
        return { ...state, isAuthenticating: true };
    case 'LOGIN_SUCCESS':
        return { ...state, isAuthenticating: false };
    case 'LOGIN_FAILURE':
        return { ...state, isAuthenticating: false };
    
    case 'ADD_LOG':
      return {
        ...state,
        logs: [{ timestamp: now, ...action.payload }, ...state.logs].slice(0, 100),
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { id: generateRandomHash(8), read: false, ...action.payload }],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
      
    case 'CLEAR_NOTIFICATIONS':
        return { ...state, notifications: [] };

    case 'MARK_NOTIFICATIONS_AS_READ':
        return { ...state, notifications: state.notifications.map(n => ({...n, read: true})) };

    case 'RESYNC_AI_MODULE':
      return {
        ...state,
        aiModules: state.aiModules.map(m => m.id === action.payload ? { ...m, status: SystemStatus.Syncing } : m),
      };
      
    case 'RESYNC_ALL_AI_MODULES_START':
      return {
        ...state,
        aiModules: state.aiModules.map(m => ({ ...m, status: SystemStatus.Syncing })),
      };

    case 'RESYNC_ALL_AI_MODULES_SUCCESS':
      return {
        ...state,
      };
      
    case 'RESYNC_ALL_AI_MODULES_FAILURE':
      return {
        ...state,
        aiModules: state.aiModules.map(m => ({ ...m, status: SystemStatus.Warning })),
      };

// FIX: Replaced TOGGLE_SIMULATION with CYCLE_NETWORK_MODE and implemented correct logic.
    case 'CYCLE_NETWORK_MODE': {
        const currentMode = state.networkOrchestration.mode;
        const nextMode: SystemState['networkOrchestration']['mode'] = 
            currentMode === 'live' ? 'simulation' :
            currentMode === 'simulation' ? 'standby' :
            'live';
        return {
            ...state,
            networkOrchestration: { ...state.networkOrchestration, mode: nextMode },
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
            logs: [{ timestamp: now, level: 'INFO' as const, message: `Network mode switched to ${nextMode.toUpperCase()}. (Logged to NuN Vault)` }, ...state.logs].slice(0, 100)
        };
    }
      
    case 'EXECUTE_OWNER_ALLOCATION': {
        if (state.tokenomics.multisigTimelock.status !== 'Ready') return state;
        return {
            ...state,
            tokenomics: {
                ...state.tokenomics,
                ownerAllocation: { ...state.tokenomics.ownerAllocation, status: 'Allocated' },
                multisigTimelock: { ...state.tokenomics.multisigTimelock, status: 'Executed' },
            }
        };
    }
    
    case 'CONFIRM_OWNERSHIP_AND_GENERATE_GENESIS_BLOCK': {
        const genesisBlockHash = generateRandomHash();
        const allocationTxHash = generateRandomHash();

        const genesisBlock: Block = {
            height: 1,
            hash: genesisBlockHash,
            timestamp: now,
            transactions: [
                { hash: allocationTxHash } // The 51% allocation transaction
            ],
        };

        const newLogs: LogEntry[] = [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
            { timestamp: now, level: 'INFO' as const, message: 'Ownership confirmed for Root Authority, bis3946, Syshost, Demolition Man, Bojan Milanović.' },
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
            { timestamp: now, level: 'TRACE' as const, message: `NuN Blockchain Genesis Block generated. Hash: ${genesisBlockHash}`, hash: genesisBlockHash },
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
            { timestamp: now, level: 'INFO' as const, message: 'NuN Blockchain technology initiated.' },
        ];

        return {
            ...state,
            logs: [
                ...newLogs,
                ...state.logs,
            ].slice(0, 100),
            notifications: [
                ...state.notifications,
                { id: generateRandomHash(8), read: false, type: 'success', message: 'Ownership Confirmed. NuN Blockchain Genesis Block created.' }
            ],
            tokenomics: {
                ...state.tokenomics,
                ownerAllocation: { ...state.tokenomics.ownerAllocation, status: 'Allocated' },
                multisigTimelock: { ...state.tokenomics.multisigTimelock, status: 'Executed', signatures: ['Root Authority (Password Override)'] },
            },
            ownerAllocation: {
                ...state.ownerAllocation,
                status: 'Success',
                networksConnected: true,
                chainsSynced: true,
            },
            blockchains: state.blockchains.map(bc => 
                bc.name === 'NuN Ledger' 
                ? { ...bc, blockHeight: 1, transactions: 1, status: SystemStatus.OK } 
                : bc
            ),
            blocks: [genesisBlock].slice(0, 20),
        };
    }

    case 'UPDATE_DECISION_STATUS':
        return {
            ...state,
            federatedDecisions: state.federatedDecisions.map(d => d.id === action.payload.id ? { ...d, status: action.payload.status } : d)
        };
        
    case 'CONNECT_SESSION':
        return {
            ...state,
            sessionManager: {
                ...state.sessionManager,
                connections: [...state.sessionManager.connections, { address: action.payload.address, status: 'Connecting' }]
            }
        };

    case 'UPDATE_HEALTH_CHECK_STATUS':
        return {
            ...state,
            healthChecks: state.healthChecks.map(check =>
                check.name === action.payload.name
                    ? { ...check, status: action.payload.status }
                    : check
            ),
        };
        
    case 'ADD_USER': {
        const newUser: User = {
            id: `user-${generateRandomHash(8)}`,
            email: action.payload.email,
            blockchainHash: generateRandomHash(),
            role: UserRole.Member,
            status: 'Active',
            apiKey: `nun_pk_${generateRandomHash(32)}`,
            apiSecret: `nun_sk_${generateRandomHash(32)}`,
        };
        return { ...state, users: [...state.users, newUser] };
    }

    case 'DELETE_USER':
        return { ...state, users: state.users.filter(u => u.id !== action.payload) };

    case 'CHANGE_USER_ROLE':
        return {
            ...state,
            users: state.users.map(u => u.id === action.payload.userId ? { ...u, role: action.payload.newRole } : u)
        };
        
    case 'VERIFY_PI_KYC':
        return { ...state, piNetwork: { ...state.piNetwork, status: 'Verifying', walletAddress: action.payload.walletAddress } };

    case 'SEND_TRANSACTION_START':
        return {
            ...state,
            wallet: { ...state.wallet, isSending: true },
        };

    case 'SEND_TRANSACTION_SUCCESS': {
        const { chainId, amount } = action.payload;
        const typedChainId = chainId as keyof typeof state.wallet.chains;
        return {
            ...state,
            wallet: { 
                ...state.wallet, 
                isSending: false, 
                chains: {
                    ...state.wallet.chains,
                    [typedChainId]: {
                        ...state.wallet.chains[typedChainId],
                        balance: state.wallet.chains[typedChainId].balance - amount
                    }
                }
            },
            blocks: [
                 {
                    height: state.blocks[0]?.height ? state.blocks[0].height + 1 : 1,
                    hash: generateRandomHash(),
                    timestamp: now,
                    transactions: [{ hash: action.payload.transactionHash }, ...(state.blocks[0]?.transactions || [])],
                 },
                 ...state.blocks,
            ].slice(0, 20)
        };
    }
        
    case 'SEND_TRANSACTION_FAILURE':
        return {
             ...state,
            wallet: { ...state.wallet, isSending: false },
        };

// FIX: Updated ADD_TASK implementation to handle dependencies.
    case 'ADD_TASK': {
        const newTask: Task = {
            id: `task-${generateRandomHash(8)}`,
            title: action.payload.title,
            priority: action.payload.priority,
            status: 'Pending',
            assignedOrchestrators: [],
            dependencies: action.payload.dependencies || [],
            origin: 'manual',
        };
        return { ...state, tasks: [newTask, ...state.tasks] };
    }
    
    case 'UPDATE_TASK_PRIORITY':
        return {
            ...state,
            tasks: state.tasks.map(t => t.id === action.payload.taskId ? { ...t, priority: action.payload.priority } : t)
        };
        
    case 'UPDATE_TASK_STATUS': {
        const task = state.tasks.find(t => t.id === action.payload.taskId);
        if (!task) return state;

        if (action.payload.status === 'In Progress') {
            const hasIncompleteDependencies = task.dependencies?.some(depId => {
                const dependency = state.tasks.find(t => t.id === depId);
                return dependency?.status !== 'Completed';
            });

            if (hasIncompleteDependencies) {
                return {
                    ...state,
                    notifications: [
                        ...state.notifications,
                        { id: generateRandomHash(8), read: false, type: 'warning', message: `Task "${task.title}" is blocked by incomplete dependencies.` }
                    ]
                };
            }
        }

        return {
            ...state,
            tasks: state.tasks.map(t => t.id === action.payload.taskId ? { ...t, status: action.payload.status } : t)
        };
    }

// FIX: Added missing reducer cases for task management.
    case 'UPDATE_TASK_DEPENDENCIES':
        return {
            ...state,
            tasks: state.tasks.map(t => t.id === action.payload.taskId ? { ...t, dependencies: action.payload.dependencies } : t)
        };

    case 'ASSIGN_ALL_ORCHESTRATORS_TO_TASK': {
        const allOrchestratorNames = state.aiModules.map(m => m.name);
        return {
            ...state,
            tasks: state.tasks.map(t => t.id === action.payload.taskId ? { ...t, assignedOrchestrators: allOrchestratorNames } : t)
        };
    }

    case 'ACCEPT_AI_TASK_SUGGESTION': {
        const suggestion = state.taskSuggestions.find(s => s.id === action.payload.suggestionId);
        if (!suggestion) return state;

        const newTask: Task = {
            id: `task-${generateRandomHash(8)}`,
            title: suggestion.title,
            priority: suggestion.priority,
            status: 'Pending',
            assignedOrchestrators: suggestion.recommendedOrchestrators,
            dependencies: [],
            origin: 'ai-suggestion',
        };
        return {
            ...state,
            tasks: [newTask, ...state.tasks],
            taskSuggestions: state.taskSuggestions.filter(s => s.id !== action.payload.suggestionId),
            logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                { timestamp: now, level: 'INFO' as const, message: `Accepted AI task suggestion: "${suggestion.title}"` },
                ...state.logs
            ],
            notifications: [
                ...state.notifications,
                { id: generateRandomHash(8), read: false, type: 'success', message: `New task added from AI suggestion.` }
            ]
        };
    }

    case 'REJECT_AI_TASK_SUGGESTION': {
        const rejectedSuggestion = state.taskSuggestions.find(s => s.id === action.payload.suggestionId);
        return {
            ...state,
            taskSuggestions: state.taskSuggestions.filter(s => s.id !== action.payload.suggestionId),
            logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                { timestamp: now, level: 'INFO' as const, message: `Rejected AI task suggestion: "${rejectedSuggestion?.title}"` },
                ...state.logs
            ]
        };
    }
        
    case 'ASSIGN_TASK_ORCHESTRATORS':
        return {
            ...state,
            tasks: state.tasks.map(t => t.id === action.payload.taskId ? { ...t, assignedOrchestrators: action.payload.orchestratorIds } : t)
        };
        
    case 'SORT_TASKS_BY_PRIORITY': {
        const priorityOrder = { [TaskPriority.High]: 1, [TaskPriority.Medium]: 2, [TaskPriority.Low]: 3 };
        return { ...state, tasks: [...state.tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]) };
    }
    
    case 'SORT_TASKS_BY_STATUS': {
        const statusOrder = { 'In Progress': 1, 'Pending': 2, 'Completed': 3 };
         return { ...state, tasks: [...state.tasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]) };
    }
    
    case 'APPROVE_SIMULATION_PROPOSAL':
        return {
            ...state,
            simulationProposals: state.simulationProposals.map(p => p.id === action.payload.proposalId ? { ...p, status: 'Approved' } : p)
        };

    case 'START_SIMULATION': {
         const newSim: Simulation = {
            id: `sim-${generateRandomHash(8)}`,
            name: action.payload.name,
            type: action.payload.type,
            status: action.payload.type === 'Parallel' ? SimulationStatus.Parallel : SimulationStatus.Ongoing,
            progress: 0,
            modules: ['Ana AGI', 'AnaQML', 'Federation Bridge'],
            speed: 1,
            targetParameter: 'Network Latency',
        };
        const newNunBalance = state.wallet.chains.nun.balance - 100;
        const newLogMessage = action.payload.proposal
            ? `Simulation started from proposal: ${action.payload.proposal.id}`
            : `Manual simulation started: ${action.payload.name}`;
            
        return { 
            ...state, 
            simulations: [newSim, ...state.simulations], 
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
            logs: [{ timestamp: now, level: 'INFO' as const, message: newLogMessage }, ...state.logs].slice(0, 100),
            wallet: {
                ...state.wallet, 
                chains: {
                    ...state.wallet.chains,
                    nun: {
                        ...state.wallet.chains.nun,
                        balance: newNunBalance
                    }
                }
            } 
        };
    }

    case 'UPDATE_SIMULATION_PARAMETERS':
        return {
            ...state,
            simulations: state.simulations.map(sim =>
                sim.id === action.payload.simulationId
                    ? { ...sim, speed: action.payload.speed, targetParameter: action.payload.targetParameter }
                    : sim
            ),
            logs: [
                {
                    timestamp: now,
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                    level: 'INFO' as const,
                    message: `Simulation '${state.simulations.find(s => s.id === action.payload.simulationId)?.name}' parameters updated. Speed: ${action.payload.speed}x, Target: ${action.payload.targetParameter}.`,
                },
                ...state.logs,
            ].slice(0, 100),
        };
    
    case 'VOTE_ON_PROPOSAL':
        return {
            ...state,
            governance: {
                ...state.governance,
                proposals: state.governance.proposals.map(p => {
                    if (p.id === action.payload.proposalId && !p.userVote) {
                        return {
                            ...p,
                            userVote: action.payload.vote,
                            votes: { ...p.votes, [action.payload.vote]: p.votes[action.payload.vote] + 1 }
                        };
                    }
                    return p;
                })
            }
        };

    case 'TOGGLE_RESOURCE_CONTRIBUTION':
        return {
            ...state,
            resourceContribution: { ...state.resourceContribution, enabled: !state.resourceContribution.enabled }
        };
        
    case 'APPROVE_NODE': {
        const pendingNode = state.nodeManagement.pendingNodes.find(n => n.id === action.payload);
        if (!pendingNode) return state;

        const newNode: FederationNode = {
            name: `Node ${pendingNode.id.slice(-6)}`,
            location: parseLocation(pendingNode.location),
            latency: 50 + Math.floor(Math.random() * 100),
            status: SystemStatus.OK,
            type: 'Device',
        };

        return {
            ...state,
            nodeManagement: {
                ...state.nodeManagement,
                pendingNodes: state.nodeManagement.pendingNodes.filter(n => n.id !== action.payload)
            },
            federationNodes: [...state.federationNodes, newNode],
            logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                { timestamp: now, level: 'INFO' as const, message: `Node ${newNode.name} approved and joined the federation.` },
                ...state.logs
            ].slice(0, 100),
            notifications: [
                ...state.notifications,
                { id: generateRandomHash(8), read: false, type: 'success', message: `New node ${newNode.name} is now online.` }
            ],
        };
    }
        
    case 'REJECT_NODE':
        return {
            ...state,
            nodeManagement: {
                ...state.nodeManagement,
                pendingNodes: state.nodeManagement.pendingNodes.filter(n => n.id !== action.payload)
            },
            logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                { timestamp: now, level: 'WARN' as const, message: `Node join request ${action.payload} rejected.` },
                ...state.logs
            ].slice(0, 100)
        };
        
    case 'REGENERATE_API_KEYS':
        return {
            ...state,
            users: state.users.map(u => u.id === action.payload.userId ? {
                ...u,
                apiKey: `nun_pk_${generateRandomHash(32)}`,
                apiSecret: `nun_sk_${generateRandomHash(32)}`,
            } : u)
        };

    case 'SET_VOICE_AUTH_STATUS':
        return { ...state, voiceAuthStatus: action.payload };

    case 'ENROLL_VOICE':
        return { ...state, voiceTemplate: action.payload };
        
    case 'REGISTER_DEVICE': {
        if(state.connectedDevices.some(d => d.deviceId === action.payload.deviceId)) return state;
        const newDevice: Device = {
            ...action.payload,
            nodeId: `node-${generateRandomHash(12)}`,
            status: 'connected',
            resourcesAllocated: 200,
            resourcesUsed: 15.7,
            rewardsEarned: 1.57,
            lastSync: now,
        };
        return { ...state, connectedDevices: [newDevice, ...state.connectedDevices] };
    }

    case 'SYNC_DEVICE':
        return {
            ...state,
            connectedDevices: state.connectedDevices.map(d => d.deviceId === action.payload.deviceId ? { ...d, status: 'syncing' } : d)
        };
        
    case 'ALLOCATE_RESOURCES':
         return {
            ...state,
            connectedDevices: state.connectedDevices.map(d => d.deviceId === action.payload.deviceId ? { ...d, resourcesAllocated: d.resourcesAllocated + action.payload.amount } : d)
        };
    
    case 'INITIATE_GENESIS_MINT':
        return {
            ...state,
            tokenomics: {
                ...state.tokenomics,
                multisigTimelock: { ...state.tokenomics.multisigTimelock, status: 'Pending' }
            }
        };
        
    case 'APPROVE_MULTISIG': {
        const { multisigTimelock } = state.tokenomics;
        if (multisigTimelock.status !== 'Pending' || multisigTimelock.signatures.includes(action.payload.signer)) {
            return state;
        }
        const newSignatures = [...multisigTimelock.signatures, action.payload.signer];
        const allSigned = newSignatures.length >= multisigTimelock.requiredSignatures;
        
        return {
            ...state,
            tokenomics: {
                ...state.tokenomics,
                multisigTimelock: {
                    ...multisigTimelock,
                    signatures: newSignatures,
                    status: allSigned ? 'TimelockActive' : 'Pending',
                    timelockExpiresAt: allSigned ? new Date(Date.now() + 5000).toISOString() : undefined,
                }
            }
        };
    }
    
    case 'INITIATE_OWNER_ALLOCATION':
        return {
            ...state,
            ownerAllocation: { ...state.ownerAllocation, status: 'Connecting' }
        };
        
    case 'UPDATE_NETWORK_STATUS':
        return {
            ...state,
            federationNetworks: state.federationNetworks.map(n =>
                n.id === action.payload.networkId
                ? { ...n, status: action.payload.status }
                : n
            )
        };
        
    case 'APPROVE_UPGRADE_PROPOSAL':
        return {
            ...state,
            upgradeProposals: state.upgradeProposals.map(p => p.id === action.payload.proposalId ? {...p, status: 'Approved'} : p)
        };
        
    case 'REJECT_UPGRADE_PROPOSAL':
         return {
            ...state,
            upgradeProposals: state.upgradeProposals.map(p => p.id === action.payload.proposalId ? {...p, status: 'Rejected'} : p)
        };
    
    case 'REFRESH_PQ_KEYS_START':
        return { ...state, pqHandshakeStatus: 'Establishing' };
    
    case 'REFRESH_PQ_KEYS_SUCCESS':
        return { ...state, pqHandshakeStatus: 'Active' };

    case 'REFRESH_PQ_KEYS_FAILURE':
        return { ...state, pqHandshakeStatus: 'Failed' };
        
    case 'ANAQML_ADD_TASK':
        return {
            ...state,
            aiAgents: {
                ...state.aiAgents,
                anaQML: {
                    ...state.aiAgents.anaQML,
                    tasks: [
                        ...(state.aiAgents.anaQML.tasks || []),
                        {
                            ...action.payload,
                            status: 'pending',
                            createdAt: now,
                            result: null,
                        }
                    ]
                }
            }
        };

    case 'ANAQML_UPDATE_TASK_RESULT':
        return {
            ...state,
            aiAgents: {
                ...state.aiAgents,
                anaQML: {
                    ...state.aiAgents.anaQML,
                    tasks: state.aiAgents.anaQML.tasks?.map(t =>
                        t.taskName === action.payload.taskName
                            ? { ...t, status: 'completed', result: action.payload.result }
                            : t
                    )
                }
            }
        };
        
    case 'SUBMIT_VERIFICATION_PROOFS':
        return {
            ...state,
            users: state.users.map(u => u.id === action.payload.userId ? {
                ...u,
                piWalletAddress: action.payload.piWalletAddress,
                sessionKey: action.payload.sessionKey,
                gmail: action.payload.gmail,
            } : u)
        };

    case 'VERIFY_GMAIL':
        return {
            ...state,
            users: state.users.map(u => u.id === action.payload.userId ? { ...u, gmailVerified: true } : u)
        };
        
    case 'UPDATE_AI_MODULE_THRESHOLD':
        return {
            ...state,
            aiModules: state.aiModules.map(m => m.id === action.payload.moduleId ? {...m, threshold: action.payload.newThreshold} : m)
        };

    case 'TOGGLE_ANOMALY_NOTIFICATIONS':
        return {
            ...state,
            anomalyNotificationsEnabled: !state.anomalyNotificationsEnabled
        };

    case 'USURP_VAULT_EQUILIBRIUM':
      return {
        ...state,
        nunVault: {
          ...state.nunVault,
          status: 'Usurped',
          distribution: {
            transfer: 80,
            atmospheric: 10,
            orbital: 10,
          },
        },
      };

    case 'RESTORE_VAULT_EQUILIBRIUM':
      return {
        ...state,
        nunVault: {
          ...state.nunVault,
          status: 'Equilibrium',
          distribution: {
            transfer: 33.3,
            atmospheric: 33.3,
            orbital: 33.4,
          },
        },
      };
    
    case 'CREATE_VAULT_SNAPSHOT':
        return {
            ...state,
            nunVault: { ...state.nunVault, lastSnapshotTimestamp: now },
            logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                { timestamp: now, level: 'TRACE' as const, message: `Immutable system snapshot created in NuN Vault.`, hash: generateRandomHash(8) },
                ...state.logs
            ].slice(0, 100),
            notifications: [
                ...state.notifications,
                { id: generateRandomHash(8), read: false, type: 'info', message: 'System state snapshot created.' }
            ],
        };

    case 'VERIFY_VAULT_HASH_START':
        if (state.nunVault.hashVerificationStatus !== 'Idle' && state.nunVault.hashVerificationStatus !== 'Verified' && state.nunVault.hashVerificationStatus !== 'Mismatch') return state;
        return {
            ...state,
            nunVault: { ...state.nunVault, hashVerificationStatus: 'Verifying' },
            logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                { timestamp: now, level: 'INFO' as const, message: `Initiating VaultMirror HMAC master hash verification...` },
                ...state.logs
            ].slice(0, 100)
        };
    
    case 'TRIGGER_SELF_HEALING':
        return {
            ...state,
            aiModules: state.aiModules.map(m => ({...m, status: SystemStatus.Syncing})),
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
            logs: [{ timestamp: now, level: 'WARN' as const, message: `ROOT: System-wide self-healing protocol triggered. (Logged to NuN Vault)` }, ...state.logs].slice(0,100),
            notifications: [...state.notifications, { id: generateRandomHash(8), read: false, type: 'info', message: 'System-wide self-healing initiated.' }]
        };
        
    case 'RECALIBRATE_CONSENSUS':
        return {
            ...state,
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
            logs: [{ timestamp: now, level: 'INFO' as const, message: `ROOT: Federation consensus recalibration initiated. (Logged to NuN Vault)` }, ...state.logs].slice(0,100),
            notifications: [...state.notifications, { id: generateRandomHash(8), read: false, type: 'info', message: 'Federation consensus is being recalibrated.' }]
        };
    
    case 'PURGE_TEMP_LOGS':
        return {
            ...state,
            logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                { timestamp: now, level: 'INFO' as const, message: `ROOT: Temporary system logs purged. (Logged to NuN Vault)` },
                ...state.logs.filter(l => l.level === 'ERROR' || l.level === 'WARN')
            ].slice(0,100),
            notifications: [...state.notifications, { id: generateRandomHash(8), read: false, type: 'success', message: 'Temporary logs have been purged.' }]
        };

    case 'INITIATE_NUN_HANDSHAKE':
        return {
            ...state,
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
            logs: [{ timestamp: now, level: 'INFO' as const, message: `ROOT: Initiating NuN Handshake with ${action.payload.target}. (Logged to NuN Vault)` }, ...state.logs].slice(0, 100),
            notifications: [...state.notifications, { id: generateRandomHash(8), read: false, type: 'info', message: `Invitation sent to ${action.payload.target}.` }]
        };

    case 'WEBSOCKET_MESSAGE_RECEIVED': {
        const { type, payload } = action.payload;
        switch (type) {
            case 'NEW_LOG':
                return {
                    ...state,
                    logs: [payload, ...state.logs].slice(0, 100),
                };
            case 'NODE_STATUS_UPDATE':
                return {
                    ...state,
                    federationNodes: state.federationNodes.map(node =>
                        node.name === payload.name
                            ? { ...node, status: payload.status, latency: payload.latency }
                            : node
                    ),
                };
            case 'METRIC_UPDATE': {
                if (payload.metric === 'anomaliesCount' && payload.value > 0) {
                    return {
                        ...state,
                        orchestratorMetrics: {
                            ...state.orchestratorMetrics,
                            anomaliesCount: state.orchestratorMetrics.anomaliesCount + payload.value,
                        },
                    };
                }
                return {
                    ...state,
                    orchestratorMetrics: {
                        ...state.orchestratorMetrics,
                        [payload.metric]: payload.value,
                    },
                };
            }
            case 'MODULE_SYNC_COMPLETE':
                return {
                    ...state,
                    aiModules: state.aiModules.map(m => m.id === payload.moduleId ? { ...m, status: SystemStatus.OK } : m),
                };
            case 'DEVICE_SYNC_COMPLETE': {
                return {
                    ...state,
                    connectedDevices: state.connectedDevices.map(d =>
                        d.deviceId === payload.deviceId
                            ? { ...d, status: 'connected', lastSync: now }
                            : d
                    ),
                };
            }
            case 'KYC_VERIFICATION_RESULT': {
                if (payload.success) {
                    return {
                        ...state,
                        piNetwork: {
                            ...state.piNetwork,
                            kycVerified: true,
                            status: 'Syncing', // Start syncing after successful KYC
                        },
                        notifications: [
                            ...state.notifications,
                            { id: generateRandomHash(8), read: false, type: 'success', message: 'Pi KYC Verified. Starting chain sync.' }
                        ]
                    };
                }
                // If KYC fails
                return {
                    ...state,
                    piNetwork: {
                        ...state.piNetwork,
                        kycVerified: false,
                        status: 'Error'
                    },
                    notifications: [
                        ...state.notifications,
                        { id: generateRandomHash(8), read: false, type: 'error', message: 'Pi KYC Verification Failed.' }
                    ]
                };
            }
            case 'SESSION_CONNECTION_RESULT':
                return {
                    ...state,
                    sessionManager: {
                        ...state.sessionManager,
                        connections: state.sessionManager.connections.map(c => c.address === payload.address ? {
                            ...c,
                            status: payload.success ? 'Connected' : 'Error',
                            lastError: payload.error
                        } : c)
                    }
                };
             case 'FEDERATION_NETWORK_UPDATE':
                return {
                    ...state,
                    federationNetworks: state.federationNetworks.map(n =>
                        n.id === payload.networkId
                        ? { ...n, status: payload.status }
                        : n
                    )
                };
            case 'OWNER_ALLOCATION_UPDATE':
                return {
                    ...state,
                    ownerAllocation: { ...state.ownerAllocation, ...payload }
                };
            case 'PQ_HANDSHAKE_RESULT':
                return {
                    ...state,
                    pqHandshakeStatus: payload.success ? 'Active' : 'Failed'
                };
// FIX: Updated SIMULATION_PROGRESS logic to auto-create tasks on successful completion.
            case 'SIMULATION_PROGRESS': {
                let nextState = {
                    ...state,
                    simulations: state.simulations.map(sim => {
                        if (sim.id === payload.simulationId) {
                            const isFinished = payload.progress >= 100;
                            return {
                                ...sim,
                                progress: isFinished ? 100 : payload.progress,
                                status: isFinished ? SimulationStatus.Finished : sim.status,
                                report: isFinished ? payload.report : sim.report,
                                participants: isFinished ? payload.participants : sim.participants,
                                successRate: isFinished ? payload.successRate : sim.successRate
                            };
                        }
                        return sim;
                    })
                };

                if (payload.progress >= 100 && payload.successRate) {
                    const sim = state.simulations.find(s => s.id === payload.simulationId);
                    if (sim) {
                        const isCritical = sim.name.toLowerCase().includes('security') || sim.name.toLowerCase().includes('protocol') || sim.name.toLowerCase().includes('core');
                        const threshold = isCritical ? 85 : 70;

                        if (payload.successRate >= threshold) {
                            const newTask: Task = {
                                id: `task-from-sim-${sim.id.slice(-4)}`,
                                title: `Implement [${payload.successRate.toFixed(1)}% Success]: ${sim.name}`,
                                priority: isCritical ? TaskPriority.High : TaskPriority.Medium,
                                status: 'Pending',
                                assignedOrchestrators: sim.modules,
                                dependencies: [],
                                origin: 'simulation',
                            };

                            nextState.tasks = [newTask, ...nextState.tasks];
                            const successMessage = `Simulation "${sim.name}" passed with ${payload.successRate.toFixed(1)}% success. Implementation task auto-created.`;
                            nextState.notifications = [...nextState.notifications, { id: generateRandomHash(8), read: false, type: 'success', message: successMessage }];
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                            nextState.logs = [{ timestamp: now, level: 'INFO' as const, message: successMessage }, ...nextState.logs];
                        } else {
                             const failureMessage = `Simulation "${sim.name}" finished with ${payload.successRate.toFixed(1)}% success rate, below the ${threshold}% threshold for auto-implementation.`;
                             nextState.notifications = [...nextState.notifications, { id: generateRandomHash(8), read: false, type: 'warning', message: failureMessage }];
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                             nextState.logs = [{ timestamp: now, level: 'WARN' as const, message: failureMessage }, ...nextState.logs];
                        }
                    }
                }
                return nextState;
            }
// FIX: Updated PI_NETWORK_SYNC_PROGRESS logic for better state transitions and notifications.
            case 'PI_NETWORK_SYNC_PROGRESS': {
                const isSynced = payload.syncedBlocks >= state.piNetwork.totalPiBlocks;
                let finalStatus: SystemState['piNetwork']['status'] = isSynced ? 'Synced' : 'Syncing';

                // Check for integration
                if (isSynced && state.piNetwork.kycVerified) {
                    finalStatus = 'Integrated';
                }

                if (isSynced && state.piNetwork.status !== 'Synced' && state.piNetwork.status !== 'Integrated') {
                     // Add a notification and log when sync completes
                    const message = finalStatus === 'Integrated' 
                        ? 'Pi Network fully integrated into NuN Nexus of Unity.' 
                        : 'Pi Network chain sync complete.';
                    return {
                        ...state,
                        piNetwork: {
                            ...state.piNetwork,
                            syncedBlocks: state.piNetwork.totalPiBlocks, // Ensure it's exactly total
                            status: finalStatus,
                            lastSync: now,
                        },
                        logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                            { timestamp: now, level: 'INFO' as const, message },
                             ...state.logs
                        ].slice(0, 100),
                         notifications: [
                            ...state.notifications,
                            { id: generateRandomHash(8), read: false, type: 'success', message }
                        ]
                    };
                }

                return {
                    ...state,
                    piNetwork: {
                        ...state.piNetwork,
                        syncedBlocks: payload.syncedBlocks,
                        status: finalStatus,
                        lastSync: now,
                    }
                };
            }
            case 'AI_ANOMALY_DETECTED': {
                const moduleName = state.aiModules.find(m => m.id === payload.moduleId)?.name || 'Unknown Module';
                return {
                    ...state,
                    aiModules: state.aiModules.map(m => m.id === payload.moduleId ? { ...m, status: SystemStatus.Error } : m),
                    logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                        { timestamp: now, level: 'ERROR' as const, message: `ANOMALY DETECTED in ${moduleName}. Initiating self-healing protocol.` },
                        ...state.logs
                    ].slice(0, 100),
                    notifications: [
                        ...state.notifications,
                        { id: generateRandomHash(8), read: false, type: 'error', message: `Anomaly detected in ${moduleName}!` }
                    ],
                };
            }
            case 'AI_SELF_HEAL_COMPLETE': {
                const moduleName = state.aiModules.find(m => m.id === payload.moduleId)?.name || 'Unknown Module';
                const currentVersions = state.versionHistory[state.versionHistory.length - 1]?.versions || {};
                const newVersionHistoryEntry = {
                    timestamp: Date.now(),
                    versions: {
                        ...currentVersions,
                        [payload.moduleId]: payload.newVersion,
                    }
                };
                return {
                    ...state,
                    aiModules: state.aiModules.map(m => m.id === payload.moduleId ? { ...m, status: SystemStatus.OK, version: payload.newVersion } : m),
                    logs: [
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                        { timestamp: now, level: 'INFO' as const, message: `${moduleName} self-healing successful. Module upgraded to v${payload.newVersion}.` },
// FIX: Added 'as const' to ensure TypeScript infers the correct literal type for the log level.
                        { timestamp: now, level: 'TRACE' as const, message: `New version data stored in NuN Vault.` },
                        ...state.logs
                    ].slice(0, 100),
                    versionHistory: [...state.versionHistory, newVersionHistoryEntry],
                    notifications: [
                        ...state.notifications,
                        { id: generateRandomHash(8), read: false, type: 'success', message: `${moduleName} self-healed and upgraded to v${payload.newVersion}.` }
                    ],
                };
            }
            case 'VAULT_HASH_VERIFIED': {
                const status = payload.success ? 'Verified' : 'Mismatch';
                const logLevel: LogEntry['level'] = payload.success ? 'INFO' : 'ERROR';
                const message = `VaultMirror HMAC hash verification complete. Status: ${status}.`;
                return {
                    ...state,
                    nunVault: { ...state.nunVault, hashVerificationStatus: status },
                    logs: [
                        { timestamp: now, level: logLevel, message },
                        ...state.logs
                    ].slice(0, 100),
                };
            }
            case 'NEW_SIMULATION_PROPOSAL': {
                if (state.simulationProposals.some(p => p.id === payload.id)) {
                    return state;
                }
                return {
                    ...state,
                    simulationProposals: [...state.simulationProposals, payload]
                }
            }
            case 'NEW_TASK_SUGGESTION': {
                if (state.taskSuggestions.some(s => s.id === payload.id)) {
                    return state;
                }
                return {
                    ...state,
                    taskSuggestions: [payload, ...state.taskSuggestions],
                    notifications: [
                        ...state.notifications,
                        { id: generateRandomHash(8), read: false, type: 'info', message: `New task suggestion from ${payload.proposer}.` }
                    ]
                }
            }
            default:
                return state;
        }
    }


    default:
      return state;
  }
};