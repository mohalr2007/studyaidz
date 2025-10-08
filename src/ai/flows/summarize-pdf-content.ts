'use server';
/**
 * @fileOverview A PDF summarization AI agent.
 *
 * - summarizePdfContent - A function that handles the PDF summarization process.
 * - SummarizePdfContentInput - The input type for the summarizePdfContent function.
 * - SummarizePdfContentOutput - The return type for the summarizePdfContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePdfContentInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizePdfContentInput = z.infer<typeof SummarizePdfContentInputSchema>;

const SummarizePdfContentOutputSchema = z.object({
  summary: z.string().describe('A summary of the PDF content.'),
});
export type SummarizePdfContentOutput = z.infer<typeof SummarizePdfContentOutputSchema>;

export async function summarizePdfContent(input: SummarizePdfContentInput): Promise<SummarizePdfContentOutput> {
  return summarizePdfContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePdfContentPrompt',
  input: {schema: SummarizePdfContentInputSchema},
  output: {schema: SummarizePdfContentOutputSchema},
  prompt: `You are an expert summarizer, able to condense PDF documents into their most important points.

  Summarize the following PDF document:

  {{media url=pdfDataUri}}`,
});

const summarizePdfContentFlow = ai.defineFlow(
  {
    name: 'summarizePdfContentFlow',
    inputSchema: SummarizePdfContentInputSchema,
    outputSchema: SummarizePdfContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
