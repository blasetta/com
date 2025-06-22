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

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {
    schema: ChatInputSchema,
  },
  output: {schema: z.string()},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
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

User's message: {{{message}}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const {output} = await prompt(input);
    return output || '';
  }
);

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const response = await chatFlow(input);
  return response || 'Sorry, I could not process your request.';
}
