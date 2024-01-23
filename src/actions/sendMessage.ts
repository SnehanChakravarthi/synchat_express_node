import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

export const sendMessage = async (message: string, to: number) => {
  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: {
      preview_url: false,
      body: message,
    },
  };

  try {
    console.log('Sending Message to', to);
    const response = await axios.post(url, payload, { headers: headers });
    console.log('Message sent:', response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error sending message:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
};
