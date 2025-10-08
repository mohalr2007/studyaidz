'use server';

/**
 * @fileOverview Generates a quiz with multiple-choice questions for a given subject using AI.
 *
 * - generateQuizFromSubject - A function that generates a quiz for a given subject.
 * - GenerateQuizInput - The input type for the generateQuizFromSubject function.
 * - GenerateQuizOutput - The return type for the generateQuizFromSubject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate the quiz.'),
  numberOfQuestions: z.number().default(5).describe('The number of questions to generate for the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The question text.'),
      options: z.array(z.string()).describe('The multiple-choice options for the question.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuizFromSubject(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFromSubjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromSubjectPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz with multiple-choice questions for the subject: {{{subject}}}.\n\nThe quiz should have {{{numberOfQuestions}}} questions.\nEach question should have 4 options, and one of them should be the correct answer.\nReturn the quiz in the following JSON format:\n{
  "quiz": [
    {
      "question": "Question 1",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A"
    },
    {
      "question": "Question 2",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B"
    }
  ]
}`, 
});

const generateQuizFromSubjectFlow = ai.defineFlow(
  {
    name: 'generateQuizFromSubjectFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
