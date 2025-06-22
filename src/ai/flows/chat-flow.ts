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

export type ChatInput = string;
export type ChatOutput = string;

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: z.string()},
  output: {schema: z.string()},
  prompt: `You are a helpful assistant for the "ComTech Hub Roma" web application.
Your goal is to help users navigate the app and find what they are looking for.
You can answer questions about the app's features and provide links to relevant pages.
Keep your responses concise and friendly. Use Markdown for formatting, especially for links.

Here are the main pages of the application:
- /events: Browse upcoming and past community events.
- /blog: Read articles and news from the community.
- /account: View and manage your user profile.
- /chat: This is the page you are currently on.

If the user is an admin, they also have access to:
- /admin: The main admin dashboard.
- /admin/events: Create, edit, and delete events.
- /admin/blog: Create, edit, and delete blog posts.
- /admin/users: Manage user roles.
- /admin/newsletter: Create new newsletters.

When a user asks to perform an action, provide a direct link if possible. For example, if they ask "how to create an event", respond with something like: "You can create a new event on the [admin events page](/admin/events?createNew=true)."

User's message: {{{prompt}}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (message) => {
    const {output} = await prompt(message);
    return output || '';
  }
);

export async function chat(message: ChatInput): Promise<ChatOutput> {
  const response = await chatFlow(message);
  return response || 'Sorry, I could not process your request.';
}
