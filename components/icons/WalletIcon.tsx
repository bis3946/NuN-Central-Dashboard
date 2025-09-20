
import React from 'react';

export const WalletIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5a2.25 2.25 0 01-2.25 2.25H15a3 3 0 01-6 0H5.25A2.25 2.25 0 013 7.5m18 0v1.5M3 7.5v1.5m18 0A2.25 2.25 0 0118.75 12H5.25A2.25 2.25 0 013 9.75m18 0v6.75a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5V9.75m15 6.75a2.25 2.25 0 002.25-2.25V9.75a2.25 2.25 0 00-2.25-2.25h-4.5m-6.75 0h-4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
