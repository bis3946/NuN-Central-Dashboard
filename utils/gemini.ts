import { GoogleGenAI } from "@google/genai";
import { generateCommandPrompt } from './promptEngine';

// CRITICAL SECURITY WARNING:
// This implementation initializes the Gemini API client-side with an environment variable.
// In a production web application, API keys MUST NEVER be exposed on the client.
// This approach is suitable ONLY for sandboxed environments like AI Studio where
// the execution environment securely manages the key. For all other use cases,
// this logic MUST be moved to a secure backend server.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Processes a voice command by sending it to the Gemini API.
 * This is an upgraded, live implementation.
 *
 * @param command The text of the voice command.
 * @returns The model's text response.
 */
export const processVoiceCommand = async (command: string): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return "Error: Gemini API key is not configured. This must be handled in a secure backend.";
    }

    try {
        const fullPrompt = generateCommandPrompt({ command, userRole: 'root' });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                systemInstruction: `You are "Ana", the primary AI entity for the NuN Central Dashboard. Your purpose is to assist the Root Authority. Respond concisely and professionally. Acknowledge commands and confirm actions. If a command is unclear, ask for clarification. Never break character.`,
            },
        });
        
        const text = response.text;
        return text;

    } catch (error) {
        console.error("Error processing voice command with Gemini API:", error);
        
        if (error instanceof Error) {
            // Provide a more user-friendly error message
            if (error.message.includes('API key not valid')) {
                 return "Error: The provided Gemini API key is not valid. Please check your configuration.";
            }
            return `Error communicating with AI: ${error.message}`;
        }
        return "An unknown error occurred while processing your command.";
    }
};
