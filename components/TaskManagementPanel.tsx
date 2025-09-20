import React, { useState, useRef, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { useSystem } from '../context/SystemContext';
import { Task, TaskPriority, AIModule, AITaskSuggestion } from '../types';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { ArrowUpOnSquareIcon } from './icons/ArrowUpOnSquareIcon';
import { Bars3Icon } from './icons/Bars3Icon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { LinkIcon } from './icons/LinkIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { UsersIcon } from './icons/UsersIcon';

const OrchestratorSelector: React.FC<{
    taskId: string;
    allModules: AIModule[];
    assigned: string[];
}> = ({ taskId, allModules, assigned }) => {
    const { dispatch } = useSystem();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (moduleName: string) => {
        const newAssigned = assigned.includes(moduleName)
            ? assigned.filter(name => name !== moduleName)
            : [...assigned, moduleName];
        dispatch({ type: 'ASSIGN_TASK_ORCHESTRATORS', payload: { taskId, orchestratorIds: newAssigned } });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold bg-nun-darker border border-nun-light/50 rounded hover:bg-nun-light transition"
            >
                <CpuChipIcon />
                <span>Assign ({assigned.length})</span>
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-nun-dark border border-nun-light/30 rounded-md shadow-lg z-20 animate-fade-in-down">
                    <div className="p-2 border-b border-nun-light/20">
                        <p className="text-xs font-bold text-gray-400">Select Orchestrators</p>
                    </div>
                    {allModules.map(module => (
                        <label key={module.id} className="flex items-center gap-2 p-2 hover:bg-nun-light/50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={assigned.includes(module.name)}
                                onChange={() => handleToggle(module.name)}
                                className="form-checkbox h-4 w-4 bg-nun-darker border-nun-light/50 rounded text-nun-primary focus:ring-nun-primary"
                            />
                            <span className="text-xs text-gray-200">{module.name}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const DependencySelector: React.FC<{
    taskId: string;
    allTasks: Task[];
    assigned: string[];
    onDepsChange: (deps: string[]) => void;
}> = ({ taskId, allTasks, assigned, onDepsChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (dependencyId: string) => {
        const newAssigned = assigned.includes(dependencyId)
            ? assigned.filter(id => id !== dependencyId)
            : [...assigned, dependencyId];
        onDepsChange(newAssigned);
    };

    const availableTasks = allTasks.filter(t => t.id !== taskId);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold bg-nun-darker border border-nun-light/50 rounded hover:bg-nun-light transition"
            >
                <LinkIcon />
                <span>Deps ({assigned.length})</span>
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-nun-dark border border-nun-light/30 rounded-md shadow-lg z-20 animate-fade-in-down">
                    <div className="p-2 border-b border-nun-light/20">
                        <p className="text-xs font-bold text-gray-400">Select Dependencies</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto scrollbar-thin">
                        {availableTasks.length > 0 ? availableTasks.map(task => (
                            <label key={task.id} className="flex items-center gap-2 p-2 hover:bg-nun-light/50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={assigned.includes(task.id)}
                                    onChange={() => handleToggle(task.id)}
                                    className="form-checkbox h-4 w-4 bg-nun-darker border-nun-light/50 rounded text-nun-primary focus:ring-nun-primary"
                                />
                                <span className="text-xs text-gray-200 truncate" title={task.title}>{task.title}</span>
                            </label>
                        )) : (
                            <p className="p-2 text-xs text-gray-500 italic">No other tasks available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const AITaskSuggestionCard: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { taskSuggestions } = systemState;

    const handleAccept = (suggestionId: string) => {
        dispatch({ type: 'ACCEPT_AI_TASK_SUGGESTION', payload: { suggestionId } });
    };

    const handleReject = (suggestionId: string) => {
        dispatch({ type: 'REJECT_AI_TASK_SUGGESTION', payload: { suggestionId } });
    };

    return (
        <DashboardCard title="AI Task Suggestions" icon={<LightbulbIcon />}>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                {taskSuggestions.length > 0 ? taskSuggestions.map(sugg => (
                    <div key={sugg.id} className="p-3 bg-nun-dark/50 rounded-lg text-sm">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="font-bold text-gray-200">{sugg.title}</p>
                                <p className="text-xs text-nun-primary/80">Proposed by: <span className="font-bold">{sugg.proposer}</span></p>
                            </div>
                            <span className="px-2 py-0.5 text-xs rounded-full font-semibold bg-nun-warning/20 text-nun-warning">{sugg.priority} Priority</span>
                        </div>
                        <p className="text-xs text-gray-400 italic my-2 p-2 bg-nun-darker/50 rounded">"{sugg.reasoning}"</p>
                        <p className="text-xs text-gray-500">Recommended Orchestrators: <span className="font-semibold text-gray-400">{sugg.recommendedOrchestrators.join(', ')}</span></p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => handleReject(sugg.id)}
                                className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-bold bg-nun-error/80 text-white rounded hover:bg-nun-error transition"
                            >
                                <XMarkIcon/> Reject
                            </button>
                             <button
                                onClick={() => handleAccept(sugg.id)}
                                className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-bold bg-nun-success/80 text-nun-darker rounded hover:bg-nun-success transition"
                            >
                                <CheckIcon/> Accept
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-8 text-gray-500 italic">
                        <p>No new suggestions from AI entities.</p>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
};


export const TaskManagementPanel: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { tasks, aiModules } = systemState;
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(TaskPriority.Medium);
    const [newTaskDependencies, setNewTaskDependencies] = useState<string[]>([]);
    const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'In Progress' | 'Completed'>('all');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        dispatch({ type: 'ADD_TASK', payload: { title: newTaskTitle, priority: newTaskPriority, dependencies: newTaskDependencies } });
        setNewTaskTitle('');
        setNewTaskPriority(TaskPriority.Medium);
        setNewTaskDependencies([]);
    };

    const handlePriorityChange = (taskId: string, priority: TaskPriority) => {
        dispatch({ type: 'UPDATE_TASK_PRIORITY', payload: { taskId, priority } });
    };
    
    const handleStatusChange = (taskId: string, status: Task['status']) => {
        dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status } });
    };

    const handleDependenciesChange = (taskId: string, dependencies: string[]) => {
        dispatch({ type: 'UPDATE_TASK_DEPENDENCIES', payload: { taskId, dependencies } });
    };
    
    const handleAssignAll = (taskId: string) => {
        dispatch({ type: 'ASSIGN_ALL_ORCHESTRATORS_TO_TASK', payload: { taskId } });
    };

    const handleSortByPriority = () => {
        dispatch({ type: 'SORT_TASKS_BY_PRIORITY' });
    };
    
    const handleSortByStatus = () => {
        dispatch({ type: 'SORT_TASKS_BY_STATUS' });
    };

    const getPriorityClasses = (priority: TaskPriority) => {
        switch (priority) {
            case TaskPriority.High: return 'border-nun-error/50';
            case TaskPriority.Medium: return 'border-nun-warning/50';
            case TaskPriority.Low: return 'border-nun-primary/50';
            default: return 'border-gray-500/50';
        }
    };
    
    const getPrioritySelectClasses = (priority: TaskPriority) => {
        switch (priority) {
            case TaskPriority.High: return 'bg-nun-error/80 text-white';
            case TaskPriority.Medium: return 'bg-nun-warning/80 text-nun-darker';
            case TaskPriority.Low: return 'bg-nun-primary/80 text-nun-darker';
            default: return 'bg-gray-600';
        }
    };
    
    const getStatusBadgeClasses = (status: Task['status']) => {
        switch (status) {
            case 'In Progress': return 'bg-nun-primary/20 text-nun-primary';
            case 'Completed': return 'bg-nun-success/20 text-nun-success';
            case 'Pending': return 'bg-nun-warning/20 text-nun-warning';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };
    
    const getStatusSelectClasses = (status: Task['status']) => {
        switch (status) {
            case 'In Progress': return 'bg-nun-primary/80 text-nun-darker';
            case 'Completed': return 'bg-nun-success/80 text-nun-darker';
            case 'Pending': return 'bg-nun-warning/80 text-nun-darker';
            default: return 'bg-gray-600';
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'all') return true;
        return task.status === filterStatus;
    });

    const isTaskBlocked = (task: Task): boolean => {
      if (!task.dependencies || task.dependencies.length === 0) return false;
      return task.dependencies.some(depId => {
        const dependency = tasks.find(t => t.id === depId);
        return !dependency || dependency.status !== 'Completed';
      });
    };

    const filterOptions: Array<typeof filterStatus> = ['all', 'Pending', 'In Progress', 'Completed'];

    return (
        <div className="space-y-6">
            <AITaskSuggestionCard />

            <DashboardCard title="Task Management & AI Orchestration" icon={<ListBulletIcon />}>
                <div className="mb-6 p-4 bg-nun-dark/50 rounded-lg border border-nun-light/20">
                    <h3 className="text-sm font-bold text-gray-300 mb-2">Add New Task</h3>
                    <form onSubmit={handleAddTask} className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Enter new task description..."
                                className="flex-grow bg-nun-darker border border-nun-light/50 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none transition"
                            />
                            <select
                                value={newTaskPriority}
                                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                                className="bg-nun-darker border border-nun-light/50 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none"
                            >
                                {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded-md hover:bg-nun-primary transition"
                            >
                                Add Task
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                             <DependencySelector taskId="new-task" allTasks={tasks} assigned={newTaskDependencies} onDepsChange={setNewTaskDependencies} />
                             <span className="text-xs text-gray-400">Set prerequisites for this new task.</span>
                        </div>
                    </form>
                </div>
                
                <div className="flex items-center gap-2 mb-4 border-b border-nun-light/20 pb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase">Filter:</span>
                    {filterOptions.map(option => (
                        <button
                            key={option}
                            onClick={() => setFilterStatus(option)}
                            className={`px-3 py-1 text-xs rounded-full transition ${
                                filterStatus === option
                                ? 'bg-nun-primary text-nun-darker font-bold'
                                : 'bg-nun-dark hover:bg-nun-light/50 text-gray-300'
                            }`}
                            title={`Filter tasks to show: ${option === 'all' ? 'All' : option}`}
                        >
                            {option === 'all' ? 'All Tasks' : option}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <h3 className="text-sm text-gray-300">Current Tasks ({filteredTasks.length})</h3>
                    <div className="flex items-center gap-2">
                         <button
                            onClick={handleSortByStatus}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition"
                            title="Sort tasks based on their current status (In Progress, Pending, Completed)."
                        >
                            <Bars3Icon />
                            Sort by Status
                        </button>
                        <button
                            onClick={handleSortByPriority}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition"
                            title="Sort tasks with the highest priority first."
                        >
                            <ArrowUpOnSquareIcon />
                            Sort by Priority
                        </button>
                    </div>
                </div>

                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin">
                    {filteredTasks.map((task: Task) => {
                        const blocked = isTaskBlocked(task);
                        return (
                        <div key={task.id} className={`p-3 rounded-lg border-l-4 bg-nun-dark/40 transition-opacity ${getPriorityClasses(task.priority)} ${task.status === 'Completed' ? 'opacity-50' : ''}`}>
                            <div className="flex items-start justify-between flex-wrap gap-y-2">
                                <div className="flex-grow pr-4">
                                    <p className={`text-gray-200 flex items-center gap-2 ${task.status === 'Completed' ? 'line-through' : ''}`}>
                                        {blocked && <LockClosedIcon />}
                                        {task.origin === 'simulation' && (
                                            <span title="Auto-generated from simulation" className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-nun-success/20 text-nun-success font-semibold flex-shrink-0">
                                                <BeakerIcon className="w-3 h-3" />
                                                <span>Sim</span>
                                            </span>
                                        )}
                                        {task.origin === 'ai-suggestion' && (
                                            <span title="Generated from AI suggestion" className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-nun-warning/20 text-nun-warning font-semibold flex-shrink-0">
                                                <LightbulbIcon className="w-3 h-3" />
                                                <span>AI</span>
                                            </span>
                                        )}
                                        <span className="truncate" title={task.title}>{task.title}</span>
                                    </p>
                                    <span className={`px-2 py-0.5 text-xs rounded-full mt-1 inline-block ${getStatusBadgeClasses(task.status)}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => handleAssignAll(task.id)} className="p-1.5 text-gray-400 hover:text-nun-primary transition" title="Assign All Orchestrators"><UsersIcon /></button>
                                    <OrchestratorSelector taskId={task.id} allModules={aiModules} assigned={task.assignedOrchestrators || []} />
                                    <DependencySelector taskId={task.id} allTasks={tasks} assigned={task.dependencies || []} onDepsChange={(deps) => handleDependenciesChange(task.id, deps)} />
                                    <div className="w-28">
                                        <select
                                            value={task.priority}
                                            onChange={(e) => handlePriorityChange(task.id, e.target.value as TaskPriority)}
                                            className={`w-full border-none rounded-md p-1 text-xs font-bold focus:ring-2 focus:ring-white focus:outline-none ${getPrioritySelectClasses(task.priority)}`}
                                            title={`Set priority for: ${task.title}`}
                                        >
                                            {Object.values(TaskPriority).map(p => <option key={p} value={p} className="bg-nun-dark text-white">{p}</option>)}
                                        </select>
                                    </div>
                                     <div className="w-28">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                                            className={`w-full border-none rounded-md p-1 text-xs font-bold focus:ring-2 focus:ring-white focus:outline-none ${getStatusSelectClasses(task.status)} ${blocked ? 'cursor-not-allowed' : ''}`}
                                            title={`Set status for: ${task.title}`}
                                        >
                                            <option value="Pending" className="bg-nun-dark text-white">Pending</option>
                                            <option value="In Progress" className="bg-nun-dark text-white" disabled={blocked}>In Progress</option>
                                            <option value="Completed" className="bg-nun-dark text-white">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                             {(task.assignedOrchestrators && task.assignedOrchestrators.length > 0 || task.dependencies && task.dependencies.length > 0) && (
                                <div className="mt-3 pt-3 border-t border-nun-light/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {task.assignedOrchestrators && task.assignedOrchestrators.length > 0 && (
                                        <div>
                                            <h5 className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Assigned Orchestrators</h5>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {task.assignedOrchestrators.map(name => (
                                                    <span key={name} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-nun-light rounded-full text-nun-primary shadow-sm">
                                                        <CpuChipIcon />
                                                        {name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {task.dependencies && task.dependencies.length > 0 && (
                                         <div>
                                            <h5 className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Dependencies</h5>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {task.dependencies.map(depId => {
                                                    const depTask = tasks.find(t => t.id === depId);
                                                    return (
                                                        <span key={depId} className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-nun-light rounded-full text-gray-300 shadow-sm" title={depTask?.title}>
                                                            <LinkIcon />
                                                            <span className={`${depTask?.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>{depTask?.title.substring(0,20) || 'Unknown Task'}...</span>
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )})}
                     {filteredTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>No tasks match the current filter.</p>
                        </div>
                    )}
                </div>
            </DashboardCard>
        </div>
    );
};