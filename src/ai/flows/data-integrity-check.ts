
'use server';

/**
 * @fileOverview An AI agent to check the integrity of data entries.
 *
 * - dataIntegrityCheck - A function that checks the integrity of data entries.
 * - DataIntegrityCheckInput - The input type for the dataIntegrityCheck function.
 * - DataIntegrityCheckOutput - The return type for the dataIntegrityCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataIntegrityCheckInputSchema = z.object({
  newDataEntry: z
    .string()
    .describe('The new data entry to check for integrity.'),
  pastEntries: z
    .array(z.string())
    .describe('Past similar data entries to compare against.'),
});
export type DataIntegrityCheckInput = z.infer<typeof DataIntegrityCheckInputSchema>;

const DataIntegrityCheckOutputSchema = z.object({
  isConsistent: z
    .boolean()
    .describe('Whether the new data entry is consistent with past entries.'),
  potentialError: z
    .string()
    .describe('Description of the potential error, if any.'),
});
export type DataIntegrityCheckOutput = z.infer<typeof DataIntegrityCheckOutputSchema>;

export async function dataIntegrityCheck(
  input: DataIntegrityCheckInput
): Promise<DataIntegrityCheckOutput> {
  // Bypassing actual AI call for Spark plan compatibility
  console.warn("AI Data Integrity Check is disabled as the application is configured for a Spark plan compatible deployment.");
  return {
    isConsistent: true,
    potentialError: "AI check bypassed for Spark plan compatibility. Data assumed consistent.",
  };
}

// The prompt and flow definition below are no longer actively called by the exported function.
// They are kept for reference or potential future re-enablement.

const prompt = ai.definePrompt({
  name: 'dataIntegrityCheckPrompt',
  input: {schema: DataIntegrityCheckInputSchema},
  output: {schema: DataIntegrityCheckOutputSchema},
  prompt: `You are an expert data integrity checker.

You will receive a new data entry and a list of past similar data entries.
Your task is to determine if the new data entry is consistent with the past entries.
If not, provide a description of the potential error.

New Data Entry: {{{newDataEntry}}}

Past Entries:
{{#each pastEntries}}
- {{{this}}}
{{/each}}

Output should be in JSON format.
`,
});

const dataIntegrityCheckFlow = ai.defineFlow(
  {
    name: 'dataIntegrityCheckFlow',
    inputSchema: DataIntegrityCheckInputSchema,
    outputSchema: DataIntegrityCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
