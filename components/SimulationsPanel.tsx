

import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { DashboardCard } from './DashboardCard';
import { BeakerIcon } from './icons/BeakerIcon';
import { Simulation, SimulationStatus, SimulationProposal } from '../types';
import { WalletIcon } from './icons/WalletIcon';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { PlayIcon } from './icons/PlayIcon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { UsersIcon } from './icons/UsersIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon.tsx';
import { Modal } from './Modal';


const SIMULATION_COST = 100;

const SimulationReportModal: React.FC<{ sim: Simulation, onClose: () => void }> = ({ sim, onClose }) => (
    <Modal title={`Report: ${sim.name}`} onClose={onClose}>
        <div className="space-y-4 text-sm">
            <div>
                <h4 className="font-bold text-gray-300">Participants (Quorum)</h4>
                <p className="text-xs text-gray-400">{sim.participants?.join(', ')}</p>
            </div>
            <div>
                <h4 className="font-bold text-gray-300">Modules Involved</h4>
                <p className="text-xs text-gray-400">{sim.modules.join(', ')}</p>
            </div>
            <div>
                <h4 className="font-bold text-gray-300">Simulation Log & Conclusion</h4>
                <pre className="p-2 bg-nun-darker rounded-md text-xs font-mono text-nun-primary/90 max-h-60 overflow-y-auto scrollbar-thin">
                    <code>{sim.report}</code>
                </pre>
            </div>
        </div>
    </Modal>
);

const SimulationProposalsCard: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { simulationProposals, wallet } = systemState;
    const canAfford = wallet.chains.nun.balance >= SIMULATION_COST;

    const handleApproveAndRun = (proposal: SimulationProposal) => {
        if (!canAfford) {
             dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'error', message: `Insufficient funds to run simulation for proposal: ${proposal.id}` } });
            return;
        }
        dispatch({ type: 'APPROVE_SIMULATION_PROPOSAL', payload: { proposalId: proposal.id } });
        dispatch({ type: 'START_SIMULATION', payload: { name: proposal.description, type: 'Parallel', proposal } });
    };

    return (
        <DashboardCard title="Simulation Quorum Proposals" icon={<UsersIcon />}>
             <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                {simulationProposals.filter(p => p.status === 'Pending').map(proposal => (
                    <div key={proposal.id} className="p-3 bg-nun-dark/50 rounded-lg">
                        <p className="text-xs text-nun-primary/80">Proposed by: <span className="font-bold">{proposal.proposer}</span></p>
                        <p className="text-sm text-gray-200 my-1">{proposal.description}</p>
                        <button
                            onClick={() => handleApproveAndRun(proposal)}
                            disabled={!canAfford}
                            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold bg-nun-success/80 text-nun-darker rounded hover:bg-nun-success transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                            title={`Approve and run this simulation. Cost: ${SIMULATION_COST} NUN`}
                        >
                            <PlayIcon /> Approve & Run Simulation
                        </button>
                    </div>
                ))}
                 {simulationProposals.filter(p => p.status === 'Pending').length === 0 && (
                    <div className="text-center py-8 text-gray-500 italic">
                        <p>No new simulation proposals from the AI quorum.</p>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
};

const SimulationControlCard: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { balance } = systemState.wallet.chains.nun;
    const [simName, setSimName] = useState('');
    const [simType, setSimType] = useState<'Ongoing' | 'Parallel'>('Ongoing');
    
    const canAfford = balance >= SIMULATION_COST;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!simName.trim() || !canAfford) return;
        dispatch({ type: 'START_SIMULATION', payload: { name: simName, type: simType } });
        setSimName('');
    }

    return (
        <DashboardCard title="Manual Simulation Control" icon={<BeakerIcon />}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-nun-dark/50 rounded-lg border border-nun-light/20">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 flex items-center gap-2"><WalletIcon /> Your Balance:</span>
                        <span className={`font-mono font-bold ${canAfford ? 'text-nun-primary' : 'text-nun-error'}`}>{balance.toLocaleString()} NUN</span>
                    </div>
                </div>
                <div>
                    <label htmlFor="simName" className="block text-xs text-gray-400 mb-1">Simulation Description</label>
                    <textarea
                        id="simName"
                        rows={3}
                        value={simName}
                        onChange={(e) => setSimName(e.target.value)}
                        placeholder="e.g., Test network response to quantum fluctuation"
                        className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-2 text-sm focus:ring-1 focus:ring-nun-primary focus:outline-none"
                    />
                </div>
                 <div>
                    <label htmlFor="simType" className="block text-xs text-gray-400 mb-1">Simulation Type</label>
                    <select
                        id="simType"
                        value={simType}
                        onChange={(e) => setSimType(e.target.value as 'Ongoing' | 'Parallel')}
                        className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-2 text-sm focus:ring-1 focus:ring-nun-primary focus:outline-none"
                    >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Parallel">Parallel</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={!simName.trim() || !canAfford}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded hover:bg-nun-primary transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                    title={`Cost: ${SIMULATION_COST} NUN`}
                >
                   {canAfford ? `Start Simulation` : `Insufficient Funds`}
                </button>
            </form>
        </DashboardCard>
    );
};

