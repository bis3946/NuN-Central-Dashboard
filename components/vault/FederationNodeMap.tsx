import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { FederationNode, SystemStatus } from '../../types';

const NodeDot: React.FC<{ node: FederationNode; position: { x: string; y: string } }> = ({ node, position }) => {
    const [isHovered, setIsHovered] = useState(false);

    const typeColor = {
        'Core': 'bg-nun-secondary',
        'SuperNode': 'bg-nun-primary',
        'Device': 'bg-nun-success',
    };

    const statusAnimation = node.status === SystemStatus.OK ? 'animate-pulse-fast' : '';

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: position.x, top: position.y }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`w-3 h-3 rounded-full ${typeColor[node.type || 'Device']} cursor-pointer transition-transform duration-200 hover:scale-150 ${statusAnimation} border-2 border-nun-darker`}></div>
            {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-nun-darker text-xs rounded-md shadow-lg z-10 border border-nun-light/30">
                    <p className="font-bold text-gray-200">{node.name}</p>
                    <p>Type: <span className="font-semibold text-nun-primary">{node.type}</span></p>
                    <p>Status: <span className={node.status === SystemStatus.OK ? 'text-nun-success' : 'text-nun-warning'}>{node.status}</span></p>
                    <p>Latency: {node.latency}ms</p>
                </div>
            )}
        </div>
    );
};

export const FederationNodeMap: React.FC = () => {
    const { systemState } = useSystem();
    const { federationNodes } = systemState;

    // Mercator projection simplified
    const project = (lat: number, lon: number) => {
        const x = (lon + 180) / 360 * 100;
        const y = (90 - lat) / 180 * 100;
        return { x: `${x}%`, y: `${y}%` };
    };

    return (
        <div className="relative w-full aspect-[2/1] bg-nun-dark/30 rounded-lg overflow-hidden">
             {/* Background map layer */}
            <div 
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-20"
                style={{ backgroundImage: "url('https://raw.githubusercontent.com/tony-belpaeme/world-map-react/master/src/world-map-background.svg')" }}
                role="presentation"
            ></div>
            {/* Darkening overlay for better contrast */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>

            {/* Node layer */}
            <div className="absolute top-0 left-0 w-full h-full">
                {federationNodes.filter(n => n.location).map(node => (
                    <NodeDot key={node.name} node={node} position={project(node.location![0], node.location![1])} />
                ))}
            </div>

            {/* Legend */}
            <div className="absolute bottom-2 left-2 p-2 bg-nun-darker/70 rounded-md text-xs space-y-1 z-10">
                <h4 className="font-bold text-gray-300">Legend</h4>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-nun-secondary"></div><span>Core Node</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-nun-primary"></div><span>SuperNode</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-nun-success"></div><span>Device Node</span></div>
            </div>
        </div>
    );
};