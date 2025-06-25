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
      // The payload is now { text: "..." } to match what a simple function would likely expect.
      const response = await client.request({
        url: externalFunctionUrl,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: {text: input.text},
      });

      // Handle different possible response formats from the external function.
      const resultData = response.data;
      if (typeof resultData === 'string') {
        return resultData;
      }
      if (typeof resultData === 'object' && resultData !== null) {
        if ('uppercasedText' in resultData && typeof resultData.uppercasedText === 'string') {
            return resultData.uppercasedText;
        }
        if ('result' in resultData && typeof resultData.result === 'string') {
            return resultData.result;
        }
        if ('text' in resultData && typeof resultData.text === 'string') {
            return resultData.text;
        }
      }

      // If the format is unknown, throw an error.
      throw new Error('Received an unexpected response format from the external function.');

    } catch (error: any) {
      console.error('Error calling external function:', error.response?.data || error.message || error);
      const message = error.response?.data?.error || error.message || 'An unknown error occurred';
      throw new Error(`Failed to process text via external service. ${message}`);
    }
  }
);
