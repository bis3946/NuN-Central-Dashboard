import React from 'react';

export const BeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v11.622a2.25 2.25 0 003.385 1.884l2.16-1.543a2.25 2.25 0 00-1.24-4.023l-1.023-.17a1.5 1.5 0 01-1.262-1.432V3.104a2.25 2.25 0 00-2.018-2.185A2.25 2.25 0 009.75 3.104z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.75c0 1.036.84 1.875 1.875 1.875h.375m1.5 0h.375M6 3.75v15A2.25 2.25 0 008.25 21h7.5A2.25 2.25 0 0018 18.75V3.75M9 3.75h6" />
    </svg>
);