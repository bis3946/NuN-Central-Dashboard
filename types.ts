// This file defines the core data structures and enumerations used throughout the NuN Central Dashboard application.

export enum SystemStatus {
  OK = 'OK',
  Warning = 'Warning',
  Error = 'Error',
  Syncing = 'Syncing',
}

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Moderator = 'Moderator',
  Member = 'Member',
  Restricted = 'Restricted',
  Banned = 'Banned',
}

export interface User {
  id: string;
  email: string;
  blockchainHash: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  apiKey: string;
  apiSecret: string;
  referredBy?: string;
  piWalletAddress?: string;
  sessionKey?: string;
  gmail?: string;
  gmailVerified?: boolean;
  personalInfo?: {
      name: string;
      dob: string;
      pob: string;
      aliases: string[];
  };
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'TRACE';
  message: string;
  hash?: string;
}

export interface Blockchain {
  name: string;
  entityType: 'Human' | 'Entity' | 'AI';
  status: SystemStatus;
  blockHeight: number;
  transactions: number;
}

export interface AIModule {
  id: string;
  name: string;
  version: string;
  status: SystemStatus;
  threshold: number;
}

export interface HealthCheck {
  name: string;
  port: number;
  status: SystemStatus;
}

export interface FederationNode {
  name: string;
  location?: [number, number];
  latency: number;
  status: SystemStatus;
  type?: 'Core' | 'SuperNode' | 'Device';
}

export interface FederatedDecision {
  id: string;
  source: string;
  proposal: string;
  confidence: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PredictedEvent {
  id: string;
  description: string;
  probability: number;
  recommendedAction: string;
}

export interface SessionConnection {
  address: string;
  status: 'Connecting' | 'Connected' | 'Error';
  lastError?: string;
}

export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedOrchestrators?: string[];
  dependencies?: string[];
  origin?: 'simulation' | 'ai-suggestion' | 'manual';
}

export interface AITaskSuggestion {
    id: string;
    title: string;
    proposer: string; // e.g., 'Ana AGI'
    reasoning: string;
    priority: TaskPriority;
    recommendedOrchestrators: string[];
}

export enum SimulationStatus {
  Ongoing = 'Ongoing',
  Parallel = 'Parallel',
  Finished = 'Finished',
  Failed = 'Failed',
}

export interface SimulationProposal {
    id: string;
    proposer: string;
    description: string;
    status: 'Pending' | 'Approved';
}

export interface Simulation {
  id: string;
  name: string;
  type: 'Ongoing' | 'Parallel';
  status: SimulationStatus;
  progress: number;
  modules: string[];
  report?: string;
  participants?: string[];
  successRate?: number;
  speed: number;
  targetParameter: 'Network Latency' | 'Node Failure Rate' | 'Qubit Decoherence';
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  read: boolean;
}

export interface Block {
  height: number;
  hash: string;
  timestamp: string;
  transactions: { hash: string }[];
}

export interface MultisigTimelock {
  status: 'Idle' | 'Pending' | 'TimelockActive' | 'Ready' | 'Executed';
  signatures: string[];
  requiredSignatures: number;
  timelockExpiresAt?: string;
}

export interface Tokenomics {
  totalSupply: number;
  ownerAllocation: {
    owner: string;
    amount: number;
    status: 'Pending' | 'Allocated';
  };
  distributionBuckets: { id: string; bucket: string; amount: number }[];
  multisigTimelock: MultisigTimelock;
}

export interface VersionHistoryEntry {
    timestamp: number;
    versions: Record<string, string>;
}

export interface Device {
  deviceId: string;
  model: string;
  storageGB: number;
  isOwner: boolean;
  nodeId: string;
  status: 'connected' | 'disconnected' | 'syncing';
  resourcesAllocated: number;
  resourcesUsed: number;
  rewardsEarned: number;
  lastSync: string;
}

export type BlockchainConnectionStatus = 'pending' | 'connecting' | 'connected' | 'failed';

export interface OwnerAllocationState {
    status: 'Idle' | 'Connecting' | 'Syncing' | 'Ready' | 'Executing' | 'Success' | 'Failed';
    networksConnected: boolean;
    chainsSynced: boolean;
    sessionId: string;
    targetWallet: string;
    blockchainConnections: Record<string, BlockchainConnectionStatus>;
}

