'use server';
/**
 * @fileOverview Comprehensive file intelligence flows for AJN.
 *
 * - fileIntelligence - Handles summarization, categorization, and analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligenceInputSchema = z.object({
  toolId: z.enum(['summarizer', 'translator', 'ocr', 'categorize', 'contract', 'resume', 'enhancer', 'semantic']),
  content: z.string().describe('The text content or a description of the file to analyze.'),
  config: z.record(z.any()).optional(),
});

const IntelligenceOutputSchema = z.object({
  resultText: z.string().describe('The primary text result of the AI operation.'),
  confidence: z.number().optional().describe('Confidence score from 0-1.'),
  metadata: z.record(z.any()).optional().describe('Additional structured data extracted.'),
});

export async function runFileIntelligence(input: z.infer<typeof IntelligenceInputSchema>) {
  return fileIntelligenceFlow(input);
}

const fileIntelligencePrompt = ai.definePrompt({
  name: 'fileIntelligencePrompt',
  input: {schema: IntelligenceInputSchema},
  output: {schema: IntelligenceOutputSchema},
  prompt: `You are an expert AI intelligence agent for AJN (All-in-one Junction Network).
  You are performing the task: {{toolId}}.
  
  CONTEXT:
  {{{content}}}
  
  CONFIGURATION:
  {{#if config}}
  {{{json config}}}
  {{/if}}
  
  TASK INSTRUCTIONS:
  - summarizer: Provide a structured bulleted summary. Length: {{config.length}}.
  - translator: Translate the content to {{config.targetLanguage}}.
  - categorize: Determine the category (Invoice, Contract, Resume, etc.).
  - contract: Identify parties, dates, payment terms, and risks.
  - resume: Suggest improvements for clarity and impact.
  - enhancer: Describe how this image could be improved.
  - semantic: Answer the query based on the document content.
  
  Return your response in the specified output schema.`,
});

const fileIntelligenceFlow = ai.defineFlow(
  {
    name: 'fileIntelligenceFlow',
    inputSchema: IntelligenceInputSchema,
    outputSchema: IntelligenceOutputSchema,
  },
  async (input) => {
    const {output} = await fileIntelligencePrompt(input);
    return output!;
  }
);
