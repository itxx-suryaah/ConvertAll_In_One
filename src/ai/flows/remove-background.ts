'use server';

/**
 * @fileOverview An AI flow to remove the background from an image and optionally replace it with a solid color.
 *
 * - removeBackground - A function that handles the background removal process.
 * - RemoveBackgroundInput - The input type for the removeBackground function.
 * - RemoveBackgroundOutput - The return type for the removeBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemoveBackgroundInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'." // prettier-ignore
    ),
  backgroundColor: z
    .string()
    .optional()
    .describe(
      'An optional hex color code (e.g., "#FFFFFF") to apply as the new background. If not provided, the background will be transparent.'
    ),
});
export type RemoveBackgroundInput = z.infer<typeof RemoveBackgroundInputSchema>;

const RemoveBackgroundOutputSchema = z.object({
  processedPhotoDataUri: z
    .string()
    .describe(
      'The processed photo as a data URI, with the background removed or replaced.'
    ),
});
export type RemoveBackgroundOutput = z.infer<
  typeof RemoveBackgroundOutputSchema
>;

export async function removeBackground(
  input: RemoveBackgroundInput
): Promise<RemoveBackgroundOutput> {
  return removeBackgroundFlow(input);
}

const removeBackgroundFlow = ai.defineFlow(
  {
    name: 'removeBackgroundFlow',
    inputSchema: RemoveBackgroundInputSchema,
    outputSchema: RemoveBackgroundOutputSchema,
  },
  async input => {
    const promptParts = [
      {
        media: {
          url: input.photoDataUri,
        },
      },
      {
        text: `You are an expert image editor. Remove the background from this image. The subject is a person. The output should be a PNG with a transparent background.`,
      },
    ];

    if (input.backgroundColor) {
      promptParts.push({
        text: `After removing the background, replace the transparent background with a solid color: ${input.backgroundColor}.`,
      });
    }

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: promptParts,
      config: {
        responseModalities: ['IMAGE'],
      },
    });

    // media may be null/undefined if generation failed — guard before accessing .url
    if (!media || !media.url) {
      throw new Error('Failed to generate image with background removed.');
    }

    return {
      processedPhotoDataUri: media.url,
    };
  }
);
