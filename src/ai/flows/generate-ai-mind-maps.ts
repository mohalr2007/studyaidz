'use server';

/**
 * @fileOverview Generates a mind map from a given text input using AI.
 *
 * - generateMindMap - A function that generates a mind map based on the input text.
 * - GenerateMindMapInput - The input type for the generateMindMap function.
 * - GenerateMindMapOutput - The return type for the generateMindMap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMindMapInputSchema = z.object({
  text: z.string().describe('The text or topic to generate a mind map from.'),
});
export type GenerateMindMapInput = z.infer<typeof GenerateMindMapInputSchema>;

const GenerateMindMapOutputSchema = z.object({
  mindMapData: z
    .string()
    .describe(
      'A JSON string representing the mind map data, suitable for rendering with D3.js or Mermaid.js.'
    ),
});
export type GenerateMindMapOutput = z.infer<typeof GenerateMindMapOutputSchema>;

export async function generateMindMap(input: GenerateMindMapInput): Promise<GenerateMindMapOutput> {
  return generateMindMapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMindMapPrompt',
  input: {schema: GenerateMindMapInputSchema},
  output: {schema: GenerateMindMapOutputSchema},
  prompt: `You are an AI expert in creating mind maps.  Your task is to convert the given text or topic into a JSON format suitable for rendering a mind map using D3.js or Mermaid.js.

  Input Text: {{{text}}}

  Ensure that the generated JSON is valid and represents the relationships between concepts and ideas in a clear and organized manner. The JSON should be structured to facilitate easy rendering into a visual mind map.
  The JSON needs to include all related concepts and ideas to the main topic from the provided Input Text.
  Output the mind map data as a JSON string. Adhere to the structure that the root node is called "root" and its immediate children "children".
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateMindMapFlow = ai.defineFlow(
  {
    name: 'generateMindMapFlow',
    inputSchema: GenerateMindMapInputSchema,
    outputSchema: GenerateMindMapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
