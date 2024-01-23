import axios from 'axios';
import { downloadMedia } from './downloadMedia';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

export const getMedia = async (
  id: string,
  mime_type: string,
  media: string
) => {
  const url = `https://graph.facebook.com/v18.0/${id}/`;

  try {
    const mediaURL = await axios.get(url, { headers });

    const mediaURLJSON = mediaURL.data;
    console.log('Media URL Object: ', mediaURLJSON);

    if (mediaURLJSON.url) {
      const url = mediaURLJSON.url;
      const mediaFilePath = await downloadMedia(url, mime_type, media);
      return mediaFilePath;
    }
  } catch (error) {
    console.log(error);
  }
};
