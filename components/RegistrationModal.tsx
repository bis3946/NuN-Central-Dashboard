import React from 'react';
import { Modal } from './Modal';
import { RegistrationForm } from './RegistrationForm';

interface RegistrationModalProps {
    onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose }) => {
    return (
        <Modal title="Register New Member" onClose={onClose}>
            <RegistrationForm 
                onSuccess={onClose}
                onCancel={onClose}
            />
        </Modal>
    );
};