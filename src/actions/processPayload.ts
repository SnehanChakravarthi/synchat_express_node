import { getMedia } from './getMedia';
import { ChatCompletion, PictureToText, SpeachToText } from './openAI';
import type {
  MessageObject,
  WhatsAppWebhookPayload,
  TextMessage,
  AudioMessage,
  ImageMessage,
} from '../utils/types';
import { sendMessage } from './sendMessage';

/**
 * Processes the payload received from WhatsApp webhook
 * @param jsonBody - The WhatsApp webhook payload
 * @returns Promise<void>
 */
export const processPayload = async (
  jsonBody: WhatsAppWebhookPayload
): Promise<void> => {
  const message: MessageObject | undefined =
    jsonBody.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) {
    return;
  }

  const from: number | undefined = parseInt(message?.from);
  const messageType: string | undefined = message?.type;

  if (from && messageType) {
    try {
      switch (messageType) {
        case 'text':
          await processTextMessage(message as TextMessage, from);
          break;
        case 'audio':
          await processAudioMessage(message as AudioMessage, from);
          break;
        case 'image':
          await processImageMessage(message as ImageMessage, from);
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
};

/**
 * Processes a text message
 * @param message - The text message object
 * @param from - The sender's number
 * @returns Promise<void>
 */
async function processTextMessage(
  message: TextMessage,
  from: number
): Promise<void> {
  if ('text' in message) {
    const messageContent = message.text.body;
    console.log('Text message from', from, ':', messageContent);
    const response = await ChatCompletion({ message: messageContent });
    if (response) {
      sendMessage(response, from);
    }
  }
}

/**
 * Processes an audio message
 * @param message - The audio message object
 * @param from - The sender's number
 * @returns Promise<void>
 */
async function processAudioMessage(
  message: AudioMessage,
  from: number
): Promise<void> {
  if ('audio' in message) {
    const messageContent = {
      mimeType: message.audio.mime_type,
      id: message.audio.id,
    };
    const audioData = await getMedia(
      messageContent.id,
      messageContent.mimeType,
      'audio'
    );
    if (audioData && audioData.filePath) {
      const SPT = await SpeachToText({ audio: audioData.filePath as string });
      const chatRes = await ChatCompletion({ message: SPT.text });
      if (chatRes) {
        sendMessage(chatRes, from);
      }
    }
  }
}

/**
 * Processes an image message
 * @param message - The image message object
 * @param from - The sender's number
 * @returns Promise<void>
 */
async function processImageMessage(
  message: ImageMessage,
  from: number
): Promise<void> {
  if ('image' in message) {
    const messageContent = {
      caption: message.image.caption,
      id: message.image.id,
      mimeType: message.image.mime_type,
    };
    const imageData = await getMedia(
      messageContent.id,
      messageContent.mimeType,
      'image'
    );
    if (imageData && imageData.base64Data) {
      const PTT = await PictureToText({
        base64Image: imageData.base64Data as string,
        caption: messageContent.caption,
      });
      console.log(PTT, 'PTT');
      if (PTT) {
        sendMessage(PTT, from);
      }
    } else {
      console.log('No response received from getMedia function');
    }
  }
}
