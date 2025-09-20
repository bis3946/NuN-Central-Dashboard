import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { DashboardCard } from './DashboardCard';
import { BrainIcon } from './icons/BrainIcon';
import { PlayIcon } from './icons/PlayIcon';
import { CheckIcon } from './icons/CheckIcon';

type TaskFilter = 'all' | 'pending' | 'completed';

export const AnaQMLPanel: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const tasks = systemState.aiAgents?.anaQML?.tasks || [];
    const [filter, setFilter] = useState<TaskFilter>('all');

    const handleAddTask = () => {
        const name = `sim_task_${Math.floor(Math.random() * 1000)}`;
        dispatch({ type: 'ANAQML_ADD_TASK', payload: { taskName: name, parameters: { type: "real-time quantum simulation" } } });
    };

    const handleCompleteTask = (taskName: string) => {
        dispatch({ type: 'ANAQML_UPDATE_TASK_RESULT', payload: { taskName, result: { output: "simulation_result", accuracy: Math.random() } } });
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const FilterButton: React.FC<{ status: TaskFilter, label: string }> = ({ status, label }) => (
        <button
            onClick={() => setFilter(status)}
            className={`px-3 py-1 text-xs rounded-full transition ${
                filter === status
                ? 'bg-nun-primary text-nun-darker font-bold'
                : 'bg-nun-dark hover:bg-nun-light/50 text-gray-300'
            }`}
        >
            {label}
        </button>
    );

    return (
        <DashboardCard title="AnaQML Task Orchestrator" icon={<BrainIcon />}>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <h3 className="text-sm text-gray-300">Quantum Machine Learning Tasks</h3>
                <button
                    onClick={handleAddTask}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-nun-primary/80 text-nun-darker rounded hover:bg-nun-primary transition"
                    title="Add a new quantum simulation task to the queue."
                >
                    <PlayIcon />
                    Add Quantum Task
                </button>
            </div>

            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-nun-light/20">
                <span className="text-xs font-bold text-gray-400 uppercase">Filter by Status:</span>
                <FilterButton status="all" label="All" />
                <FilterButton status="pending" label="Pending" />
                <FilterButton status="completed" label="Completed" />
            </div>

            <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin">
                {filteredTasks.length > 0 ? [...filteredTasks].reverse().map(task => (
                    <div key={task.taskName} className={`p-3 bg-nun-dark/60 rounded-lg border-l-4 ${task.status === 'completed' ? 'border-nun-success/50' : 'border-nun-secondary/50'}`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="flex-grow">
                                <p className="font-mono text-gray-200">{task.taskName}</p>
                                <p className="text-xs text-gray-400">
                                    <span className="text-gray-500">Params:</span> {JSON.stringify(task.parameters)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                                    task.status === 'pending' ? 'bg-nun-warning/20 text-nun-warning' : 'bg-nun-success/20 text-nun-success'
                                }`}>
                                    {task.status}
                                </span>
                                {task.status === 'pending' && (
                                    <button
                                        onClick={() => handleCompleteTask(task.taskName)}
                                        className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold bg-nun-success/80 text-nun-darker rounded hover:bg-nun-success transition"
                                        title="Mark task as complete"
                                    >
                                        <CheckIcon />
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                        {task.status === 'completed' && task.result && (
                            <div className="mt-2 pt-2 border-t border-nun-light/20 text-xs text-nun-success/80">
                                <span className="font-bold text-gray-400">Result: </span>
                                <span>{task.result.output} | </span>
                                <span className="font-bold text-gray-400">Accuracy: </span>
                                <span className="font-mono">{(task.result.accuracy * 100).toFixed(2)}%</span>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-8 text-gray-500 italic">
                        <p>No tasks match the filter criteria.</p>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
};