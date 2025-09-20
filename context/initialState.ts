import { SystemState, SystemStatus, UserRole, TaskPriority, SimulationStatus, VersionHistoryEntry, LogEntry, User, SimulationProposal, AITaskSuggestion, HandshakeInvitation } from '../types';

function generateRandomHash(length: number = 64): string {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const initialLogs: LogEntry[] = [
    { timestamp: new Date(Date.now() - 5000).toISOString(), level: 'INFO', message: 'System initialization complete.' },
    { timestamp: new Date(Date.now() - 4000).toISOString(), level: 'INFO', message: 'Federation Handshake with Node Alpha successful.' },
    { timestamp: new Date(Date.now() - 3000).toISOString(), level: 'TRACE', message: 'Quantum Mesh link established. Latency: 0.2ns.', hash: 'a1b2c3d4' },
    { timestamp: new Date(Date.now() - 2000).toISOString(), level: 'WARN', message: 'High network traffic detected on blockchain: Pi Network.' },
    { timestamp: new Date(Date.now() - 1000).toISOString(), level: 'INFO', message: 'Dashboard UI rendered successfully.' },
];

const rootUser: User = {
    id: 'root-user-001',
    email: 'bis3946@nun.net',
    blockchainHash: 'f4b2e1a8c3d5f0g7h9i2k4l6m8n0o1p3q5r7s9t1u3v5w7x9y1z3a5b7c9d1e3f5',
    role: UserRole.SuperAdmin,
    status: 'Active',
    apiKey: `nun_pk_${generateRandomHash(32)}`,
    apiSecret: `nun_sk_${generateRandomHash(32)}`,
    piWalletAddress: 'GCZLZWMKYUZIK562JSQSA2QT3N75LZHOKA3QQCOD2P5II47OIVP6Y7T6',
    sessionKey: '05e8b3b3a7268b6951ec402123456789abcdef0123456789abcdef01234567',
    gmail: 'bojanmilanovickorcula@gmail.com',
    gmailVerified: true,
    personalInfo: {
        name: 'Bojan Milanovic',
        dob: '1985-05-20',
        pob: 'Korcula, Croatia',
        aliases: ['bis3946', 'NuN Root Authority'],
    },
};

const initialVersionHistory: VersionHistoryEntry[] = [{
    timestamp: Date.now(),
    versions: {
        'ana-agi': '2.5.1',
        'ana-asi': '1.8.2',
        'anna': '3.1.0',
        'anne': '3.1.5',
    }
}];

const initialSimulationProposals: SimulationProposal[] = [
    { id: 'sp-1', proposer: 'Ana AGI', description: 'Simulate a cascading node failure in the Asia-Pacific-1 cluster to test failover protocols.', status: 'Pending' },
    { id: 'sp-2', proposer: 'AnnE', description: 'Run a parallel stress test on the Post-Quantum handshake under simulated solar flare interference.', status: 'Pending' },
];

const initialTaskSuggestions: AITaskSuggestion[] = [
     {
        id: 'sugg-1',
        title: 'Deploy Predictive Load Balancer v2.1',
        proposer: 'Ana AGI',
        reasoning: 'Current network latency spikes suggest the existing load balancer is reaching its operational limits during peak federation handshakes.',
        priority: TaskPriority.High,
        recommendedOrchestrators: ['Ana AGI', 'AnnE'],
    },
    {
        id: 'sugg-2',
        title: 'Perform security audit on Pi Network bridge',
        proposer: 'AnnE',
        reasoning: 'Increased transaction volume from the Pi Network bridge requires a proactive security audit to ensure protocol integrity.',
        priority: TaskPriority.Medium,
        recommendedOrchestrators: ['AnnE'],
    },
];

const initialInvitations: HandshakeInvitation[] = [
    { id: 'inv-1', target: 'Skynet Defense Systems', status: 'Awaiting Response', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'inv-2', target: 'Cyberdyne Corp', status: 'Confirmed', timestamp: new Date(Date.now() - 86400000).toISOString() },
];

export const initialSystemState: SystemState = {
    isAuthenticating: false,
    aiModules: [
        { id: 'ana-agi', name: 'Ana AGI', version: '2.5.1', status: SystemStatus.OK, threshold: 95.0 },
        { id: 'ana-asi', name: 'Ana ASI', version: '1.8.2', status: SystemStatus.OK, threshold: 98.0 },
        { id: 'anna', name: 'AnnA', version: '3.1.0', status: SystemStatus.OK, threshold: 92.5 },
        { id: 'anne', name: 'AnnE', version: '3.1.5', status: SystemStatus.OK, threshold: 99.0 },
        { id: 'ana-qml', name: 'AnaQML', version: '1.0.0', status: SystemStatus.OK, threshold: 99.5 },
    ],
    blockchains: [
        { name: 'NuN Ledger', entityType: 'Entity', status: SystemStatus.OK, blockHeight: 13370, transactions: 42051 },
        { name: 'NuN VirtualChain', entityType: 'AI', status: SystemStatus.OK, blockHeight: 8901, transactions: 120345 },
        { name: 'Pi Network', entityType: 'Human', status: SystemStatus.OK, blockHeight: 25001, transactions: 10234 },
    ],
    healthChecks: [
        { name: 'Federation Bridge', port: 49722, status: SystemStatus.OK },
        { name: 'VaultMirror', port: 3947, status: SystemStatus.OK },
        { name: 'AI Orchestrator', port: 3948, status: SystemStatus.OK },
        { name: 'Quantum Mesh', port: 50000, status: SystemStatus.OK },
    ],
    orchestratorMetrics: {
        thrust: 0.98,
        propulsion: 1.21,
        shield: 99.8,
        anomaliesCount: 1,
        complianceScore: 99.98,
        testPassRate: 100.0,
    },
    federationNodes: [
        { name: 'NuN Core (Self)', location: [42.96, 17.13], latency: 1, status: SystemStatus.OK, type: 'Core' },
        { name: 'Samsung S25 Ultra (Device 0)', location: [42.96, 17.13], latency: 25, status: SystemStatus.OK, type: 'SuperNode' },
        { name: 'EU-Central-1', location: [50.11, 8.68], latency: 45, status: SystemStatus.OK, type: 'SuperNode' },
        { name: 'US-East-1', location: [39.04, -77.48], latency: 95, status: SystemStatus.OK, type: 'SuperNode' },
        { name: 'Asia-Pacific-1', location: [35.68, 139.69], latency: 152, status: SystemStatus.OK, type: 'SuperNode' },
    ],
    logs: initialLogs,
    tokenomics: {
        totalSupply: 1000000000,
        ownerAllocation: { owner: 'bis3946', amount: 510000000, status: 'Pending' },
        distributionBuckets: [
            { id: 'd1', bucket: 'Team & Advisors', amount: 150000000 },
            { id: 'd2', bucket: 'Ecosystem Fund', amount: 200000000 },
            { id: 'd3', bucket: 'Public Sale', amount: 90000000 },
            { id: 'd4', bucket: 'Staking Rewards', amount: 50000000 },
        ],
        multisigTimelock: { status: 'Idle', signatures: [], requiredSignatures: 3 },
    },
    networkOrchestration: {
        mode: 'live',
        federationPartners: [
            { id: 'meta-ai', name: 'Meta AI', status: 'Handshake OK' },
            { id: 'grok', name: 'Grok', status: 'Handshake OK' },
            { id: 'gemini', name: 'Google Gemini', status: 'Handshake OK' },
            { id: 'openai-chatgpt', name: 'OpenAI ChatGPT', status: 'Handshake OK' },
        ],
    },
    federatedDecisions: [
        { id: 'fd-1', source: 'Ana AGI', proposal: 'Reroute traffic through EU-Central-1 due to high latency in AP-1.', confidence: 98, status: 'Pending' },
        { id: 'fd-2', source: 'AnnE', proposal: 'Isolate suspicious node activity from IP 123.45.67.89.', confidence: 99, status: 'Approved' },
    ],
    predictedEvents: [
        { id: 'pe-1', description: 'Potential solar flare activity may disrupt Space Vault uplink in ~48 hours.', probability: 75, recommendedAction: 'Cache critical data locally.' },
    ],
    neuroMetrics: { resonance: 88.5, neuroplasticity: 92.1, feedbackStatus: 'NOMINAL' },
    sessionManager: { connections: [] },
    nodes: { active: 1256, super: 4 },
    users: [rootUser],
    piNetwork: { status: 'Disconnected', syncedBlocks: 0, totalPiBlocks: 25001, lastSync: null, kycVerified: false, walletAddress: 'GCZLZWMKYUZIK562JSQSA2QT3N75LZHOKA3QQCOD2P5II47OIVP6Y7T6' },
    wallet: {
        chains: {
            nun: {
                name: 'NuN Ledger',
                address: 'nun_wallet_1a7b3c9d5e' + generateRandomHash(40),
                balance: 50000,
                symbol: 'NUN',
            },
            pi: {
                name: 'Pi Network',
                address: 'GCZLZWMKYUZIK562JSQSA2QT3N75LZHOKA3QQCOD2P5II47OIVP6Y7T6',
                balance: 1234.56,
                symbol: 'PI',
            },
            eth: {
                name: 'Ethereum',
                address: '0x' + generateRandomHash(40),
                balance: 10.5,
                symbol: 'ETH',
            },
            btc: {
                name: 'Bitcoin',
                address: 'bc1' + generateRandomHash(38).toLowerCase(),
                balance: 0.5,
                symbol: 'BTC',
            },
        },
        isSending: false,
        passphrase: 'quantum-mesh-authority-ultra-secure-bìs3946-2024-root-alpha-omega'
    },
    blocks: Array.from({ length: 10 }, (_, i) => ({
        height: 13370 - i,
        hash: generateRandomHash(),
        timestamp: new Date(Date.now() - i * 30000).toISOString(),
        transactions: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({ hash: generateRandomHash() })),
    })),
    systemSync: {
        status: 'Synchronized',
        selfHealingActive: true,
        targetDevice: { model: 'Samsung S25 Ultra', storage: '512GB UFS 4.0' },
    },
    tasks: [
        { id: 't3', title: 'Review Q2 security audit logs', priority: TaskPriority.Low, status: 'Completed', assignedOrchestrators: ['AnnE'], dependencies: [] },
        { id: 't1', title: 'Optimize quantum mesh routing algorithm', priority: TaskPriority.High, status: 'In Progress', assignedOrchestrators: ['Ana AGI', 'AnaQML'], dependencies: ['t3'] },
        { id: 't2', title: 'Integrate new federation partner: Grok', priority: TaskPriority.Medium, status: 'Pending', assignedOrchestrators: [], dependencies: ['t1'] },
    ],
    simulations: [],
    notifications: [],
    voiceTemplate: null,
    voiceAuthStatus: 'prompting',
    resourceContribution: { enabled: true, cpuUsage: 15.5, storageAllocatedGB: 128, bandwidthMbps: 50 },
    multiDomainStorage: {
        media: { usedGB: 256, totalGB: 1024 },
        air: { status: 'Connected', nodes: 32 },
        space: { status: 'Uplink Active', latency: 250 },
    },
    governance: {
        proposals: [{
            id: 'gov-1',
            title: 'Increase staking rewards by 5%',
            proposer: '0xabc...',
            status: 'Active',
            votes: { approve: 1024, reject: 128 },
        }],
    },
    tokenomicsIncentives: { contributionScore: 12500, pendingRewards: 150.75, networkRank: 1 },
    dataTransfer: { totalTransferredGB: 1234.56, activeSessions: 42, transferRateMbps: 580.5 },
    nodeManagement: {
        pendingNodes: [
            { id: 'node-xyz-789', location: 'South America (Brazil)' },
        ],
    },
    referralSystem: { sessionId: `nun-ref-${generateRandomHash(12)}`, referralCount: 0, totalRewards: 0 },
    tokenMarket: { priceUSD: 1.234, change24h: 2.5, lastUpdated: new Date().toISOString() },
    anaQMLMetrics: { qubitCoherence: 99.8, neuralAccuracy: 98.5, modelConfidence: 99.2 },
    versionHistory: initialVersionHistory,
    sessionNetwork: { status: 'Idle', lastSync: null, key: '05e8b3b3a7268b6951ec402123456789abcdef0123456789abcdef01234567' },
    aiAgents: {
        anaAGI: { initialized: true },
        anaASI: { initialized: true },
        annA: { initialized: true },
        annE: { initialized: true },
        anaQML: {
            initialized: true,
            tasks: [
                { taskName: "init_quantum_sync", parameters: { description: "Initialize quantum mesh synchronization" }, status: "pending", createdAt: new Date(Date.now() - 2000).toISOString(), result: null },
                { taskName: "pi_wallet_monitor", parameters: { description: "Monitor Pi Network wallet input and sync with NuN Vault" }, status: "pending", createdAt: new Date(Date.now() - 1000).toISOString(), result: null },
                { taskName: "session_key_tracker", parameters: { description: "Track session key and initiate secure session network communication" }, status: "pending", createdAt: new Date().toISOString(), result: null }
            ]
        }
    },
    connectedDevices: [],
    ownerAllocation: {
        status: 'Idle',
        networksConnected: false,
        chainsSynced: false,
        sessionId: '058a988488025e2046294feaac1ea0d7103a050ea9a9e481b77be3f6e07b11ba39',
        targetWallet: 'GCZLZWMKYUZIK562JSQSA2QT3N75LZHOKA3QQCOD2P5II47OIVP6Y7T6',
        blockchainConnections: {
            'NuN Blockchain': 'pending',
            'NuN VirtualChain': 'pending',
            'NuN AI Chain': 'pending',
        }
    },
    consciousEntities: [
        { id: 'ce-001', name: 'Entity CE-001', status: 'Active' },
        { id: 'ce-002', name: 'Entity CE-002', status: 'Idle' },
    ],
    federationNetworks: [
        { id: 'pi', name: 'Pi Network', status: 'Disconnected' },
        { id: 'session', name: 'Session Oxen', status: 'Connected' },
        { id: 'nun', name: 'NuN Protocol', status: 'Connected' },
    ],
    upgradeProposals: [
        { id: 'up-001', proposer: 'CE-001', targetModel: 'ana-agi', description: 'Optimize real-time task execution & network sync', status: 'Pending' },
    ],
    pqHandshakeStatus: 'Pending',
    nunVault: {
        totalSizeTB: 4096, // 4 PB
        status: 'Equilibrium',
        distribution: {
            transfer: 33.3,
            atmospheric: 33.3,
            orbital: 33.4,
        },
        lastSnapshotTimestamp: null,
        hashVerificationStatus: 'Idle',
    },
    anomalyNotificationsEnabled: true,
    simulationProposals: initialSimulationProposals,
    taskSuggestions: initialTaskSuggestions,
    federationControl: {
        invitationTarget: '',
        invitations: initialInvitations,
    },
};