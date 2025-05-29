
'use server';
/**
 * @fileOverview An AI agent to summarize reports.
 *
 * - generateReportSummary - A function that handles the report summarization process.
 * - GenerateReportSummaryInput - The input type for the generateReportSummary function.
 * - GenerateReportSummaryOutput - The return type for the generateReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportSummaryInputSchema = z.object({
  reportText: z.string().describe('The text content of the report to summarize.'),
});
export type GenerateReportSummaryInput = z.infer<typeof GenerateReportSummaryInputSchema>;

const GenerateReportSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the report, highlighting key insights and trends.'),
});
export type GenerateReportSummaryOutput = z.infer<typeof GenerateReportSummaryOutputSchema>;

export async function generateReportSummary(input: GenerateReportSummaryInput): Promise<GenerateReportSummaryOutput> {
  // Bypassing actual AI call for Spark plan compatibility
  console.warn("AI Report Summary Generation is disabled as the application is configured for a Spark plan compatible deployment.");
  return {
    summary: "AI summary generation is not available on the current plan. This is a placeholder summary.",
  };
}

// The prompt and flow definition below are no longer actively called by the exported function.
// They are kept for reference or potential future re-enablement.

const prompt = ai.definePrompt({
  name: 'generateReportSummaryPrompt',
  input: {schema: GenerateReportSummaryInputSchema},
  output: {schema: GenerateReportSummaryOutputSchema},
  prompt: `You are an expert in summarizing reports, extracting key insights and trends.

  Please provide a concise summary of the following report, highlighting the most important information and trends:

  Report Text: {{{reportText}}}`,
});

const generateReportSummaryFlow = ai.defineFlow(
  {
    name: 'generateReportSummaryFlow',
    inputSchema: GenerateReportSummaryInputSchema,
    outputSchema: GenerateReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