export interface ConsciousEntity {
  id: string;
  name: string;
  status: 'Active' | 'Idle' | 'Offline';
}

export interface FederationNetwork {
  id: 'pi' | 'session' | 'nun';
  name: string;
  status: 'Disconnected' | 'Connecting' | 'Connected' | 'Error' | 'Syncing' | 'Synced' | 'Handshake Failed';
}

export interface UpgradeProposal {
  id: string;
  proposer: string; // ConsciousEntity ID
  targetModel: string; // AIModule ID
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface WalletChain {
    address: string;
    balance: number;
    symbol: string;
    name: string;
}

export interface NunVaultState {
  totalSizeTB: number;
  status: 'Equilibrium' | 'Usurped';
  distribution: {
    transfer: number; // percentage
    atmospheric: number; // percentage
    orbital: number; // percentage
  };
  lastSnapshotTimestamp: string | null;
  hashVerificationStatus: 'Idle' | 'Verifying' | 'Mismatch' | 'Verified';
}

export type HandshakeStatus = 'Awaiting Delivery' | 'Delivered' | 'Awaiting Response' | 'Confirmed' | 'Rejected';

export interface HandshakeInvitation {
  id: string;
  target: string;
  status: HandshakeStatus;
  timestamp: string;
}


// FIX: Moved WebSocketMessage and related types here from hooks/useWebSocket.ts to break a circular dependency.
export type OrchestratorMetric = 'thrust' | 'propulsion' | 'shield' | 'anomaliesCount' | 'complianceScore' | 'testPassRate';

export type WebSocketMessage =
    | { type: 'NEW_LOG'; payload: LogEntry }
    | { type: 'NODE_STATUS_UPDATE'; payload: { name: string; status: SystemStatus; latency: number } }
    | { type: 'METRIC_UPDATE'; payload: { metric: OrchestratorMetric; value: number } }
    | { type: 'HEALTH_CHECK_UPDATE'; payload: { updates: Array<{ name: string; status: SystemStatus }> } }
    | { type: 'MODULE_SYNC_COMPLETE'; payload: { moduleId: string } }
    | { type: 'SIMULATION_PROGRESS'; payload: { simulationId: string; progress: number; report?: string; participants?: string[]; successRate?: number } }
    | { type: 'KYC_VERIFICATION_RESULT'; payload: { success: boolean } }
    | { type: 'SESSION_CONNECTION_RESULT'; payload: { address: string; success: boolean; error?: string } }
    | { type: 'OWNER_ALLOCATION_UPDATE'; payload: Partial<OwnerAllocationState> & { status: OwnerAllocationState['status']} }
    | { type: 'FEDERATION_NETWORK_UPDATE'; payload: { networkId: 'pi' | 'session' | 'nun'; status: FederationNetwork['status'] } }
    | { type: 'PQ_HANDSHAKE_RESULT'; payload: { success: boolean } }
    | { type: 'DEVICE_SYNC_COMPLETE'; payload: { deviceId: string } }
    | { type: 'TRIGGER_NOTIFICATION', payload: { type: 'success' | 'error' | 'info' | 'warning', message: string } }
    | { type: 'PI_NETWORK_SYNC_PROGRESS'; payload: { syncedBlocks: number } }
    | { type: 'AI_ANOMALY_DETECTED'; payload: { moduleId: string } }
    | { type: 'AI_SELF_HEAL_COMPLETE'; payload: { moduleId: string; newVersion: string } }
    | { type: 'VAULT_HASH_VERIFIED'; payload: { success: boolean } }
    | { type: 'NEW_SIMULATION_PROPOSAL'; payload: SimulationProposal }
    | { type: 'NEW_TASK_SUGGESTION'; payload: AITaskSuggestion }
    | { type: 'HANDSHAKE_STATUS_UPDATE'; payload: { invitationId: string; status: HandshakeStatus } }
    | { type: 'VAULT_STATUS_UPDATE'; payload: { status: 'Equilibrium' | 'Usurped' } }
    | { type: 'VAULT_SNAPSHOT_CREATED'; payload: { timestamp: string } };


// Fix: Moved SystemState interface here from SystemContext.tsx to resolve circular dependencies.
export interface SystemState {
    isAuthenticating: boolean;
    aiModules: AIModule[];
    blockchains: Blockchain[];
    healthChecks: HealthCheck[];
    orchestratorMetrics: {
        thrust: number;
        propulsion: number;
        shield: number;
        anomaliesCount: number;
        complianceScore: number;
        testPassRate: number;
    };
    federationNodes: FederationNode[];
    logs: LogEntry[];
    tokenomics: Tokenomics;
    networkOrchestration: {
        mode: 'live' | 'simulation' | 'standby';
        federationPartners: { id: string; name: string; status: 'Handshake OK' | 'Syncing' | 'Error' }[];
    };
    federatedDecisions: FederatedDecision[];
    predictedEvents: PredictedEvent[];
    neuroMetrics: {
        resonance: number;
        neuroplasticity: number;
        feedbackStatus: 'NOMINAL' | 'DEGRADED';
    };
    sessionManager: {
        connections: SessionConnection[];
    };
    nodes: {
        active: number;
        super: number;
    };
    users: User[];
    piNetwork: {
        status: 'Idle' | 'Syncing' | 'Synced' | 'Verifying' | 'Verified' | 'Error' | 'Disconnected' | 'Integrated';
        syncedBlocks: number;
        totalPiBlocks: number;
        lastSync: string | null;
        kycVerified: boolean;
        walletAddress?: string;
    };
    wallet: {
        chains: {
            nun: WalletChain;
            pi: WalletChain;
            eth: WalletChain;
            btc: WalletChain;
        };
        isSending: boolean;
        passphrase: string;
    };
    blocks: Block[];
    systemSync: {
        status: 'Synchronized' | 'Pending';
        selfHealingActive: boolean;
        targetDevice: {
            model: string;
            storage: string;
        };
    };
    tasks: Task[];
    simulations: Simulation[];
    notifications: Notification[];
    voiceTemplate: string | null;
    voiceAuthStatus: 'prompting' | 'recording' | 'verifying' | 'enrolling' | 'mismatch' | 'matched' | 'brainwave-sync' | 'confirmed' | 'error';
    resourceContribution: {
        enabled: boolean;
        cpuUsage: number;
        storageAllocatedGB: number;
        bandwidthMbps: number;
    };
    multiDomainStorage: {
        media: { usedGB: number; totalGB: number; };
        air: { status: 'Connected' | 'Disconnected'; nodes: number; };
        space: { status: 'Uplink Active' | 'Uplink Inactive'; latency: number; };
    };
    governance: {
        proposals: {
            id: string;
            title: string;
            proposer: string;
            status: 'Active' | 'Passed' | 'Failed';
            votes: { approve: number; reject: number; };
            userVote?: 'approve' | 'reject';
        }[];
    };
    tokenomicsIncentives: {
        contributionScore: number;
        pendingRewards: number;
        networkRank: number;
    };
    dataTransfer: {
        totalTransferredGB: number;
        activeSessions: number;
        transferRateMbps: number;
    };
    nodeManagement: {
        pendingNodes: { id: string; location: string; }[];
    };
    referralSystem: {
        sessionId: string;
        referralCount: number;
        totalRewards: number;
    };
    tokenMarket: {
        priceUSD: number;
        change24h: number;
        lastUpdated: string;
    };
    anaQMLMetrics: {
        qubitCoherence: number;
        neuralAccuracy: number;
        modelConfidence: number;
    };
    versionHistory: VersionHistoryEntry[];
    sessionNetwork: {
        status: 'Idle' | 'Syncing' | 'Synced' | 'Error';
        key?: string;
        lastSync: string | null;
    };
    aiAgents: {
        [key: string]: {
            initialized: boolean;
            tasks?: {
                taskName: string;
                parameters: object;
                status: 'pending' | 'completed';
                createdAt: string;
                result: any | null;
            }[];
        }
    };
    connectedDevices: Device[];
    ownerAllocation: OwnerAllocationState;
    consciousEntities: ConsciousEntity[];
    federationNetworks: FederationNetwork[];
    upgradeProposals: UpgradeProposal[];
    pqHandshakeStatus: 'Pending' | 'Active' | 'Establishing' | 'Failed';
    nunVault: NunVaultState;
    anomalyNotificationsEnabled: boolean;
    simulationProposals: SimulationProposal[];
    taskSuggestions: AITaskSuggestion[];
    federationControl: {
        invitationTarget: string;
        invitations: HandshakeInvitation[];
    };
}