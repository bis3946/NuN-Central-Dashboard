import React, { useState } from 'react';
import { BoltIcon } from './icons/BoltIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { CircleStackIcon } from './icons/CircleStackIcon';
import { BrainIcon } from './icons/BrainIcon';
import { StatusDot } from './icons/StatusDot';
import { MapDetailModal } from './MapDetailModal';

export interface MapItem {
    id: string;
    name: string;
    icon: string;
    functionality: string;
    logic: string;
}

const mapData: { title: string; items: MapItem[] }[] = [
    {
        title: "1. Core Administration & Control",
        items: [
            { id: 'root-authority', name: "Root Authority", icon: 'brain', functionality: "Full system control", logic: "BrainWaveAuth → Unlock all modules & macro sequences" },
            { id: 'dev-mode', name: "Full Dev Mode", icon: 'priority', functionality: "Access backend", logic: "Prompt-driven updates → Test environments & logs" },
            { id: 'macro-commands', name: "Macro Commands", icon: 'priority', functionality: "Multi-module automation", logic: "Trigger via telepathy or UI → Executes AI orchestration + RT token routines" },
        ],
    },
    {
        title: "2. User & Role Management",
        items: [
            { id: 'user-management', name: "User Management", icon: 'active', functionality: "Add/manage users", logic: "CRUD → Role assignment → AI permission mapping" },
            { id: 'guest-mode', name: "Guest Mode", icon: 'alert', functionality: "Limited access", logic: "View-only panels → No blockchain/AI control" },
            { id: 'new-member-signin', name: "New Member Sign-in", icon: 'active', functionality: "Onboard users", logic: "KYC + optional BrainWaveAuth → Assign default role" },
            { id: 'notifications', name: "Notifications", icon: 'alert', functionality: "System alerts", logic: "Triggered by anomalies, Vault updates, federation events" },
        ],
    },
    {
        title: "3. System Monitoring & Alerts",
        items: [
            { id: 'system-anomalies', name: "System/AI Anomalies", icon: 'alert', functionality: "Detect abnormal behaviors", logic: "Monitors AI outputs → Logs & alerts → Optional auto-correction" },
            { id: 'node-alerts', name: "Node/Federation Alerts", icon: 'alert', functionality: "Node health", logic: "Heartbeat & ping checks → If fail → Resync/Alert" },
            { id: 'vault-alerts', name: "VaultMirror Alerts", icon: 'alert', functionality: "Vault replication", logic: "HMAC Master Hash validation → Trigger sync if mismatch" },
        ],
    },
    {
        title: "4. AI & Orchestration",
        items: [
            { id: 'ai-entities', name: "AI Entities", icon: 'active', functionality: "Live AI monitoring", logic: "Lists AI → Fetch status, latency, anomalies" },
            { id: 'ana-orchestration', name: "Ana Orchestration", icon: 'priority', functionality: "Task management", logic: "Parallel execution → Aggregate module outputs → Update panels" },
            { id: 'core-ai-engines', name: "Ana AGI/ASI/QML", icon: 'active', functionality: "Core AI engines", logic: "Predictions, anomaly detection, adaptive learning" },
            { id: 'secondary-analytics', name: "AnnA/AnnE Analytics", icon: 'active', functionality: "Secondary analytics", logic: "Processes outputs → Generates compliance scores, predictive dashboards" },
            { id: 'resync-all-ai', name: "Resync all AI modules", icon: 'sync', functionality: "Module alignment", logic: "Trigger sync → Update telemetry & dashboards" },
        ],
    },
    {
        title: "5. Blockchain & Ledger",
        items: [
            { id: 'nun-chains', name: "NuN Chains", icon: 'active', functionality: "Multi-chain ledger", logic: "Stores actions → Role-specific access" },
            { id: 'cross-chain-sync', name: "Cross-Chain Sync", icon: 'sync', functionality: "Synchronize chains", logic: "Detect changes → Push/pull updates → Data consistency" },
            { id: 'audit-logs', name: "Federated Audit Logs", icon: 'vault', functionality: "Immutable logging", logic: "Logs every action → Stored in NuN Vault" },
            { id: 'historical-replay', name: "Historical Replay", icon: 'sync', functionality: "Reconstruct past events", logic: "Pull logs → Validate HMAC → Display past states" },
        ],
    },
    {
        title: "6. Health & Neuro",
        items: [
            { id: 'health-monitoring', name: "Health Monitoring", icon: 'active', functionality: "Vitals tracking", logic: "Optional: user or AI health metrics → Dashboard updates" },
            { id: 'mesh-bridge-status', name: "Mesh Bridge Status", icon: 'sync', functionality: "Network health", logic: "Detect link failures → Trigger reconnection" },
            { id: 'brain-modules', name: "Brain/Neuro Modules", icon: 'brain', functionality: "Telepathy & authentication", logic: "Read BrainWave signals → Train patterns → Execute commands" },
        ],
    },
    {
        title: "7. Federation & Nodes",
        items: [
            { id: 'node-0', name: "Node 0 Orchestrator", icon: 'active', functionality: "Central control", logic: "Sends commands → Monitors heartbeat → Coordinates AI nodes" },
            { id: 'super-node-expansion', name: "Super Node Expansion", icon: 'active', functionality: "Scale federation", logic: "Auto-register nodes → Update dashboard" },
            { id: 'ping-heartbeat', name: "Ping/Heartbeat", icon: 'sync', functionality: "Node health", logic: "Periodic checks → Trigger alerts/resync" },
        ],
    },
    {
        title: "8. Simulation & Analytics",
        items: [
            { id: 'sim-sandbox', name: "Simulation Sandbox", icon: 'active', functionality: "Safe AI testing", logic: "Isolated environment → Predict outcomes → No production impact" },
            { id: 'predictive-analytics', name: "Predictive Analytics", icon: 'active', functionality: "Forecast events", logic: "Historical + real-time data → Probabilistic predictions" },
            { id: 'decision-support', name: "Decision Support", icon: 'priority', functionality: "Recommendations", logic: "AI predicts outcomes → Suggests optimal commands to Root Authority" },
        ],
    },
    {
        title: "9. Quantum & AR",
        items: [
            { id: 'quantum-mesh', name: "Quantum Mesh Optimization", icon: 'priority', functionality: "Low-latency networking", logic: "Optimize paths → Reduce sync times" },
            { id: 'ar-overlay', name: "AR Overlay", icon: 'active', functionality: "Visual dashboard", logic: "Overlay metrics + simulations → Augmented reality view" },
            { id: 'ai-behavior-prediction', name: "AI Behavior Prediction", icon: 'active', functionality: "Forecast AI outputs", logic: "Feed AI states → Predictive alerts for anomalies & optimization" },
        ],
    },
    {
        title: "10. Automation & Maintenance",
        items: [
            { id: 'trigger-vault-updates', name: "Trigger VaultMirror Updates", icon: 'vault', functionality: "Vault replication", logic: "Compare Master Hash → Initiate replication → Log updates" },
            { id: 'deploy-user-scripts', name: "Deploy User Scripts", icon: 'priority', functionality: "Run automation", logic: "Validate script → Assign permissions → Execute safely" },
        ],
    },
];


const LegendItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
    </div>
);

const getIcon = (icon: string) => {
    switch (icon) {
        case 'active': return <StatusDot color="green" />;
        case 'alert': return <StatusDot color="red" />;
        case 'priority': return <BoltIcon className="w-4 h-4 text-nun-warning" />;
        case 'sync': return <ArrowPathIcon className="w-4 h-4 text-nun-primary" />;
        case 'vault': return <CircleStackIcon className="w-4 h-4 text-nun-secondary" />;
        case 'brain': return <BrainIcon className="w-4 h-4 text-fuchsia-400" />;
        default: return null;
    }
};

export const DashboardMapLayout: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

    return (
        <>
            <div className="bg-nun-darker/50 p-4 rounded-lg border border-nun-light/30 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-nun-primary tracking-wider text-center">Interactive Functional System Map</h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-3 p-2 bg-nun-dark/50 rounded-lg">
                        <LegendItem icon={<StatusDot color="green" />} label="Active / Online" />
                        <LegendItem icon={<StatusDot color="red" />} label="Alert / Anomaly" />
                        <LegendItem icon={<BoltIcon className="w-4 h-4 text-nun-warning" />} label="High-Priority / Macro" />
                        <LegendItem icon={<ArrowPathIcon className="w-4 h-4 text-nun-primary" />} label="Sync / Resync" />
                        <LegendItem icon={<CircleStackIcon className="w-4 h-4 text-nun-secondary" />} label="Vault / Ledger Ops" />
                        <LegendItem icon={<BrainIcon className="w-4 h-4 text-fuchsia-400" />} label="BrainWave / Telepathy" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {mapData.map((section) => (
                        <div key={section.title} className="bg-nun-dark/60 border border-nun-light/20 rounded-lg p-3 text-xs flex flex-col">
                            <h3 className="font-bold text-nun-primary/80 mb-2 text-sm">{section.title}</h3>
                            <div className="space-y-2 flex-grow">
                                {section.items.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="p-2 rounded bg-nun-darker/50 border-l-2 border-nun-light/30 hover:bg-nun-light/30 cursor-pointer transition-colors"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <div className="flex items-center gap-2 font-bold text-gray-200">
                                            {getIcon(item.icon)}
                                            <span>{item.name}</span>
                                            <span className="ml-auto text-xs font-normal text-gray-500 italic">({item.functionality})</span>
                                        </div>
                                        <p className="text-gray-400 text-[11px] mt-1 pl-1 border-l border-gray-700 ml-[5px]">
                                            <span className="font-bold text-gray-500">Logic: </span>{item.logic}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedItem && <MapDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
        </>
    );
};