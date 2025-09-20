import React from 'react';

export const EthereumIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg fill="currentColor" className={className || "w-5 h-5"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 4.44l5.36 6.56-5.36 2.87-5.36-2.87L12 4.44zM12.01 13.91l5.35-2.87-5.35-2.02-5.35 2.02 5.35 2.87zM12 14.82l-5.36-2.87L12 19.56l5.36-7.61L12 14.82z"/>
    </svg>
);
