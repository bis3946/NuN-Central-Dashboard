import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../context/SystemContext';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { View } from '../App';
import { LogEntry, AIModule, User, Task } from '../types';

interface SearchResults {
    logs: LogEntry[];
    modules: AIModule[];
    users: User[];
    tasks: Task[];
}

interface GlobalSearchBarProps {
    onNavigate: (view: View) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onNavigate }) => {
    const { systemState } = useSystem();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [isActive, setIsActive] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.length < 2) {
            setResults(null);
            return;
        }

        const lowerCaseQuery = query.toLowerCase();

        const filteredLogs = systemState.logs.filter(log =>
            log.message.toLowerCase().includes(lowerCaseQuery)
        ).slice(0, 3);

        const filteredModules = systemState.aiModules.filter(module =>
            module.name.toLowerCase().includes(lowerCaseQuery)
        ).slice(0, 3);

        const filteredUsers = systemState.users.filter(user =>
            user.email.toLowerCase().includes(lowerCaseQuery)
        ).slice(0, 3);

        const filteredTasks = systemState.tasks.filter(task =>
            task.title.toLowerCase().includes(lowerCaseQuery)
        ).slice(0, 3);

        setResults({
            logs: filteredLogs,
            modules: filteredModules,
            users: filteredUsers,
            tasks: filteredTasks,
        });

    }, [query, systemState]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsActive(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavigate = (view: View) => {
        onNavigate(view);
        setQuery('');
        setResults(null);
        setIsActive(false);
    };

    const hasResults = results && (results.logs.length > 0 || results.modules.length > 0 || results.users.length > 0 || results.tasks.length > 0);

    return (
        <div className="relative w-full max-w-lg" ref={searchRef}>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon />
                </span>
                <input
                    type="text"
                    placeholder="Search logs, modules, users, tasks..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsActive(true)}
                    className="w-full bg-nun-dark/50 border border-nun-light/30 rounded-md py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none transition placeholder:text-gray-500"
                />
            </div>

            {isActive && hasResults && (
                <div className="absolute top-full mt-2 w-full bg-nun-dark/90 backdrop-blur-sm border border-nun-light/30 rounded-lg shadow-2xl z-50 animate-fade-in-down">
                    <div className="max-h-96 overflow-y-auto scrollbar-thin text-sm">
                        {results.logs.length > 0 && (
                            <div className="p-2">
                                <h4 className="px-2 py-1 text-xs font-bold text-nun-primary uppercase">Logs</h4>
                                {results.logs.map(log => (
                                    <div key={log.timestamp + log.message} onClick={() => handleNavigate('dashboard')} className="p-2 rounded hover:bg-nun-light/50 cursor-pointer">
                                        <p className="text-gray-300 truncate">{log.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {results.modules.length > 0 && (
                            <div className="p-2 border-t border-nun-light/20">
                                <h4 className="px-2 py-1 text-xs font-bold text-nun-primary uppercase">AI Modules</h4>
                                {results.modules.map(module => (
                                    <div key={module.id} onClick={() => handleNavigate('dashboard')} className="p-2 rounded hover:bg-nun-light/50 cursor-pointer">
                                        <p className="text-gray-300">{module.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {results.users.length > 0 && (
                            <div className="p-2 border-t border-nun-light/20">
                                <h4 className="px-2 py-1 text-xs font-bold text-nun-primary uppercase">Users</h4>
                                {results.users.map(user => (
                                    <div key={user.id} onClick={() => handleNavigate('users')} className="p-2 rounded hover:bg-nun-light/50 cursor-pointer">
                                        <p className="text-gray-300">{user.email}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                         {results.tasks.length > 0 && (
                            <div className="p-2 border-t border-nun-light/20">
                                <h4 className="px-2 py-1 text-xs font-bold text-nun-primary uppercase">Tasks</h4>
                                {results.tasks.map(task => (
                                    <div key={task.id} onClick={() => handleNavigate('tasks')} className="p-2 rounded hover:bg-nun-light/50 cursor-pointer">
                                        <p className="text-gray-300 truncate">{task.title}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};