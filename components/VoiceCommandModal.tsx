
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { useSystem } from '../context/SystemContext';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { processVoiceCommand } from '../utils/gemini';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

export const VoiceCommandModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { dispatch } = useSystem();
    const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'error' | 'success'>('idle');
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    // Fix: Use `any` for SpeechRecognition ref to support various browser implementations.
    const recognitionRef = useRef<any | null>(null);

    useEffect(() => {
        // Fix: Cast window to `any` to access browser-specific SpeechRecognition APIs.
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatus('error');
            setResponse('Speech recognition is not supported by your browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
            handleCommand(currentTranscript);
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onnomatch = () => {
             setResponse("I didn't recognize that command. Please try again.");
             setStatus('idle');
        };

        recognition.onerror = (event: any) => {
            setResponse(`Error occurred in recognition: ${event.error}`);
            setStatus('error');
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        }

    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            setTranscript('');
            setResponse('');
            setStatus('listening');
            recognitionRef.current.start();
        }
    };
    
    const handleCommand = async (command: string) => {
        setStatus('processing');
        dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: `Voice command received: "${command}"` } });
        const backendResponse = await processVoiceCommand(command);
        setResponse(backendResponse);
        setStatus('success');
    };

    const renderContent = () => {
        switch (status) {
            case 'idle':
                return (
                    <div className="text-center space-y-4">
                        <p>Press the button and speak your command.</p>
                        <button onClick={startListening} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded hover:bg-nun-primary transition">
                            <MicrophoneIcon className="w-5 h-5" />
                            Start Listening
                        </button>
                    </div>
                );
            case 'listening':
                return (
                     <div className="text-center space-y-3">
                        <p className="font-bold text-nun-primary animate-pulse">Listening...</p>
                         <MicrophoneIcon className="w-12 h-12 mx-auto text-nun-primary" />
                    </div>
                );
            case 'processing':
                return (
                    <div className="text-center space-y-3">
                        <p className="font-bold text-nun-secondary animate-pulse">Processing Command...</p>
                        <p className="text-sm text-gray-400 italic">"{transcript}"</p>
                        <ArrowPathIcon className="w-8 h-8 mx-auto text-nun-secondary animate-spin" />
                    </div>
                );
            case 'success':
                 return (
                    <div className="space-y-3 text-center">
                         <p className="text-sm text-gray-400">Command: <span className="italic">"{transcript}"</span></p>
                         <div className="p-3 bg-nun-darker/50 rounded-md">
                            <p className="font-bold text-nun-success mb-1">Response:</p>
                            <p className="text-gray-200">{response}</p>
                         </div>
                         <button onClick={startListening} className="w-full px-3 py-2 text-sm font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition">Ask Again</button>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center space-y-4">
                        <p className="font-bold text-nun-error">An Error Occurred</p>
                        <p className="text-sm text-gray-400">{response}</p>
                        <button onClick={startListening} className="w-full px-3 py-2 text-sm font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition">Try Again</button>
                    </div>
                 );
        }
    }

    return (
        <Modal title="Voice Command Interface" onClose={onClose}>
            <div className="min-h-[150px] flex items-center justify-center">
                {renderContent()}
            </div>
        </Modal>
    );
};