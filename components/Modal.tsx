import React from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md p-6 space-y-4 bg-nun-dark border border-nun-light/30 rounded-lg shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-nun-secondary/5 rounded-full blur-3xl"></div>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-nun-primary tracking-wider">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-nun-error transition">
            <XMarkIcon />
          </button>
        </div>
        
        <div className="relative z-10">
            {children}
        </div>
      </div>
    </div>
  );
};