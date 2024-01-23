import { getMedia } from './getMedia';
import { ChatCompletion, PictureToText, SpeachToText } from './openAI';
import type { MessageObject, WhatsAppWebhookPayload } from '../utils/types';
import { sendMessage } from './sendMessage';

export const processPayload = async (jsonBody: WhatsAppWebhookPayload) => {
  const { entry } = jsonBody;

  if (
    entry &&
    entry[0] &&
    entry[0].changes &&
    entry[0].changes[0] &&
    entry[0].changes[0].value &&
    entry[0].changes[0].value.messages &&
    entry[0].changes[0].value.messages[0]
  ) {
    const from = parseInt(entry[0]?.changes[0]?.value?.messages[0]?.from);
    const profile = entry[0]?.changes[0]?.value?.contacts[0]?.profile;
    const profileID = entry[0]?.changes[0]?.value?.contacts[0]?.wa_id;
    const messageType = entry[0]?.changes[0]?.value?.messages[0]?.type;
    const message: MessageObject = entry[0]?.changes[0]?.value?.messages[0]; // MessageObject type

    let messageContent;
    if (from && profile && profileID && messageType && message) {
      switch (message.type) {
        case 'text':
          if ('text' in message) {
            messageContent = message.text.body;
            console.log('Text message from', from, ':', messageContent);
            const response = await ChatCompletion({ message: messageContent });
            if (response) {
              sendMessage(response, from);
            }
          }
          break;
        case 'audio':
          console.log('Audio message from', from);
          if ('audio' in message) {
            messageContent = {
              mimeType: message.audio.mime_type,
              id: message.audio.id,
            };

            const response = await getMedia(
              messageContent.id,
              messageContent.mimeType,
              'audio'
            );

            if (response) {
              const SPT = await SpeachToText({ audio: response });
              const chatRes = await ChatCompletion({ message: SPT.text });
              if (chatRes) {
                sendMessage(chatRes, from);
              }
            }
          }
          break;
        case 'image':
          console.log('Image message from', from);
          if ('image' in message) {
            messageContent = {
              caption: message.image.caption,
              id: message.image.id,
              mimeType: message.image.mime_type,
            };

            // console.log(messageContent.id, 'media id');
            // console.log(messageContent.mimeType, 'messageContent');
            // console.log(messageContent.caption, 'messageContent');

            try {
              const response = await getMedia(
                messageContent.id,
                messageContent.mimeType,
                'image'
              );

              if (response) {
                const PTT = await PictureToText({
                  base64Image: response,
                  caption: messageContent.caption,
                });
                console.log(PTT, 'PTT');
                if (PTT) {
                  sendMessage(PTT, from);
                }
              } else {
                console.log('No response received from getMedia function');
              }
            } catch (error) {
              console.error('An error occurred:', error);
            }
          }

          break;
        default:
          messageContent = null;
      }
    }
  }
};
