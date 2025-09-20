import React, { useState, useEffect, useRef } from 'react';
import { DashboardCard } from './DashboardCard';
import { ShareIcon } from './icons/ShareIcon';
import { useSystem } from '../context/SystemContext';
import { SystemStatus, FederationNode } from '../types';

// Refined NodeTooltip component for a clearer and more visually appealing display of details on hover.
const NodeTooltip: React.FC<{ node: FederationNode; position: { x: number; y: number } }> = ({ node, position }) => {
    const style = {
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(20px, -50%)', // Position to the right and centered vertically
    };
    const statusColor = node.status === SystemStatus.OK ? 'text-nun-success' : 'text-nun-warning';
    
    return (
        <div 
            className="absolute p-3 bg-nun-dark/90 backdrop-blur-sm text-xs rounded-lg shadow-2xl z-20 border border-nun-light/40 w-56 animate-fade-in-down"
            style={style}
        >
            <div className="border-b border-nun-light/20 pb-2 mb-2">
                 <p className="font-bold text-base text-nun-primary">{node.name}</p>
                 <p className="text-gray-400">{node.type} Node</p>
            </div>
            <div className="space-y-1.5 font-mono">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">STATUS</span>
                    <span className={`font-bold ${statusColor}`}>{node.status}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">LATENCY</span>
                    <span className="text-gray-200">{node.latency}ms</span>
                </div>
            </div>
        </div>
    );
};

export const QuantumMeshVisualizer: React.FC = () => {
    const { systemState } = useSystem();
    const { federationNodes } = systemState;
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodePositions, setNodePositions] = useState<Array<{ x: number, y: number }>>([]);
    const [hoveredNode, setHoveredNode] = useState<FederationNode | null>(null);

    const isCoherent = federationNodes.every(node => node.status === SystemStatus.OK);
    const meshState = isCoherent ? 'Coherent' : 'Decoherent Alert';
    
    // Dynamically set classes for the global status indicator to reinforce the visual state.
    const globalStatusContainerClasses = isCoherent
        ? 'border-nun-light/20 bg-nun-dark/70'
        : 'border-nun-error/60 bg-nun-error/10 animate-pulse';
        
    const globalStatusTextClasses = isCoherent ? 'text-nun-success' : 'text-nun-error';


    // Calculate node positions in a circular layout
    useEffect(() => {
        if (!containerRef.current || federationNodes.length === 0) return;
        
        const updatePositions = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.35;
            
            const coreNode = federationNodes.find(n => n.type === 'Core');
            const otherNodes = federationNodes.filter(n => n.name !== coreNode?.name);
            
            const positions = new Array(federationNodes.length);
            const angleStep = otherNodes.length > 0 ? (2 * Math.PI) / otherNodes.length : 0;
            
            federationNodes.forEach((node, i) => {
                if (node.name === coreNode?.name) {
                    positions[i] = { x: centerX, y: centerY };
                } else {
                    const otherNodeIndex = otherNodes.findIndex(n => n.name === node.name);
                    const angle = angleStep * otherNodeIndex - Math.PI / 2; // Start from top
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    positions[i] = { x, y };
                }
            });
            setNodePositions(positions);
        }

        updatePositions();
        window.addEventListener('resize', updatePositions);
        return () => window.removeEventListener('resize', updatePositions);

    }, [federationNodes]);

    const getNodeDotStyle = (node: FederationNode) => {
        const typeColor = {
            'Core': 'bg-nun-secondary shadow-[0_0_12px_rgba(255,0,255,0.8)]',
            'SuperNode': 'bg-nun-primary shadow-[0_0_12px_rgba(0,255,255,0.8)]',
            'Device': 'bg-nun-success shadow-[0_0_12px_rgba(0,255,0,0.8)]',
        };
        const base = 'absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-200 hover:scale-150 border-2 border-nun-darker transform -translate-x-1/2 -translate-y-1/2';
        const statusAnimation = node.status !== SystemStatus.OK ? 'animate-pulse' : 'animate-pulse-fast';
        return `${base} ${typeColor[node.type || 'Device']} ${statusAnimation}`;
    };

    const getLineStyle = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
        const length = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        return {
            width: `${length}px`,
            left: `${midX - length / 2}px`,
            top: `${midY}px`,
            transform: `rotate(${angle}deg)`,
        };
    };

    return (
        <DashboardCard title="Quantum Mesh Protocol Monitor" icon={<ShareIcon />}>
            <div ref={containerRef} className="relative w-full h-[250px]">
                 {/* Background grid */}
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
                
                {/* Connection Lines */}
                <div className="absolute top-0 left-0 w-full h-full">
                    {federationNodes.map((node1, i) =>
                        federationNodes.slice(i + 1).map((node2) => {
                             const pos1 = nodePositions[i];
                             const pos2 = nodePositions[federationNodes.findIndex(n => n.name === node2.name)];
                            if (!pos1 || !pos2) return null;
                            const lineIsCoherent = node1.status === SystemStatus.OK && node2.status === SystemStatus.OK;
                            const lineStyle = getLineStyle(pos1, pos2);
                            const colorClass = lineIsCoherent ? 'bg-nun-primary/50' : 'bg-nun-warning/40 animate-pulse';
                            
                            return (
                                <div
                                    key={`${node1.name}-${node2.name}`}
                                    className={`absolute h-px transition-colors duration-300 ${colorClass}`}
                                    style={lineStyle}
                                ></div>
                            );
                        })
                    )}
                </div>

                {/* Nodes */}
                <div className="absolute top-0 left-0 w-full h-full">
                    {federationNodes.map((node, i) => {
                        const position = nodePositions[i];
                        if (!position) return null;
                        return (
                            <div
                                key={node.name}
                                className={getNodeDotStyle(node)}
                                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                                onMouseEnter={() => setHoveredNode(node)}
                                onMouseLeave={() => setHoveredNode(null)}
                            />
                        );
                    })}
                </div>
                
                {/* Tooltip */}
                {hoveredNode && nodePositions[federationNodes.findIndex(n => n.name === hoveredNode.name)] &&
                    <NodeTooltip node={hoveredNode} position={{
                        x: nodePositions[federationNodes.findIndex(n => n.name === hoveredNode.name)].x / (containerRef.current?.offsetWidth || 1) * 100,
                        y: nodePositions[federationNodes.findIndex(n => n.name === hoveredNode.name)].y / (containerRef.current?.offsetHeight || 1) * 100
                    }} />
                }
                
                {/* Global Status Indicator - Enhanced for better visual feedback */}
                <div className={`absolute top-2 right-2 px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm border transition-colors duration-500 ${globalStatusContainerClasses}`}>
                    <p>
                        <span className="text-gray-400 font-semibold uppercase">State: </span>
                        <span className={`${globalStatusTextClasses} font-bold tracking-wider`}>{meshState}</span>
                    </p>
                </div>
            </div>
        </DashboardCard>
    );
};