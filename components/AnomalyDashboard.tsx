
import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { DashboardCard } from './DashboardCard';
import { SystemStatus, AIModule } from '../types';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ArrowTrendingUpIcon } from './icons/ArrowTrendingUpIcon';
import { PencilIcon } from './icons/PencilIcon';
import { ThresholdEditModal } from './ThresholdEditModal';

const AnomalyTrendChart: React.FC = () => {
    const { systemState } = useSystem();
    const { logs, aiModules } = systemState;
    const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff0000'];

    const chartData = React.useMemo(() => {
        const anomalyLogs = logs.filter(log => log.level === 'WARN' || log.level === 'ERROR');

        if (anomalyLogs.length < 1) return null;

        const latestLogTime = new Date(anomalyLogs[0].timestamp).getTime();
        const BUCKET_SECONDS = 10;
        const NUM_BUCKETS = 6;
        const timeWindowMillis = BUCKET_SECONDS * NUM_BUCKETS * 1000;

        const buckets = Array.from({ length: NUM_BUCKETS }, (_, i) => {
            const endTime = new Date(latestLogTime - i * BUCKET_SECONDS * 1000);
            return {
                endTime,
                label: endTime.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                counts: Object.fromEntries(aiModules.map(m => [m.name, 0])),
                total: 0,
            };
        }).reverse();

        for (const log of anomalyLogs) {
            const logTime = new Date(log.timestamp).getTime();
            const moduleName = aiModules.find(m => log.message.includes(m.name))?.name;

            if (logTime > latestLogTime - timeWindowMillis && moduleName) {
                const timeDiffMillis = latestLogTime - logTime;
                const bucketIndex = Math.floor(timeDiffMillis / (BUCKET_SECONDS * 1000));
                
                if (bucketIndex >= 0 && bucketIndex < NUM_BUCKETS) {
                    const targetBucket = buckets[NUM_BUCKETS - 1 - bucketIndex];
                    if (targetBucket) {
                        targetBucket.counts[moduleName]++;
                        targetBucket.total++;
                    }
                }
            }
        }
        
        const maxCount = Math.max(...buckets.map(b => b.total), 1);

        return { buckets, maxCount };

    }, [logs, aiModules]);

    if (!chartData) {
        return <div className="text-center text-gray-500 p-8">No anomaly data available for trend analysis.</div>;
    }
    
    const { buckets, maxCount } = chartData;
    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const barWidth = chartWidth / buckets.length * 0.8;

    return (
        <div className="w-full overflow-x-auto scrollbar-thin">
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    {/* Y-axis with labels and gridlines */}
                    <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#4a5568" />
                    {[...Array(Math.min(maxCount, 5) + 1)].map((_, i) => {
                         const numLabels = Math.min(maxCount, 5);
                         if (numLabels === 0) return null;
                         const y = chartHeight - (i / numLabels) * chartHeight;
                         const label = (i / numLabels) * maxCount;
                         return (
                            <g key={i}>
                                <text x="-10" y={y + 4} fill="#a0aec0" textAnchor="end" fontSize="10">{Math.round(label)}</text>
                                <line x1="-5" y1={y} x2={chartWidth} y2={y} stroke="#2d3748" strokeDasharray="2,2" />
                            </g>
                         )
                    })}

                    {/* X-axis */}
                    <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#4a5568" />

                    {/* Bars */}
                    {buckets.map((bucket, i) => {
                        const x = (i / buckets.length) * chartWidth + ((chartWidth / buckets.length) * 0.1);
                        let yOffset = chartHeight;

                        return (
                             <g key={bucket.label}>
                                {Object.entries(bucket.counts).map(([moduleName, count]) => {
                                    if (count === 0) return null;
                                    const barHeight = (count / maxCount) * chartHeight;
                                    yOffset -= barHeight;
                                    const module = aiModules.find(m => m.name === moduleName);
                                    const moduleIndexInAiModules = module ? aiModules.indexOf(module) : -1;

                                    return (
                                        <rect
                                            key={moduleName}
                                            x={x}
                                            y={yOffset}
                                            width={barWidth}
                                            height={barHeight}
                                            fill={colors[moduleIndexInAiModules % colors.length]}
                                        >
                                          <title>{`${moduleName}: ${count} anomalies at ${bucket.label}`}</title>
                                        </rect>
                                    );
                                })}
                                <text x={x + barWidth / 2} y={chartHeight + 20} fill="#a0aec0" textAnchor="middle" fontSize="10">{bucket.label}</text>
                             </g>
                        )
                    })}
                </g>
            </svg>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 text-xs">
                {aiModules.map((module, i) => (
                    <div key={module.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }}></div>
                        <span>{module.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const versionToNumber = (v: string): number => {
    const parts = v.split('.').map(Number);
    return (parts[0] * 10000) + (parts[1] * 100) + parts[2];
};

const VersionChart: React.FC = () => {
    const { systemState } = useSystem();
    const { versionHistory, aiModules } = systemState;
    const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff0000'];

    if (versionHistory.length < 2) {
        return <div className="text-center text-gray-500 p-8">Insufficient data for version history chart.</div>;
    }

    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 60, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const allVersions = versionHistory.flatMap(entry => Object.values(entry.versions).map(versionToNumber));
    const minVersion = Math.min(...allVersions);
    const maxVersion = Math.max(...allVersions);

    const minTimestamp = versionHistory[0].timestamp;
    const maxTimestamp = versionHistory[versionHistory.length - 1].timestamp;

    const xScale = (timestamp: number) => {
        if (maxTimestamp === minTimestamp) return 0;
        return ((timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * chartWidth;
    };
    
    const yScale = (version: number) => {
        if (maxVersion === minVersion) return chartHeight;
        return chartHeight - ((version - minVersion) / (maxVersion - minVersion)) * chartHeight;
    };
    
    const paths = aiModules.map((module, i) => {
        const pathData = versionHistory
            .map(entry => {
                const versionStr = entry.versions[module.id];
                if (!versionStr) return null;
                const x = xScale(entry.timestamp);
                const y = yScale(versionToNumber(versionStr));
                return `${x},${y}`;
            })
            .filter(Boolean)
            .join(' L ');
        
        return pathData ? <path key={module.id} d={`M ${pathData}`} stroke={colors[i % colors.length]} strokeWidth="2" fill="none" /> : null;
    });

    return (
        <div className="w-full overflow-x-auto scrollbar-thin">
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    {/* Y-axis */}
                    <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#4a5568" />
                    {/* X-axis */}
                    <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#4a5568" />

                    {paths}
                </g>
            </svg>
            <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs">
                {aiModules.map((module, i) => (
                    <div key={module.id} className="flex items-center gap-2">
                        <div className="w-4 h-0.5" style={{ backgroundColor: colors[i % colors.length] }}></div>
                        <span>{module.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const AnomalyDashboard: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { aiModules, logs, anomalyNotificationsEnabled } = systemState;
    const [editingModule, setEditingModule] = useState<AIModule | null>(null);

    const getStatusColor = (status: SystemStatus) => {
        switch (status) {
            case SystemStatus.OK: return "text-green-600";
            case SystemStatus.Warning: return "text-yellow-600";
            case SystemStatus.Error: return "text-red-600";
            default: return "text-nun-primary";
        }
    };

    const handleToggleNotifications = () => {
        // FIX: Added 'TOGGLE_ANOMALY_NOTIFICATIONS' action type to the reducer to allow this dispatch.
        dispatch({ type: 'TOGGLE_ANOMALY_NOTIFICATIONS' });
    };

    return (
        <div className="space-y-6">
            <div className="p-4 bg-nun-dark/50 rounded-lg border border-nun-light/20 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-200">AI Self-Healing & Anomaly Dashboard</h2>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${anomalyNotificationsEnabled ? 'text-nun-success' : 'text-gray-500'}`}>
                        {anomalyNotificationsEnabled ? 'Anomaly Alerts: ON' : 'Anomaly Alerts: OFF'}
                    </span>
                     <div className="relative inline-block w-10 align-middle select-none">
                        <input type="checkbox" name="anomalyToggle" id="anomalyToggle" checked={anomalyNotificationsEnabled} onChange={handleToggleNotifications} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" title={anomalyNotificationsEnabled ? 'Disable Anomaly Notifications' : 'Enable Anomaly Notifications'}/>
                        <label htmlFor="anomalyToggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                     <style>{`
                        #anomalyToggle:checked { right: 0; border-color: #00ff00; }
                        #anomalyToggle:checked + .toggle-label { background-color: #00ff00; }
                    `}</style>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {aiModules.map((module) => {
                    const anomalyLogs = logs
                        .filter(log => (log.level === 'WARN' || log.level === 'ERROR') && log.message.includes(module.name))
                        .slice(0, 5);

                    return (
                        <DashboardCard key={module.id} title={module.name} className="shadow-lg rounded-2xl">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-400">Status:</p>
                                    <p className={`font-bold ${getStatusColor(module.status)}`}>
                                        {module.status.toUpperCase()}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-400">Version:</p>
                                    <p className="font-mono text-nun-primary">{module.version}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-400">Threshold:</p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono text-nun-warning">{module.threshold.toFixed(1)}%</p>
                                        <button onClick={() => setEditingModule(module)} className="text-gray-500 hover:text-nun-primary transition" title={`Edit threshold for ${module.name}`}>
                                            <PencilIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 border-t border-nun-light/20 pt-2">
                                    <p className="font-semibold text-xs text-gray-400 uppercase mb-1">Last Anomalies:</p>
                                    {anomalyLogs.length > 0 ? (
                                         <ul className="list-disc list-inside text-xs space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                                            {anomalyLogs.map((log, index) => (
                                                <li key={index} className="text-gray-400" title={log.message}>
                                                    <span className={log.level === 'WARN' ? 'text-nun-warning' : 'text-nun-error'}>[{log.level}]</span> {log.message.substring(0, 30)}...
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-gray-500 italic text-center">No anomalies logged.</p>
                                    )}
                                </div>
                            </div>
                        </DashboardCard>
                    );
                })}
            </div>
            
            <DashboardCard title="Anomaly Frequency Trends (Last Minute)" icon={<ChartBarIcon />} className="col-span-full shadow-lg rounded-2xl">
                <AnomalyTrendChart />
            </DashboardCard>

            <DashboardCard title="Version Evolution" icon={<ArrowTrendingUpIcon />} className="col-span-full shadow-lg rounded-2xl">
                <VersionChart />
            </DashboardCard>

            {editingModule && (
                <ThresholdEditModal 
                    module={editingModule}
                    onClose={() => setEditingModule(null)}
                />
            )}
        </div>
    );
};
