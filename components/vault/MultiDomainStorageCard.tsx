import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { useSystem } from '../../context/SystemContext';
import { GlobeEuropeAfricaIcon } from '../icons/GlobeEuropeAfricaIcon';
import { StatusIndicator } from '../StatusIndicator';
import { SystemStatus } from '../../types';

export const MultiDomainStorageCard: React.FC = () => {
    const { systemState } = useSystem();
    const { multiDomainStorage } = systemState;
    const { media, air, space } = multiDomainStorage;

    const mediaUsagePercent = (media.usedGB / media.totalGB) * 100;

    return (
        <DashboardCard title="Multi-Domain Storage" icon={<GlobeEuropeAfricaIcon />} className="2xl:col-span-1">
            <div className="space-y-4">
                {/* Media Domain */}
                <div>
                    <h4 className="font-bold text-nun-primary text-sm mb-2">Media Vault</h4>
                    <p className="text-gray-400 text-xs flex justify-between">Total Network Storage <span>{media.usedGB.toFixed(1)} / {media.totalGB.toLocaleString()} GB</span></p>
                    <div className="w-full bg-nun-darker rounded-full h-3">
                        <div className="bg-nun-primary h-3 rounded-full" style={{width: `${mediaUsagePercent}%`}}></div>
                    </div>
                </div>
                
                <div className="border-t border-nun-light/20"></div>

                {/* Air & Space Domains */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-bold text-nun-secondary text-sm mb-2">Air Vault</h4>
                        <div className="space-y-1 text-xs">
                             <div className="flex items-center justify-between">
                                <span className="text-gray-400">Status:</span>
                                <span className={`font-bold ${air.status === 'Connected' ? 'text-nun-success' : 'text-nun-error'}`}>{air.status}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">IoT Nodes:</span>
                                <span className="font-mono">{air.nodes}</span>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-bold text-fuchsia-400 text-sm mb-2">Space Vault</h4>
                         <div className="space-y-1 text-xs">
                             <div className="flex items-center justify-between">
                                <span className="text-gray-400">Status:</span>
                                <span className={`font-bold ${space.status === 'Uplink Active' ? 'text-nun-success' : 'text-gray-400'}`}>{space.status}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Latency:</span>
                                <span className="font-mono">{space.latency}ms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};