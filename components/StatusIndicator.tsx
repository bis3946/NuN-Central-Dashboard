


import React from 'react';
import { SystemStatus } from '../types';

interface StatusIndicatorProps {
  status: SystemStatus;
  animated?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, animated = true }) => {
  const baseClasses = 'w-3 h-3 rounded-full';
  const animationClass = animated ? 'animate-pulse-fast' : '';

  const statusClasses = {
    [SystemStatus.OK]: `bg-nun-success shadow-[0_0_8px_rgba(0,255,0,0.7)] ${animationClass}`,
    [SystemStatus.Warning]: `bg-nun-warning shadow-[0_0_8px_rgba(255,255,0,0.7)] ${animationClass}`,
    [SystemStatus.Error]: `bg-nun-error shadow-[0_0_8px_rgba(255,0,0,0.7)] ${animationClass}`,
    [SystemStatus.Syncing]: `bg-nun-primary shadow-[0_0_8px_rgba(0,255,255,0.7)] ${animationClass}`,
  };

  const tooltip = `Status: ${status}`;

  return <div className={`${baseClasses} ${statusClasses[status]}`} title={tooltip}></div>;
};