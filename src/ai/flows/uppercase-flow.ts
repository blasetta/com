'use server';
/**
 * @fileOverview A flow that converts text to uppercase.
 *
 * - uppercaseText - A function that handles the text conversion.
 * - UppercaseInput - The input type for the uppercaseText function.
 * - UppercaseOutput - The return type for the uppercaseText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UppercaseInputSchema = z.object({
  text: z.string().describe('The text to convert to uppercase.'),
});
export type UppercaseInput = z.infer<typeof UppercaseInputSchema>;

export type UppercaseOutput = string;

export async function uppercaseText(input: UppercaseInput): Promise<UppercaseOutput> {
  return uppercaseFlow(input);
}

const uppercaseFlow = ai.defineFlow(
  {
    name: 'uppercaseFlow',
    inputSchema: UppercaseInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // Simply convert the input text to uppercase.
    return input.text.toUpperCase();
  }
);
