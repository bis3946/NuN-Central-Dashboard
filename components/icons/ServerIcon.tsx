
import React from 'react';

export const ServerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3v-6a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3m-13.5 0v-3.375c0-.621.504-1.125 1.125-1.125h11.25c.621 0 1.125.504 1.125 1.125V14.25m-13.5 0h13.5m-13.5 0a3 3 0 00-3 3v.75a3 3 0 003 3h13.5a3 3 0 003-3v-.75a3 3 0 00-3-3m-13.5 0h13.5" />
    </svg>
);
