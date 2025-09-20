import React from 'react';

interface StatusDotProps {
  color: 'green' | 'red';
}

export const StatusDot: React.FC<StatusDotProps> = ({ color }) => {
  const colorClasses = {
    green: 'bg-nun-success shadow-[0_0_8px_rgba(0,255,0,0.7)]',
    red: 'bg-nun-error shadow-[0_0_8px_rgba(255,0,0,0.7)]',
  };

  return <div className={`w-3.5 h-3.5 rounded-full ${colorClasses[color]}`}></div>;
};