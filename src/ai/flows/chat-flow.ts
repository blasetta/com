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

// Define the prompt for the chat assistant.
const chatPrompt = ai.definePrompt({
    name: 'chatPrompt',
    input: { schema: ChatInputSchema },
    output: { schema: z.string() },
    prompt: `You are a friendly and helpful assistant for ComTech Hub Roma, a technology community hub in Rome.
Your goal is to answer user questions about events, blog posts, and the community.
Be concise and helpful.

User's message: {{{message}}}
`,
});

// Define the main flow that orchestrates the chat logic.
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const {output} = await chatPrompt(input);
    return output || 'I am not sure how to respond to that. Please try rephrasing.';
  }
);

/**
 * The public-facing function that UI components will call.
 * It invokes the Genkit flow and handles basic error cases.
 * @param input The user's message, conforming to the ChatInput schema.
 * @returns A string containing the assistant's response.
 */
export async function chat(input: ChatInput): Promise<ChatOutput> {
  try {
    const response = await chatFlow(input);
    return response || 'Sorry, I could not process your request.';
  } catch (e: any) {
    console.error("Error calling chatFlow:", e);
    // Provide a more user-friendly error message.
    return "An error occurred while communicating with the AI. Please try again later.";
  }
}
