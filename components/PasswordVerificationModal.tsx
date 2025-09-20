
import React, { useState } from 'react';
import { Modal } from './Modal';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { useSystem } from '../context/SystemContext';

interface PasswordVerificationModalProps {
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  description: string;
}

const CORRECT_PASSWORD = '3985394699';

export const PasswordVerificationModal: React.FC<PasswordVerificationModalProps> = ({ onClose, onSuccess, title, description }) => {
    const { dispatch } = useSystem();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsVerifying(true);

        // Simulate async verification
        setTimeout(() => {
            if (password === CORRECT_PASSWORD) {
                dispatch({ type: 'ADD_LOG', payload: { level: 'TRACE', message: `Root password verification successful for action: ${title}` } });
                onSuccess();
                onClose();
            } else {
                setError('Incorrect password. Verification failed.');
                dispatch({ type: 'ADD_LOG', payload: { level: 'WARN', message: `Failed password verification for action: ${title}` } });
            }
            setIsVerifying(false);
        }, 500);
    };

    return (
        <Modal title={title} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-400">{description}</p>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockClosedIcon />
                    </span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Root Password"
                        className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none transition"
                        required
                        autoFocus
                    />
                </div>
                {error && <p className="text-sm text-center text-nun-error">{error}</p>}
                <div className="flex justify-end gap-2 pt-2">
                     <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold bg-nun-light/50 text-gray-300 rounded-md hover:bg-nun-light/80 transition">
                        Cancel
                    </button>
                    <button type="submit" disabled={isVerifying || !password} className="px-4 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded-md hover:bg-nun-primary transition disabled:bg-gray-600 disabled:cursor-wait">
                        {isVerifying ? 'Verifying...' : 'Confirm & Proceed'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
