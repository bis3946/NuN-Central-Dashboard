import React, { useState, useEffect } from 'react';
import { ClockIcon } from './icons/ClockIcon';

export const RealTimeClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const formattedTime = time.toLocaleString('en-GB', {
        timeZone: 'CET',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    return (
        <div className="hidden sm:flex items-center gap-2 bg-nun-dark/50 px-3 py-1.5 rounded-md border border-nun-light/20">
            <ClockIcon className="w-4 h-4 text-nun-primary/70" />
            <span className="font-mono text-sm text-nun-primary tracking-widest">
                {formattedTime}
            </span>
            <span className="text-xs text-gray-500">CET</span>
        </div>
    );
};
