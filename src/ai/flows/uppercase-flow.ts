'use server';
/**
 * @fileOverview A flow that converts text to uppercase by calling an external function.
 *
 * - uppercaseText - A function that handles the text conversion.
 * - UppercaseInput - The input type for the uppercaseText function.
 * - UppercaseOutput - The return type for the uppercaseText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {GoogleAuth} from 'google-auth-library';

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
    // IMPORTANT: Replace this with the real URL of your Cloud Function.
    //const externalFunctionUrl = 'https://<your-region>-<your-project-id>.cloudfunctions.net/yourHttpsFunction';
    const externalFunctionUrl ='https://test-991612141138.us-central1.run.app'

    // This is a placeholder. If you enter a real URL, the code will run.
    if (externalFunctionUrl.includes('<your-region>')) {
      console.log('Using mock response for uppercaseFlow. Please replace the placeholder URL.');
      return `(MOCK) ${input.text.toUpperCase()}`;
    }

    try {
      // Create a Google Auth client which will use the server's service account
      const auth = new GoogleAuth();
      
      // Get an authenticated client that will automatically add the
      // OIDC token to the request headers. The URL is used as the 'audience'.
      const client = await auth.getIdTokenClient(externalFunctionUrl);

      // Make the authenticated request.
      const response = await client.request({
        url: externalFunctionUrl,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: {name: input.text},
      });

      // Assuming the function returns something like { uppercasedText: '...' }
      const result = response.data as { uppercasedText: string };
      return result.uppercasedText;

    } catch (error: any) {
      console.error('Error calling external function:', error.message || error)
      //message = f"Failed to process text via external service. {error.message} years old."
      throw new Error('Error calling external function:'+error.message || error);
    }
  }
);
