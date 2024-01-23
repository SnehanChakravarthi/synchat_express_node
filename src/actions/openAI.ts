import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatCompletionRequest {
  message: string;
}

/**
 * Sends a chat message to OpenAI and returns the completion response.
 * @param message The message to be sent to OpenAI.
 * @returns A Promise that resolves to the completion response as a string.
 * @throws  If no completion choices are returned from OpenAI.
 */
export async function ChatCompletion({
  message,
}: ChatCompletionRequest): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: message }],
    });

    if (completion.choices?.[0]?.message.content) {
      return completion.choices[0].message.content;
    } else {
      throw new Error('No completion choices returned from OpenAI');
    }
  } catch (error) {
    console.error('Error in ChatCompletion:', error);
    throw error;
  }
}

interface SpeachToTextRequest {
  audio: string;
}

/**
 * Converts speech to text using OpenAI API.
 * @param audio The path to the audio file.
 * @returns A Promise that resolves to the transcription of the speech.
 * @throws  If there is an error during the conversion process.
 */
export async function SpeachToText({
  audio,
}: SpeachToTextRequest): Promise<any> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audio),
      model: 'whisper-1',
    });

    return transcription;
  } catch (error) {
    console.error('Error in SpeachToText:', error);
    throw error;
  }
}

interface PictureToTextRequest {
  base64Image: string;
  caption?: string;
}
/**
 * Converts a picture to text using OpenAI's GPT-4 Vision model.
 *
 * @param base64Image - The base64 encoded image to be processed.
 * @param caption - The caption or prompt for the image. Defaults to "What's in this picture?".
 * @returns A Promise that resolves to the generated text from the image.
 * @throws An error if no response is received from OpenAI.
 */
export async function PictureToText({
  base64Image,
  caption = "What's in this picture?",
}: PictureToTextRequest): Promise<string> {
  console.log('Caption:', caption);
  const formattedBase64Image = `data:image/jpeg;base64,${base64Image}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: caption },
            { type: 'image_url', image_url: { url: formattedBase64Image } },
          ],
        },
      ],
      max_tokens: 300,
    });

    if (response.choices?.[0]?.message.content) {
      return response.choices[0].message.content;
    } else {
      throw new Error('No response received from OpenAI');
    }
  } catch (error) {
    console.error('Error in PictureToText:', error);
    throw error;
  }
}
