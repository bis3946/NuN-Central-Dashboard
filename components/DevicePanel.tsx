import React from 'react';
import { useSystem } from '../context/SystemContext';
import { DashboardCard } from './DashboardCard';
import { DevicePhoneMobileIcon } from './icons/DevicePhoneMobileIcon';
import { Device } from '../types';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { BoltIcon } from './icons/BoltIcon';

const DeviceItem: React.FC<{ device: Device }> = ({ device }) => {
    const { dispatch } = useSystem();
    const isOwner = device.isOwner;
    const usagePercent = device.resourcesAllocated > 0 ? (device.resourcesUsed / device.resourcesAllocated) * 100 : 0;

    const handleSync = () => {
        dispatch({ type: 'SYNC_DEVICE', payload: { deviceId: device.deviceId } });
    };

    const handleAllocate = () => {
        dispatch({ type: 'ALLOCATE_RESOURCES', payload: { deviceId: device.deviceId, amount: 50 } });
    };
    
    const getStatusColor = () => {
        switch(device.status) {
            case 'connected': return 'text-nun-success';
            case 'disconnected': return 'text-nun-error';
            case 'syncing': return 'text-nun-primary';
        }
    }

    return (
        <div className="p-3 bg-nun-dark/60 rounded-lg text-sm space-y-2">
            <div className="flex justify-between items-center">
                <p className="font-bold text-gray-200">{device.model} {isOwner ? <span className="text-xs text-nun-secondary">(Super Node 0)</span> : ''}</p>
                <span className={`font-bold text-xs uppercase ${getStatusColor()}`}>{device.status}</span>
            </div>
            <div className="text-xs text-gray-500 font-mono" title={device.nodeId}>Node ID: {device.nodeId.substring(0, 20)}...</div>
            
            <div>
                <p className="text-gray-400 text-xs flex justify-between">Resource Usage <span>{device.resourcesUsed.toFixed(1)} / {device.resourcesAllocated} units</span></p>
                <div className="w-full bg-nun-darker rounded-full h-2">
                    <div className="bg-nun-primary h-2 rounded-full" style={{width: `${usagePercent}%`}} title={`${usagePercent.toFixed(1)}% used`}></div>
                </div>
            </div>

            <div className="flex justify-between items-center text-xs">
                <p>Rewards: <span className="font-mono text-nun-success">{device.rewardsEarned.toFixed(2)} NUN</span></p>
                {device.status === 'syncing' ? (
                    <div className="flex items-center gap-1 text-nun-primary animate-pulse">
                        <ArrowPathIcon className="w-3 h-3 animate-spin" />
                        <span>Syncing...</span>
                    </div>
                ) : (
                    <p>
                        <span className="text-gray-500">Last Sync: </span>
                        <span className="text-gray-400">{new Date(device.lastSync).toLocaleTimeString()}</span>
                    </p>
                )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-nun-light/20">
                <button onClick={handleSync} className="flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition">
                    <ArrowPathIcon className="w-4 h-4" /> Sync
                </button>
                 <button onClick={handleAllocate} className="flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-bold bg-nun-warning/80 text-nun-darker rounded hover:bg-nun-warning transition">
                    <BoltIcon className="w-3 h-3" /> Allocate +50
                </button>
            </div>
        </div>
    );
};

export const DevicePanel: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { connectedDevices } = systemState;

    const registerMyDevice = () => {
        const myDevice = {
            deviceId: "samsung_s25_ultra_512gb",
            model: "Samsung S25 Ultra 5G",
            storageGB: 512,
            isOwner: true
        };
        dispatch({ type: 'REGISTER_DEVICE', payload: myDevice });
    };

    return (
        <DashboardCard title="Device Sync & Resources" icon={<DevicePhoneMobileIcon />}>
            <div className="space-y-4">
                <button 
                    onClick={registerMyDevice}
                    className="w-full px-4 py-2 text-sm font-bold bg-nun-secondary/80 text-nun-darker rounded-md hover:bg-nun-secondary transition"
                >
                    Sync & Connect Super Node
                </button>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                    {connectedDevices.map(device => <DeviceItem key={device.deviceId} device={device} />)}
                </div>
            </div>
        </DashboardCard>
    );
};
