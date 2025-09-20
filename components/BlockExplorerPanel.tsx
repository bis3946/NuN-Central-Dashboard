

import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { CubeTransparentIcon } from './icons/CubeTransparentIcon';
import { useSystem } from '../context/SystemContext';

export const BlockExplorerPanel: React.FC = () => {
    const { systemState } = useSystem();
    const { blocks } = systemState;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBlocks = blocks.filter(block => 
        block.hash.includes(searchTerm) || 
        block.height.toString().includes(searchTerm) ||
        block.transactions.some(tx => tx.hash.includes(searchTerm))
    );

    return (
        <DashboardCard title="Live Block Explorer" icon={<CubeTransparentIcon />}>
            <div className="mb-4">
                 <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by Block Height, Hash, or Tx Hash..."
                    className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none transition"
                />
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                <div className="space-y-4">
                    {filteredBlocks.map(block => (
                        <div key={block.hash} className="p-3 bg-nun-dark/50 rounded-lg border border-nun-light/20">
                            <div className="flex justify-between items-center font-mono text-sm">
                                <p><span className="text-gray-500">Block: </span><span className="text-nun-primary font-bold">#{block.height}</span></p>
                                <p className="text-xs text-gray-500">{new Date(block.timestamp).toLocaleString()}</p>
                            </div>
                            <p className="text-xs font-mono text-gray-500 mt-1 break-all">Hash: {block.hash}</p>
                            <div className="mt-2 pt-2 border-t border-nun-light/20">
                                <p className="text-xs text-gray-400 font-bold mb-1">Transactions ({block.transactions.length}):</p>
                                <ul className="space-y-1 text-xs font-mono">
                                    {block.transactions.map(tx => (
                                        <li key={tx.hash} className="text-gray-500 truncate" title={tx.hash}>
                                           - {tx.hash}
                                        </li>
                                    ))}
                                    {block.transactions.length === 0 && <li className="text-gray-600 italic">No transactions in this block.</li>}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </DashboardCard>
    );
};