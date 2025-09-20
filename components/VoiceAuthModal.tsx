
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { useSystem } from '../context/SystemContext';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { BrainIcon } from './icons/BrainIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface VoiceAuthModalProps {
  onClose: () => void;
}

// Helper to hash ArrayBuffer -> hex string
const bufferToHex = (buffer: ArrayBuffer) => {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

export const VoiceAuthModal: React.FC<VoiceAuthModalProps> = ({ onClose }) => {
    const { systemState, dispatch } = useSystem();
    const { voiceTemplate, voiceAuthStatus } = systemState;
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const visualizerRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number>(0);

    const needsEnrollment = !voiceTemplate;

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            if(audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);
    
    useEffect(() => {
      if(voiceAuthStatus === 'matched'){
        dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'brainwave-sync' });
        setTimeout(() => {
            dispatch({ type: 'ADD_LOG', payload: { level: 'TRACE', message: `BrainWave verification successful for bis3946.` } });
            dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: `MultifactorApprove: Action CONFIRMED.` } });
            dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'confirmed' });
        }, 2000);
      }
    }, [voiceAuthStatus, dispatch]);

    const setupAudioVisualizer = (stream: MediaStream) => {
        if (!visualizerRef.current) return;
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyserRef.current = analyser;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = visualizerRef.current;
        const canvasCtx = canvas.getContext('2d');

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            if (!canvasCtx) return;
            canvasCtx.fillStyle = '#0a0a1a';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                canvasCtx.fillStyle = `rgba(0, 255, 255, ${barHeight / 100})`;
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        draw();
    };

    const processAudio = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashHex = bufferToHex(hashBuffer);
        
        if (needsEnrollment) {
            dispatch({ type: 'ENROLL_VOICE', payload: hashHex });
            dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'enrolling' });
            setTimeout(() => dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'prompting' }), 2000);
        } else {
            if (hashHex === voiceTemplate) {
                 dispatch({ type: 'ADD_LOG', payload: { level: 'INFO', message: `Voiceprint matched successfully.` } });
                dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'matched' });
            } else {
                dispatch({ type: 'ADD_LOG', payload: { level: 'WARN', message: `Voiceprint mismatch. Verification failed.` } });
                dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'mismatch' });
            }
        }
    };

    const handleRecord = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setupAudioVisualizer(stream);
            dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'recording' });
            
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                audioContextRef.current?.close();
                cancelAnimationFrame(animationFrameRef.current);
                dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'verifying' });
                processAudio();
            };

            mediaRecorderRef.current.start();
            setTimeout(() => {
                if (mediaRecorderRef.current?.state === 'recording') {
                    mediaRecorderRef.current.stop();
                }
            }, 3000); // Record for 3 seconds
        } catch (err) {
            console.error('Error accessing microphone:', err);
            dispatch({ type: 'ADD_LOG', payload: { level: 'ERROR', message: `Microphone access denied or failed.` } });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'error', message: 'Could not access microphone. Please check browser permissions.' } });
            dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'error' });
        }
    };

    const getStatusContent = () => {
        switch (voiceAuthStatus) {
            case 'prompting':
                return (
                    <div className="text-center space-y-4">
                        <p>{needsEnrollment ? "Enroll your voiceprint for multi-factor authentication." : "A critical action requires voiceprint verification."}</p>
                        <button onClick={handleRecord} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-nun-primary/80 text-nun-darker rounded hover:bg-nun-primary transition">
                            <MicrophoneIcon className="w-5 h-5" />
                            {needsEnrollment ? 'Start Enrollment (3s)' : 'Start Verification (3s)'}
                        </button>
                    </div>
                );
            case 'recording':
                return (
                    <div className="text-center space-y-3">
                        <p className="font-bold text-nun-primary animate-pulse">Recording...</p>
                        <p className="text-xs text-gray-400">Please speak clearly.</p>
                        <canvas ref={visualizerRef} width="300" height="80" className="bg-nun-darker rounded-md mx-auto"></canvas>
                    </div>
                );
            case 'verifying':
                return <div className="text-center font-bold text-nun-primary animate-pulse">Verifying...</div>;
            case 'enrolling':
                 return <div className="text-center font-bold text-nun-success">Voiceprint Enrolled Successfully!</div>;
            case 'mismatch':
                return (
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 font-bold text-nun-error"><XMarkIcon /> Voice Mismatch</div>
                        <button onClick={() => dispatch({ type: 'SET_VOICE_AUTH_STATUS', payload: 'prompting' })} className="w-full px-3 py-2 text-sm font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition">Try Again</button>
                    </div>
                );
            case 'matched':
                return <div className="flex items-center justify-center gap-2 font-bold text-nun-success"><CheckIcon /> Voice Matched</div>;
            case 'brainwave-sync':
                 return (
                    <div className="text-center space-y-3">
                         <div className="flex items-center justify-center gap-2 font-bold text-nun-primary animate-pulse"><BrainIcon className="w-5 h-5" /> Syncing BrainWave Pattern...</div>
                    </div>
                 );
            case 'confirmed':
                 return (
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 font-bold text-nun-success text-lg"><ShieldCheckIcon /> CONFIRMED ✅</div>
                         <button onClick={onClose} className="w-full px-3 py-2 text-sm font-bold bg-nun-light text-gray-200 rounded hover:bg-nun-light/70 transition">Close</button>
                    </div>
                 );
            case 'error':
                 return <div className="text-center font-bold text-nun-error">Error: Could not access microphone.</div>;
            default:
                return null;
        }
    };

    return (
        <Modal title="Voice & BrainWave Authentication" onClose={onClose}>
            <div className="min-h-[150px] flex items-center justify-center">
                {getStatusContent()}
            </div>
        </Modal>
    );
};