


import React from 'react';
import { DashboardCard } from './DashboardCard';
import { useSystem } from '../context/SystemContext';
import { CubeIcon } from './icons/CubeIcon';

export const AnaQMLMetrics: React.FC = () => {
    const { systemState } = useSystem();
    const { anaQMLMetrics } = systemState;

    const getBarColor = (value: number) => {
        if (value > 90) return 'bg-nun-success';
        if (value > 70) return 'bg-nun-primary';
        if (value > 50) return 'bg-nun-warning';
        return 'bg-nun-error';
    }

    return (
        <DashboardCard title="AnaQML Quantum Metrics" icon={<CubeIcon />}>
            <div className="space-y-3 text-sm">
                <div>
                    <p className="text-gray-400 text-xs flex justify-between">Qubit Coherence <span>{anaQMLMetrics.qubitCoherence.toFixed(2)}%</span></p>
                    <div className="w-full bg-nun-darker rounded-full h-2.5">
                        <div className={`${getBarColor(anaQMLMetrics.qubitCoherence)} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${anaQMLMetrics.qubitCoherence}%` }}></div>
                    </div>
                </div>
                <div>
                    <p className="text-gray-400 text-xs flex justify-between">Neural Emulation Accuracy <span>{anaQMLMetrics.neuralAccuracy.toFixed(2)}%</span></p>
                    <div className="w-full bg-nun-darker rounded-full h-2.5">
                         <div className={`${getBarColor(anaQMLMetrics.neuralAccuracy)} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${anaQMLMetrics.neuralAccuracy}%` }}></div>
                    </div>
                </div>
                 <div>
                    <p className="text-gray-400 text-xs flex justify-between">Predictive Model Confidence <span>{anaQMLMetrics.modelConfidence.toFixed(2)}%</span></p>
                    <div className="w-full bg-nun-darker rounded-full h-2.5">
                         <div className={`${getBarColor(anaQMLMetrics.modelConfidence)} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${anaQMLMetrics.modelConfidence}%` }}></div>
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};