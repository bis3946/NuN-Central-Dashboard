// utils/api.ts
import { API_BASE_URL } from '../config';
import { User, UserRole, TaskPriority } from '../types';

// Simulate network latency
const simulateLatency = (delay = 800) => new Promise(res => setTimeout(res, delay));
// Simulate potential for failure
const shouldFail = (failureRate = 0.1) => Math.random() < failureRate;

/**
 * Simulates a login API call.
 */
export const apiLogin = async (username: string, password: string): Promise<{ user: Partial<User> }> => {
    console.log(`[API] Attempting login for ${username}...`);
    await simulateLatency();
    if (shouldFail(0.1)) {
        throw new Error("Network error. Please try again.");
    }
    if (username === 'bis3946' && password === '3985394699') {
        // In a real app, the user object would come from the server response.
        // We'll just return the role and the app can find the user in the initial state.
        console.log(`[API] Login successful for ${username}.`);
        return { user: { role: UserRole.SuperAdmin } }; // Only return what's necessary
    } else {
        throw new Error("Invalid credentials.");
    }
};

/**
 * Simulates updating a user's role.
 */
export const apiUpdateUserRole = async (userId: string, newRole: UserRole): Promise<{ success: boolean }> => {
    console.log(`[API] Updating role for user ${userId} to ${newRole}...`);
    await simulateLatency(500);
    if (shouldFail(0.05)) {
        throw new Error("Failed to update user role. Permissions denied.");
    }
    console.log(`[API] Role updated for user ${userId}.`);
    return { success: true };
};

/**
 * Simulates sending a transaction.
 */
export const apiSendTransaction = async (recipient: string, amount: number): Promise<{ transactionHash: string }> => {
     console.log(`[API] Sending ${amount} NUN to ${recipient}...`);
     await simulateLatency(1500);
     if (shouldFail(0.15)) {
         throw new Error("Transaction failed. Insufficient gas or network congestion.");
     }
     const transactionHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
     console.log(`[API] Transaction successful. Hash: ${transactionHash}`);
     return { transactionHash };
};


export const apiAddTask = async (title: string, priority: TaskPriority): Promise<{ success: boolean, id: string }> => {
    console.log(`[API] Adding task: ${title}`);
    await simulateLatency(400);
     if (shouldFail(0.05)) {
        throw new Error("Failed to create task.");
    }
    return { success: true, id: `task-${Date.now()}` };
}

export const apiResyncAllModules = async (): Promise<{ success: true }> => {
    console.log(`[API] Resyncing all modules...`);
    await simulateLatency(2000);
    if (shouldFail(0.1)) {
        throw new Error("A federation node did not respond to the sync pulse.");
    }
    return { success: true };
}
