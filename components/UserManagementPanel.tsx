

import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { useSystem } from '../context/SystemContext';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { User, UserRole } from '../types';
import { RegistrationModal } from './RegistrationModal';
import { TrashIcon } from './icons/TrashIcon';

export const UserManagementPanel: React.FC = () => {
    const { systemState, dispatch } = useSystem();
    const { users } = systemState;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        dispatch({ type: 'CHANGE_USER_ROLE', payload: { userId, newRole } });
    };

    const handleDeleteUser = (userId: string, userEmail: string) => {
        if (window.confirm(`Are you sure you want to permanently delete the user: ${userEmail}? This action cannot be undone.`)) {
            dispatch({ type: 'DELETE_USER', payload: userId });
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case UserRole.SuperAdmin: return 'text-nun-error';
            case UserRole.Admin: return 'text-nun-secondary';
            case UserRole.Moderator: return 'text-nun-primary';
            case UserRole.Banned: return 'text-gray-600';
            case UserRole.Restricted: return 'text-nun-warning';
            default: return 'text-gray-400';
        }
    };

    return (
        <>
            <DashboardCard title="User Management" icon={<ShieldCheckIcon />}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm text-gray-300">System Users & Roles</h3>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-nun-success/80 text-nun-darker rounded hover:bg-nun-success transition"
                        title="Open a form to register a new member in the NuN ecosystem."
                    >
                        <UserPlusIcon />
                        Register New Member
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-nun-primary/70 uppercase border-b border-nun-light/30">
                            <tr>
                                <th scope="col" className="px-4 py-2">Email</th>
                                <th scope="col" className="px-4 py-2">Blockchain Hash</th>
                                <th scope="col" className="px-4 py-2">Role</th>
                                <th scope="col" className="px-4 py-2 text-center">Status</th>
                                <th scope="col" className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: User) => (
                                <tr key={user.id} className="border-b border-nun-light/20 hover:bg-nun-light/20">
                                    <td className="px-4 py-2 font-mono text-gray-300">{user.email}</td>
                                    <td className="px-4 py-2 font-mono text-gray-500" title={user.blockchainHash}>
                                        {user.blockchainHash.substring(0, 12)}...
                                    </td>
                                    <td className={`px-4 py-2 font-bold ${getRoleColor(user.role)}`}>{user.role}</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${user.status === 'Active' ? 'bg-nun-success/20 text-nun-success' : 'bg-nun-error/20 text-nun-error'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                       <div className="flex items-center justify-center gap-2">
                                            <select 
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                                className="bg-nun-darker border border-nun-light/50 rounded-md p-1 text-xs focus:ring-1 focus:ring-nun-primary focus:outline-none"
                                                disabled={user.role === UserRole.SuperAdmin}
                                                title={`Change role for ${user.email}`}
                                            >
                                                {Object.values(UserRole).map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                            <button 
                                                onClick={() => handleDeleteUser(user.id, user.email)}
                                                disabled={user.role === UserRole.SuperAdmin}
                                                className="p-2 rounded-md text-gray-400 hover:text-nun-error hover:bg-nun-light/30 transition disabled:text-gray-600 disabled:cursor-not-allowed"
                                                title={`Delete ${user.email}`}
                                            >
                                                <TrashIcon />
                                            </button>
                                       </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DashboardCard>
            {isModalOpen && <RegistrationModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};