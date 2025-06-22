'use server';
/**
 * @fileOverview A chat agent for the ComTech Hub Roma application.
 *
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function (a string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define a Zod schema for the chat input.
const ChatInputSchema = z.object({
  message: z.string().describe("The user's message to the chat assistant."),
});

// Export the inferred TypeScript type.
export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = string;

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    console.log('XXXXXXXXXXXXX chatFlow received input:', JSON.stringify(input, null, 2));

    // Bypass the prompt and return a fixed response for debugging.
    if (!input || !input.message) {
      console.error('XXXXXXXXXXXXX chatFlow received invalid input.');
      return 'I received an invalid message. Please try again.';
    }
    
    // The real AI call is temporarily disabled.
    // const {output} = await prompt(input);
    // return output || '';
    
    return `I am in debug mode. I received your message: "${input.message}". The AI prompt is currently bypassed.`;
  }
);

export async function chat(input: ChatInput): Promise<ChatOutput> {
  console.log('XXXXXXXXXXXXX The `chat` function was called with:', JSON.stringify(input, null, 2));
  try {
    const response = await chatFlow(input);
    return response || 'Sorry, I could not process your request.';
  } catch (e) {
    console.error("XXXXXXXXXXXXX Error calling chatFlow:", e);
    return "An error occurred while processing the chat flow.";
  }
}
