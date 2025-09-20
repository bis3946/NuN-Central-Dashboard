import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { useSystem } from '../../context/SystemContext';
import { TrophyIcon } from '../icons/TrophyIcon';

export const TokenomicsCard: React.FC = () => {
    const { systemState } = useSystem();
    const { tokenomicsIncentives } = systemState;

    return (
        <DashboardCard title="Tokenomics & Incentives" icon={<TrophyIcon />} className="2xl:col-span-1">
            <div className="space-y-4 text-center">
                <div>
                    <p className="text-xs uppercase text-gray-400">Contribution Score</p>
                    <p className="text-3xl font-mono font-bold text-nun-primary">{tokenomicsIncentives.contributionScore.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-xs uppercase text-gray-400">Pending Rewards</p>
                        <p className="text-xl font-mono font-bold text-nun-success">{tokenomicsIncentives.pendingRewards.toFixed(4)} <span className="text-sm">NUN</span></p>
                    </div>
                     <div>
                        <p className="text-xs uppercase text-gray-400">Network Rank</p>
                        <p className="text-xl font-mono font-bold text-nun-secondary">{tokenomicsIncentives.networkRank}</p>
                    </div>
                </div>
                 <p className="text-xs text-gray-500 pt-2 border-t border-nun-light/20">
                    Rewards are distributed based on uptime, resources provided, and governance participation.
                </p>
            </div>
        </DashboardCard>
    );
};