'use server';
/**
 * @fileOverview Provides AI-driven tool recommendations based on file type and desired modifications for AJN.
 *
 * - smartToolSuggestions - A function that handles the smart tool suggestion process.
 * - SmartToolSuggestionsInput - The input type for the smartToolSuggestions function.
 * - SmartToolSuggestionsOutput - The return type for the smartToolSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartToolSuggestionsInputSchema = z.object({
  fileType: z
    .string()
    .describe(
      'The MIME type of the file (e.g., "image/jpeg", "application/pdf", "audio/mpeg").'
    ),
  modificationDescription: z
    .string()
    .optional()
    .describe(
      'An optional short phrase describing the desired modification (e.g., "make it smaller", "cut out the beginning").'
    ),
});
export type SmartToolSuggestionsInput = z.infer<
  typeof SmartToolSuggestionsInputSchema
>;

const SmartToolSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        toolName: z.string().describe('The name of the suggested tool.'),
        toolDescription: z
          .string()
          .describe('A brief description of what the tool does.'),
        isRecommended: z
          .boolean()
          .describe(
            'Whether this tool is highly recommended based on the input and description.'
          ),
      })
    )
    .describe('A list of AI-driven tool suggestions.'),
});
export type SmartToolSuggestionsOutput = z.infer<
  typeof SmartToolSuggestionsOutputSchema
>;

export async function smartToolSuggestions(
  input: SmartToolSuggestionsInput
): Promise<SmartToolSuggestionsOutput> {
  return smartToolSuggestionsFlow(input);
}

const smartToolSuggestionsPrompt = ai.definePrompt({
  name: 'smartToolSuggestionsPrompt',
  input: {schema: SmartToolSuggestionsInputSchema},
  output: {schema: SmartToolSuggestionsOutputSchema},
  prompt: `You are an intelligent assistant for AJN – All-in-one Junction Network, designed to help users find the most relevant tools for their file editing and conversion needs.

Based on the user's file type and their desired modification (if provided), suggest a list of relevant tools. For each tool, provide a name, a brief description, and indicate if it is highly recommended given the context.

File Type: {{{fileType}}}
{{#if modificationDescription}}
Desired Modification: {{{modificationDescription}}}
{{/if}}

Please provide your suggestions in a JSON array format, strictly adhering to the output schema.`,
});

const smartToolSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartToolSuggestionsFlow',
    inputSchema: SmartToolSuggestionsInputSchema,
    outputSchema: SmartToolSuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await smartToolSuggestionsPrompt(input);
    return output!;
  }
);
