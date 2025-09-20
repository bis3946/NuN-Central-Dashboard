
import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { RegistrationForm } from './RegistrationForm';
import { useSystem } from '../context/SystemContext';
import { PasswordResetForm } from './PasswordResetForm';
import { apiLogin } from '../utils/api';
import { UserRole } from '../types';

interface LoginScreenProps {
    onLoginSuccess: (role: 'root' | 'guest') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const { systemState, dispatch } = useSystem();
    const [view, setView] = useState<'login' | 'register' | 'resetPassword'>('login');
    const [username, setUsername] = useState('bis3946');
    const [password, setPassword] = useState('3985394699');
    const [error, setError] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsAuthenticating(true);
        
        try {
            await apiLogin(username, password);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { role: UserRole.SuperAdmin } });
            dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: `Root Authority ${username} authenticated.` } });
            onLoginSuccess('root');
        } catch (err: any) {
            const errorMessage = err.message || 'An unknown error occurred.';
            setError(errorMessage);
            dispatch({ type: 'LOGIN_FAILURE' });
            dispatch({ type: 'ADD_LOG', payload: { level: 'WARN', message: `Failed login attempt for user: ${username}` } });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'error', message: `Login Failed: ${errorMessage}` } });
        } finally {
            setIsAuthenticating(false);
        }
    };
    
    const handleGuestLogin = () => {
        dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: 'Guest user accessed the dashboard.' } });
        onLoginSuccess('guest');
    };

    const handleRegistrationSuccess = () => {
        setView('login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md p-8 bg-nun-dark/80 backdrop-blur-sm border border-nun-light/30 rounded-lg shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5 pointer-events-none"></div>
                <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-nun-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-nun-primary tracking-wider">NuN Central Dashboard</h1>
                        <p className="text-sm text-gray-400">
                            {view === 'login' && 'Root Authority Authentication'}
                            {view === 'register' && 'New Member Registration'}
                            {view === 'resetPassword' && 'Reset Your Password'}
                        </p>
                    </div>

                    {view === 'login' && (
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <UserIcon />
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none transition"
                                    required
                                    disabled={isAuthenticating}
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <LockClosedIcon />
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none transition"
                                    required
                                    disabled={isAuthenticating}
                                />
                            </div>
                            
                            {error && <p className="text-sm text-nun-error text-center animate-pulse">{error}</p>}

                            <div className="text-right">
                                <button type="button" onClick={() => setView('resetPassword')} className="text-xs text-nun-primary/80 hover:text-nun-primary underline">
                                    Forgot Password?
                                </button>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isAuthenticating}
                                    className="w-full px-4 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded-md hover:bg-nun-primary disabled:bg-gray-600 disabled:cursor-wait transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]"
                                    title="Log in as Root Authority with full administrative privileges."
                                >
                                    {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
                                </button>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500 uppercase before:flex-1 before:border-t before:border-nun-light/20 before:mr-4 after:flex-1 after:border-t after:border-nun-light/20 after:ml-4">
                                Or
                            </div>
                            
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={handleGuestLogin}
                                    disabled={isAuthenticating}
                                    className="w-full px-4 py-2 text-sm font-bold bg-nun-light/50 text-gray-300 rounded-md hover:bg-nun-light/80 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    title="Access a read-only version of the dashboard with limited functionality."
                                >
                                    Continue as Guest
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('register')}
                                    disabled={isAuthenticating}
                                    className="w-full px-4 py-2 text-sm font-bold bg-nun-secondary/20 text-nun-secondary rounded-md hover:bg-nun-secondary/40 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    title="Create a new Member account in the NuN ecosystem."
                                >
                                    Register New Member
                                </button>
                            </div>
                        </form>
                    )} 
                    {view === 'register' && (
                        <RegistrationForm
                            onSuccess={handleRegistrationSuccess}
                            onCancel={() => setView('login')}
                        />
                    )}
                    {view === 'resetPassword' && (
                        <PasswordResetForm
                            onCancel={() => setView('login')}
                        />
                    )}
                </div>
                 <div className="absolute bottom-0 right-0 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-nun-primary/50 pointer-events-none"></div>
            </div>
        </div>
    );
};