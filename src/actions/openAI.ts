import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function ChatCompletion({ message }: { message: string }) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: message }],
    });

    if (completion && completion.choices && completion.choices.length > 0) {
      return completion.choices[0].message.content;
    } else {
      throw new Error('No completion choices returned from OpenAI');
    }
  } catch (error) {
    console.error('Error in ChatCompletion:', error);
    throw error;
  }
}

export async function SpeachToText({ audio }: { audio: string }) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audio),
    model: 'whisper-1',
  });

  return transcription;
}

export async function PictureToText({
  base64Image,
  caption = "What's in this picture?",
}: {
  base64Image: string;
  caption: string;
}) {
  console.log('caption:', caption);
  const formattedBase64Image = `data:image/jpeg;base64,${base64Image}`;

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

  const text = response.choices[0].message.content;
  return text;
}
