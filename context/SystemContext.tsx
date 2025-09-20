
import React, { createContext, useContext, useReducer, Dispatch, useCallback, useEffect } from 'react';
import {
    SystemState,
    WebSocketMessage,
} from '../types';
import { initialSystemState } from './initialState';
import { systemReducer, Action } from './systemReducer';
import { useWebSocket } from '../hooks/useWebSocket';

// Define the storage key using the user's hash, as requested
const NUN_VAULT_KEY = 'nun_vault_62e128173d12d6a710f6063e9e30a7d0c3e1e6b8f395f17d23f33e387c12560e';

const isObject = (item: any): item is Record<string, any> => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

// A deep merge function to safely combine loaded state with initial state.
// This prevents the app from crashing if the state structure changes in a future update.
const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
    const output = { ...target };

    (Object.keys(source) as Array<keyof T>).forEach(key => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (isObject(targetValue) && isObject(sourceValue)) {
            // @ts-ignore
            output[key] = deepMerge(targetValue, sourceValue);
        } else if (sourceValue !== undefined) {
             // @ts-ignore
            output[key] = sourceValue;
        }
    });

    return output;
};


const SystemContext = createContext<{
    systemState: SystemState;
    dispatch: Dispatch<Action>;
} | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Lazy initialization for the reducer to load from localStorage on startup
    const initializer = (initial: SystemState): SystemState => {
        try {
            const storedState = localStorage.getItem(NUN_VAULT_KEY);
            if (storedState) {
                const parsedState = JSON.parse(storedState) as Partial<SystemState>;
                // Merge with initial state to prevent issues with new properties
                return deepMerge(initial, parsedState);
            }
        } catch (error) {
            console.error("Failed to load or parse state from NuN Vault (localStorage):", error);
            // If there's an error, clear the corrupted storage to prevent a loop of errors
            localStorage.removeItem(NUN_VAULT_KEY);
        }
        return initial;
    };

    const [systemState, dispatch] = useReducer(systemReducer, initialSystemState, initializer);

    // Effect to save state to localStorage whenever it changes
    useEffect(() => {
        try {
            // We don't want to persist some transient UI states
            const stateToSave = {
                ...systemState,
                isAuthenticating: false, // Don't save authenticating state
                voiceAuthStatus: 'prompting', // Always reset voice auth modal
            };
            const serializedState = JSON.stringify(stateToSave);
            localStorage.setItem(NUN_VAULT_KEY, serializedState);
        } catch (error) {
            console.error("Failed to save state to NuN Vault (localStorage):", error);
        }
    }, [systemState]);


    // This callback will be memoized and passed to the WebSocket hook.
    const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
        // Dispatch an action based on the received message type.
        dispatch({ type: 'WEBSOCKET_MESSAGE_RECEIVED', payload: message });
    }, [dispatch]);

    // Use the new WebSocket hook to receive real-time updates.
    // It is now passed the entire system state to allow for more intelligent,
    // state-aware simulations of asynchronous backend processes.
    useWebSocket(handleWebSocketMessage, systemState);


    return (
        <SystemContext.Provider value={{ systemState, dispatch }}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (context === undefined) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
};
