import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { AIModule } from '../types';
import { Modal } from './Modal';

interface ThresholdEditModalProps {
  module: AIModule;
  onClose: () => void;
}

export const ThresholdEditModal: React.FC<ThresholdEditModalProps> = ({ module, onClose }) => {
    const { dispatch } = useSystem();
    const [newThreshold, setNewThreshold] = useState(module.threshold.toString());

    const handleSave = () => {
        const thresholdValue = parseFloat(newThreshold);
        if (!isNaN(thresholdValue) && thresholdValue >= 0 && thresholdValue <= 100) {
            dispatch({
                type: 'UPDATE_AI_MODULE_THRESHOLD',
                payload: { moduleId: module.id, newThreshold: thresholdValue }
            });
            onClose();
        } else {
            alert("Please enter a valid threshold value between 0 and 100.");
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewThreshold(e.target.value);
    }

    return (
        <Modal title={`Adjust Threshold for ${module.name}`} onClose={onClose}>
            <div className="space-y-4">
                <p className="text-sm text-gray-400">
                    Set the anomaly detection threshold. A higher value means the system is less sensitive to deviations.
                </p>
                
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={newThreshold}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-nun-dark rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={newThreshold}
                        onChange={handleInputChange}
                        className="w-24 bg-nun-darker border border-nun-light/50 rounded-md py-1.5 px-2 text-sm text-center font-mono focus:ring-1 focus:ring-nun-primary focus:outline-none"
                    />
                </div>
                 <div className="text-center font-mono text-2xl text-nun-primary py-2">
                    {parseFloat(newThreshold).toFixed(1)}%
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-nun-light/20">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold bg-nun-light/50 text-gray-300 rounded-md hover:bg-nun-light/80 transition">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded-md hover:bg-nun-primary transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </Modal>
    );
};