import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

interface MessagePayload {
  messaging_product: string;
  to: number;
  type: string;
  text: {
    preview_url: boolean;
    body: string;
  };
}

/**
 * Sends a message to a specified recipient.
 *
 * @param message - The message to be sent.
 * @param to - The recipient's number.
 * @returns A Promise that resolves to void.
 */
export const sendMessage = async (
  message: string,
  to: number
): Promise<void> => {
  const payload: MessagePayload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body: message,
    },
  };

  try {
    console.log('Sending Message to', to);
    const response = await axios.post(url, payload, { headers });
    console.log('Message sent:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(
        'Error sending message:',
        axiosError.response?.data || axiosError.message
      );
    } else if (error instanceof Error) {
      console.error('Error sending message:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
};
