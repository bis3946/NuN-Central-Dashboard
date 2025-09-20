import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { UserIcon } from './icons/UserIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { IdentificationIcon } from './icons/IdentificationIcon';

interface RegistrationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, onCancel }) => {
  const { dispatch } = useSystem();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nationalId: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      dispatch({
        type: 'ADD_USER',
        payload: { email: formData.email },
      });
      dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { type: 'success', message: `User ${formData.email} registered successfully.`}
      })
      setIsSubmitting(false);
      onSuccess();
    }, 1200);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none" />
      </div>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockClosedIcon /></span>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none" />
      </div>
       <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockClosedIcon /></span>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none" />
      </div>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><PhoneIcon /></span>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number (Optional)" className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none" />
      </div>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><IdentificationIcon /></span>
        <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} placeholder="National ID (Optional, for KYC)" className="w-full bg-nun-darker border border-nun-light/50 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-nun-primary focus:outline-none" />
      </div>

      {error && <p className="text-sm text-nun-error text-center">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button type="button" onClick={onCancel} className="w-full px-4 py-2 text-sm font-bold bg-gray-600/80 text-gray-200 rounded-md hover:bg-gray-600">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded-md hover:bg-nun-primary disabled:bg-gray-600 disabled:cursor-wait">
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
};
