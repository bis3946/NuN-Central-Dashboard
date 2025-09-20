/**
 * A simple prompt engine for generating structured prompts for the Gemini API.
 * This file is provided to create a valid module and demonstrate a potential implementation.
 */

interface CommandPromptArgs {
  command: string;
  context?: string;
  userRole?: 'root' | 'guest';
}

export const generateCommandPrompt = ({ command, context, userRole = 'guest' }: CommandPromptArgs): string => {
  const baseInstruction = `You are the AI assistant for the NuN Central Dashboard. Your responses should be concise, professional, and action-oriented.`;
  
  let prompt = `${baseInstruction}\n\n`;
  prompt += `The user, with role "${userRole}", has issued the following voice command: "${command}".\n\n`;

  if (context) {
    prompt += `Additional Context: ${context}\n\n`;
  }

  prompt += `Execute the command or provide a relevant response. If the command is ambiguous or requires clarification, ask for more details.`;

  return prompt;
};

// Example of another prompt type
interface LogAnalysisPromptArgs {
    logs: string[];
}

export const generateLogAnalysisPrompt = ({ logs }: LogAnalysisPromptArgs): string => {
    const baseInstruction = `You are an expert system administrator AI. Analyze the following log entries from the NuN Central Dashboard and provide a brief, actionable summary.`;

    let prompt = `${baseInstruction}\n\nLOGS:\n`;
    prompt += logs.join('\n');
    prompt += `\n\nSUMMARY:`;

    return prompt;
};
