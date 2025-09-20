import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { UserIcon } from './icons/UserIcon';

interface PasswordResetFormProps {
    onCancel: () => void;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onCancel }) => {
    const { dispatch } = useSystem();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        
        setTimeout(() => {
            dispatch({ type: 'INITIATE_PASSWORD_RESET', payload: { email } });
            setIsSubmitting(false);
            setMessage('If an account with this email exists, a password reset link has been sent.');
        }, 1000);
    };
    
    if (message) {
        return (
            <div className="space-y-6 text-center">
                <p className="text-sm text-nun-success">{message}</p>
                 <button 
                    type="button" 
                    onClick={onCancel} 
                    className="w-full px-4 py-2 text-sm font-bold bg-nun-light/50 text-gray-300 rounded-md hover:bg-nun-light/80 transition"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
             <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
                <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Enter your registered email" 
                    required 
                    className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none" 
                />
            </div>
            
            <div className="flex items-center gap-4">
                <button type="button" onClick={onCancel} className="w-full px-4 py-2 text-sm font-bold bg-gray-600/80 text-gray-200 rounded-md hover:bg-gray-600">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting || !email} className="w-full px-4 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded-md hover:bg-nun-primary disabled:bg-gray-600 disabled:cursor-wait">
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
            </div>
        </form>
    );
};