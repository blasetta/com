'use server';
/**
 * @fileOverview A chat agent for the ComTech Hub Roma application.
 *
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function (a string).
 * - ChatOutput - The return type for the chat function (a string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// The input is a simple string.
export type ChatInput = string;
export type ChatOutput = string;

// Define the main flow that orchestrates the chat logic.
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (message) => {
    // We call the model directly, providing the full prompt.
    const {output} = await ai.generate({
        prompt: `You are a friendly and helpful assistant for ComTech Hub Roma, a technology community hub in Rome.
Your goal is to answer user questions about events, blog posts, and the community.
Be concise and helpful.

User's message: ${message}
`,
    });
    return output || 'I am not sure how to respond to that. Please try rephrasing.';
  }
);

/**
 * The public-facing function that UI components will call.
 * It invokes the Genkit flow and handles basic error cases.
 * @param message The user's message as a string.
 * @returns A string containing the assistant's response.
 */
export async function chat(message: ChatInput): Promise<ChatOutput> {
  try {
    const response = await chatFlow(message);
    return response || 'Sorry, I could not process your request.';
  } catch (e: any) {
    console.error("Error calling chatFlow:", e);
    // Provide a more user-friendly error message.
    return "An error occurred while communicating with the AI. Please try again later.";
  }
}
