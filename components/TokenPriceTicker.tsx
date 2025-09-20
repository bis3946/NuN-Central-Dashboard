import React from 'react';
import { DashboardCard } from './DashboardCard';
import { useSystem } from '../context/SystemContext';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';

export const TokenPriceTicker: React.FC = () => {
    const { systemState } = useSystem();
    const { tokenMarket } = systemState;

    const isPositive = tokenMarket.change24h >= 0;
    const changeColor = isPositive ? 'text-nun-success' : 'text-nun-error';

    return (
        <DashboardCard title="NuN Token Market Price" icon={<CurrencyDollarIcon />}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold text-nun-primary">${tokenMarket.priceUSD.toFixed(3)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Updated: {new Date(tokenMarket.lastUpdated).toLocaleTimeString()}
                    </p>
                </div>
                <div className={`text-right ${changeColor}`}>
                    <div className="flex items-center justify-end gap-1">
                        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        <p className="text-xl font-bold">{Math.abs(tokenMarket.change24h).toFixed(2)}%</p>
                    </div>
                    <p className="text-xs">24h Change</p>
                </div>
            </div>
        </DashboardCard>
    );
};