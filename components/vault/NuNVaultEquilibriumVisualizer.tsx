import React, { useMemo } from 'react';
import { useSystem } from '../../context/SystemContext';

export const NuNVaultEquilibriumVisualizer: React.FC = () => {
    const { systemState } = useSystem();
    const { nunVault, federationNodes, connectedDevices } = systemState;
    const { distribution, status } = nunVault;

    const packetCount = useMemo(() => {
        const basePackets = 50;
        const perNode = 15;
        const perDevice = 25; // Super Nodes or user-owned devices have a greater visual impact
        return Math.min(400, basePackets + federationNodes.length * perNode + connectedDevices.length * perDevice);
    }, [federationNodes.length, connectedDevices.length]);

    const packets = useMemo(() => {
        return Array.from({ length: packetCount }).map((_, i) => {
            const angle = Math.random() * 2 * Math.PI;
            const transferBoundary = 0.3; // 30% radius
            const atmosphericBoundary = 0.65; // 65% radius

            let radius;
            const randomizer = Math.random();

            if (status === 'Equilibrium') {
                const distTotal = distribution.transfer + distribution.atmospheric + distribution.orbital;
                const transferProb = distribution.transfer / distTotal;
                const atmosphericProb = (distribution.transfer + distribution.atmospheric) / distTotal;

                if (randomizer < transferProb) {
                    radius = Math.random() * transferBoundary;
                } else if (randomizer < atmosphericProb) {
                    radius = transferBoundary + Math.random() * (atmosphericBoundary - transferBoundary);
                } else {
                    radius = atmosphericBoundary + Math.random() * (1 - atmosphericBoundary);
                }
            } else { // Usurped state
                radius = Math.random() * transferBoundary;
            }

            return {
                id: i,
                x: 50 + Math.cos(angle) * radius * 50,
                y: 50 + Math.sin(angle) * radius * 50,
                delay: Math.random() * 1.5,
                duration: 1 + Math.random(),
                size: 1 + Math.random() * 1.5,
            };
        });
    }, [status, distribution, packetCount]);

    return (
        <div className="relative w-full aspect-square flex items-center justify-center bg-nun-darker/50 rounded-full border-2 border-nun-light/10 overflow-hidden">
            <style>
                {`
                    @keyframes pulse-orb {
                        0%, 100% { transform: scale(1); opacity: 0.6; }
                        50% { transform: scale(1.02); opacity: 0.8; }
                    }
                    @keyframes pulse-packet {
                        0%, 100% { opacity: 0.5; }
                        50% { opacity: 1; }
                    }
                `}
            </style>
            
            {/* Orbital Medium */}
            <div
                className="absolute w-[95%] h-[95%] rounded-full border border-nun-secondary/50"
                style={{ animation: 'pulse-orb 8s ease-in-out infinite' }}
            ></div>

            {/* Atmospheric Medium */}
            <div
                className="absolute w-[65%] h-[65%] rounded-full border border-nun-warning/50"
                 style={{ animation: 'pulse-orb 6s ease-in-out infinite reverse' }}
            ></div>

            {/* Transfer Medium */}
            <div
                className="absolute w-[30%] h-[30%] rounded-full border-2 border-nun-primary/80 bg-nun-primary/10"
                 style={{ animation: 'pulse-orb 4s ease-in-out infinite' }}
            ></div>

            {/* Data Packets */}
            <div className="absolute top-0 left-0 w-full h-full">
                {packets.map(packet => (
                    <div
                        key={packet.id}
                        className="absolute rounded-full bg-nun-primary shadow-[0_0_6px_rgba(0,255,255,0.8)]"
                        style={{
                            width: `${packet.size}px`,
                            height: `${packet.size}px`,
                            top: `${packet.y}%`,
                            left: `${packet.x}%`,
                            transform: 'translate(-50%, -50%)',
                            transition: 'top 1s ease-in-out, left 1s ease-in-out',
                            animation: `pulse-packet ${packet.duration}s ease-in-out ${packet.delay}s infinite`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Center Text */}
            <div className="relative text-center z-10">
                <p className="text-xs uppercase text-gray-400">Rule of 3</p>
                <p className={`font-bold text-lg ${status === 'Equilibrium' ? 'text-nun-success' : 'text-nun-warning'}`}>
                    {status}
                </p>
            </div>
        </div>
    );
};