
import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '', icon }) => {
  return (
    <div className={`bg-nun-dark/80 backdrop-blur-sm border border-nun-light/30 rounded-lg shadow-lg relative overflow-hidden ${className}`} title={`Module: ${title}`}>
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-nun-primary/5 rounded-full blur-3xl"></div>
      
      <div className="flex items-center justify-between p-4 border-b border-nun-light/20">
        <h3 className="text-sm font-bold uppercase tracking-widest text-nun-primary/80 flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h3>
      </div>
      <div className="p-4 relative">
        {children}
      </div>
       <div className="absolute bottom-0 right-0 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-nun-primary/50"></div>
    </div>
  );
};