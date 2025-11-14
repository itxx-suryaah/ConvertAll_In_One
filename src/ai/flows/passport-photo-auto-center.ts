'use server';

/**
 * @fileOverview Automatically centers the face in a passport photo using AI face detection.
 *
 * - passportPhotoAutoCenter - A function that handles the passport photo auto centering process.
 * - PassportPhotoAutoCenterInput - The input type for the passportPhotoAutoCenter function.
 * - PassportPhotoAutoCenterOutput - The return type for the passportPhotoAutoCenter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PassportPhotoAutoCenterInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
    ),
  faceCenterGuideX: z.number().describe('The x coordinate of the face center guide.'),
  faceCenterGuideY: z.number().describe('The y coordinate of the face center guide.'),
});
export type PassportPhotoAutoCenterInput = z.infer<typeof PassportPhotoAutoCenterInputSchema>;

const PassportPhotoAutoCenterOutputSchema = z.object({
  centeredPhotoDataUri: z
    .string()
    .describe(
      'A photo of a person with the face automatically centered, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
    ),
});
export type PassportPhotoAutoCenterOutput = z.infer<typeof PassportPhotoAutoCenterOutputSchema>;

export async function passportPhotoAutoCenter(
  input: PassportPhotoAutoCenterInput
): Promise<PassportPhotoAutoCenterOutput> {
  return passportPhotoAutoCenterFlow(input);
}

const passportPhotoAutoCenterPrompt = ai.definePrompt({
  name: 'passportPhotoAutoCenterPrompt',
  input: {schema: PassportPhotoAutoCenterInputSchema},
  output: {schema: PassportPhotoAutoCenterOutputSchema},
  prompt: `You are an AI assistant that automatically centers a face in a passport photo.

The user will provide a photo and the coordinates for the face center guide.

You will return the photo with the face centered.

Input Photo: {{media url=photoDataUri}}
Face Center Guide X: {{{faceCenterGuideX}}}
Face Center Guide Y: {{{faceCenterGuideY}}}

Output the centered photo as a data URI.
`,
});

const passportPhotoAutoCenterFlow = ai.defineFlow(
  {
    name: 'passportPhotoAutoCenterFlow',
    inputSchema: PassportPhotoAutoCenterInputSchema,
    outputSchema: PassportPhotoAutoCenterOutputSchema,
  },
  async input => {
    const {output} = await passportPhotoAutoCenterPrompt(input);
    return output!;
  }
);
