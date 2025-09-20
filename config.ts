// config.ts
// Central configuration for the NuN Central Dashboard application.

/**
 * The base URL for the backend API.
 * In a real-world scenario, this would be populated by an environment variable.
 * e.g., process.env.REACT_APP_API_URL
 */
export const API_BASE_URL = '/api/v1';

/**
 * The URL for the real-time WebSocket server.
 * In a real-world scenario, this would be populated by an environment variable.
 * e.g., process.env.REACT_APP_WEBSOCKET_URL
 */
export const WEBSOCKET_URL = 'wss://realtime.nun.net';

/**
 * The interval for WebSocket-simulated data pushes in milliseconds.
 */
export const REALTIME_UPDATE_INTERVAL = 2500;