const SimulationItem: React.FC<{ sim: Simulation }> = ({ sim }) => {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const getStatusClasses = (status: SimulationStatus) => {
        switch (status) {
            case SimulationStatus.Ongoing:
            case SimulationStatus.Parallel:
                return 'border-nun-primary/50 text-nun-primary';
            case SimulationStatus.Finished:
                return 'border-nun-success/50 text-nun-success';
            case SimulationStatus.Failed:
                return 'border-nun-error/50 text-nun-error';
        }
    };

    return (
        <>
            <div className={`p-3 rounded-lg border-l-4 bg-nun-dark/40 ${getStatusClasses(sim.status)[0]}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-gray-200 text-sm">{sim.name}</p>
                        <p className={`text-xs font-semibold ${getStatusClasses(sim.status)[1]}`}>
                            {sim.status} {sim.type === 'Parallel' ? '(Parallel)' : ''}
                        </p>
                    </div>
                    {sim.status === SimulationStatus.Finished && sim.successRate && (
                        <div className="text-right">
                             <p className="text-xs text-gray-400">Success Rate</p>
                             <p className="font-mono text-lg text-nun-success">{sim.successRate.toFixed(2)}%</p>
                        </div>
                    )}
                </div>

                <div className="mt-2">
                    <div className="w-full bg-nun-darker rounded-full h-2.5">
                        <div className="bg-nun-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${sim.progress}%` }}></div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5" title="Modules involved in this simulation">
                        <CpuChipIcon />
                        <span>{sim.modules.length} Modules</span>
                    </div>
                     <div className="flex items-center gap-1.5" title="Simulation speed multiplier">
                         <ArrowPathIcon className="w-4 h-4" />
                        <span>Speed: {sim.speed}x</span>
                    </div>
                     <div className="flex items-center gap-1.5" title="Target optimization parameter">
                        <ChartPieIcon />
                        <span>{sim.targetParameter}</span>
                    </div>
                </div>

                {sim.status === SimulationStatus.Finished && (
                    <div className="mt-3 pt-3 border-t border-nun-light/20 flex flex-wrap gap-2 justify-between items-center">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <UsersIcon />
                            <span>Quorum: {sim.participants?.join(', ')}</span>
                        </div>
                        <button 
                            onClick={() => setIsReportOpen(true)}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition"
                        >
                            <DocumentTextIcon /> View Report
                        </button>
                    </div>
                )}
            </div>
            {isReportOpen && <SimulationReportModal sim={sim} onClose={() => setIsReportOpen(false)} />}
        </>
    );
};

export const SimulationsPanel: React.FC = () => {
    const { systemState } = useSystem();
    const { simulations } = systemState;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <SimulationProposalsCard />
                <SimulationControlCard />
            </div>
            <div className="lg:col-span-2">
                <DashboardCard title="Active & Completed Simulations" icon={<ClipboardDocumentListIcon />}>
                    <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin">
                        {simulations.length > 0 ? (
                             [...simulations].map(sim => <SimulationItem key={sim.id} sim={sim} />)
                        ) : (
                             <div className="text-center py-12 text-gray-500 italic">
                                <p>No active or completed simulations.</p>
                             </div>
                        )}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};