
import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { useSystem } from '../../context/SystemContext';
import { CloudArrowUpIcon } from '../icons/CloudArrowUpIcon';

export const ResourceContributionCard: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { resourceContribution } = systemState;
    const { enabled, cpuUsage, storageAllocatedGB, bandwidthMbps } = resourceContribution;

    const handleToggle = () => {
        dispatch({ type: 'TOGGLE_RESOURCE_CONTRIBUTION' });
    };

    return (
        <DashboardCard title="Device Resource Contribution" icon={<CloudArrowUpIcon />} className="2xl:col-span-1">
            <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-nun-darker/50 rounded-lg">
                    <span className={`font-bold ${enabled ? 'text-nun-success' : 'text-gray-500'}`}>
                        {enabled ? 'CONTRIBUTION ACTIVE' : 'CONTRIBUTION PAUSED'}
                    </span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                            type="checkbox"
                            name="toggle"
                            id="toggle"
                            checked={enabled}
                            onChange={handleToggle}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            title={enabled ? 'Disable resource contribution' : 'Enable resource contribution'}
                        />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>

                <style>{`
                    .toggle-checkbox:checked { right: 0; border-color: #00ff00; }
                    .toggle-checkbox:checked + .toggle-label { background-color: #00ff00; }
                `}</style>
                
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs flex justify-between">CPU Usage <span>{cpuUsage.toFixed(1)}%</span></p>
                        <div className="w-full bg-nun-darker rounded-full h-2.5"><div className="bg-nun-primary h-2.5 rounded-full" style={{width: `${cpuUsage}%`}}></div></div>
                    </div>
                     <div>
                        <p className="text-gray-400 text-xs flex justify-between">Storage Allocated</p>
                        <p className="font-mono text-lg text-nun-success">{storageAllocatedGB} GB</p>
                    </div>
                     <div>
                        <p className="text-gray-400 text-xs flex justify-between">Bandwidth Provided</p>
                         <p className="font-mono text-lg text-nun-success">{bandwidthMbps.toFixed(1)} Mbps</p>
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};