import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { CodeBracketSquareIcon } from '../icons/CodeBracketSquareIcon';
import { BoltIcon } from '../icons/BoltIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { WrenchScrewdriverIcon } from '../icons/WrenchScrewdriverIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { BellIcon } from '../icons/BellIcon';

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-t border-nun-light/20 pt-3 mt-3">
        <h4 className="font-bold text-nun-primary/80 mb-2">{title}</h4>
        <div className="space-y-2 text-sm text-gray-300">{children}</div>
    </div>
);

const CommandBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-nun-darker p-2 rounded-md text-xs font-mono text-nun-primary/90 overflow-x-auto scrollbar-thin">
        <code>{children}</code>
    </pre>
);

const Symbol: React.FC<{ symbol: string, label: string }> = ({ symbol, label }) => {
    const icons: { [key: string]: React.ReactNode } = {
        '⚡': <BoltIcon className="w-4 h-4 text-nun-primary" />,
        '🔒': <ShieldCheckIcon />,
        '🛠': <WrenchScrewdriverIcon />,
        '📊': <ChartBarIcon />,
        '🚨': <BellIcon />,
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-lg">{icons[symbol] || symbol}</span>
            <span>{label}</span>
        </div>
    );
};

export const NuNQuantumInternetPanel: React.FC = () => {
    const commandScript = `
while true:
    vaultmirror_heartbeat()
    vaultmirror_sync()
    anaagi_ai_feedback()
    self_healing_check()
    federation_handshake_check()
    dashboard_update()
    sleep(adaptive_interval)
    `.trim();

    return (
        <DashboardCard title="NuN Quantum Global Mesh - Master Flow" icon={<CodeBracketSquareIcon />}>
            <div className="max-h-[90vh] overflow-y-auto pr-2 scrollbar-thin">
                <Section title="1. Initialization & APK Launch">
                    <CommandBlock>
                        launch_nun_dashboard --nodeid auto --role Node --federation ON --simulation OFF
                        {"\n"}anaqml_init_ui
                        {"\n"}anaagi_prepare_routing
                        {"\n"}vaultmirror_create_placeholder
                    </CommandBlock>
                    <p className="text-xs text-gray-400">⚡ AI triggers: AnaQML UI init, Ana AGI routing prep. VaultMirror logs placeholder. Dashboard shows launch info.</p>
                </Section>

                <Section title="2. Node Registration">
                     <CommandBlock>
                        meshmanager_register_node --health_ports 3947,3948,3949,3950 --bridge_ports 49722,49723,49724
                        {"\n"}anaagi_verify_node_capacity
                    </CommandBlock>
                    <p className="text-xs text-gray-400">🛠 VaultMirror logs registration with HMAC. Dashboard confirms completion.</p>
                </Section>
                
                <Section title="3. Heartbeat Loop">
                    <CommandBlock>
                        vaultmirror_start_heartbeat --interval adaptive --min 30 --max 90
                        {"\n"}anaagi_monitor_latency
                    </CommandBlock>
                    <p className="text-xs text-gray-400">📊 Adaptive 30–90s interval. Ana AGI monitors latency & health. VaultMirror logs events.</p>
                </Section>

                <Section title="4. Federated Handshake & PQ Keys">
                    <CommandBlock>
                        federation_handshake --nodes Meta,Grok,Gemini,Session,PiNetwork --pq_keys Kyber,Dilithium
                        {"\n"}anaasi_validate_pq_keys
                        {"\n"}anaagi_optimize_routing
                        {"\n"}anne_security_monitor
                    </CommandBlock>
                    <p className="text-xs text-gray-400">🔒 VaultMirror logs handshake & consensus. AnnE monitors security. Dashboard alerts on failure 🚨.</p>
                </Section>

                <Section title="5. AI Feedback & Optimization">
                     <CommandBlock>
                        anaagi_route_optimization
                        {"\n"}anaagi_fdt_optimize
                        {"\n"}anaqml_toggle_simulation --ports 50000-50010
                        {"\n"}anna_interpret_feedback
                        {"\n"}anne_security_check
                    </CommandBlock>
                    <p className="text-xs text-gray-400">📊 Real-time routing, FDT, and load balancing adjustments. Simulation toggle available.</p>
                </Section>
                
                <Section title="6. Self-Healing & Recovery">
                    <CommandBlock>
                        self_healing_trigger --check_heartbeat
                        {"\n"}self_healing_restart_node
                        {"\n"}self_healing_reroute_load
                        {"\n"}anaagi_confirm_actions
                        {"\n"}anne_confirm_fail_safe
                    </CommandBlock>
                    <p className="text-xs text-gray-400">🛠 Auto-restart, reroute, and load redistribution. VaultMirror logs all recovery events.</p>
                </Section>
                
                <Section title="7. Continuous VaultMirror Sync">
                     <CommandBlock>vaultmirror_sync_node --nodeid &lt;nodeid&gt;{"\n"}anaasi_verify_sync</CommandBlock>
                    <p className="text-xs text-gray-400">⚡ Central post-quantum logging ensures data integrity across the network.</p>
                </Section>
                
                <Section title="8. Simulation / AI Evolution Mode">
                    <CommandBlock>
                        anaqml_activate_simulation --ports 50000-50010
                        {"\n"}anaagi_run_simulation
                        {"\n"}vaultmirror_log_simulation_event
                    </CommandBlock>
                    <p className="text-xs text-gray-400">📊 Runs parallel to the live network. AI evaluates scenarios without production impact.</p>
                </Section>
                
                <Section title="9. Alerts & Monitoring">
                     <CommandBlock>check_alerts --types heartbeat,handshake,pq_key_rotation,ai_recommendations{"\n"}anne_prioritize_alerts{"\n"}dashboard_update</CommandBlock>
                    <p className="text-xs text-gray-400">🚨 AnnE prioritizes alerts: Info, Warning, Alert, Critical.</p>
                </Section>
                
                <Section title="10. Continuous Loop Execution">
                    <CommandBlock>{commandScript}</CommandBlock>
                </Section>

                <Section title="11. Reference">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <h5 className="font-bold text-gray-400 mb-1">Ports</h5>
                            <ul className="list-disc list-inside">
                                <li>Health: 3947–3950</li>
                                <li>Bridge: 49722–49724</li>
                                <li>Telemetry: 50000–50010</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-400 mb-1">Key Symbols</h5>
                            <div className="space-y-1">
                                <Symbol symbol="⚡" label="AI Trigger / Immediate Action" />
                                <Symbol symbol="🔒" label="PQ / Security Event" />
                                <Symbol symbol="🛠" label="Self-Healing / Recovery" />
                                <Symbol symbol="📊" label="Dashboard Update / Metrics" />
                                <Symbol symbol="🚨" label="Alert / Critical Event" />
                            </div>
                        </div>
                         <div className="sm:col-span-2">
                             <h5 className="font-bold text-gray-400 mb-1">AI Modules</h5>
                             <ul className="list-disc list-inside">
                                 <li><span className="font-semibold">Ana AGI:</span> Routing, FDT, Load Balancing, Simulation Evaluation</li>
                                 <li><span className="font-semibold">Ana ASI:</span> VaultMirror Sync, PQ Key Validation & Rotation</li>
                                 <li><span className="font-semibold">AnaQML:</span> UI, Simulation Toggle, Telemetry Handling</li>
                                 <li><span className="font-semibold">AnnA:</span> Feedback Interpretation</li>
                                 <li><span className="font-semibold">AnnE:</span> Security, Fail-Safe, Kill-Switch, Alert Prioritization</li>
                             </ul>
                        </div>
                    </div>
                </Section>
            </div>
        </DashboardCard>
    );
};
