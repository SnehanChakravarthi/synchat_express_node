import axios from 'axios';
import { downloadMedia, DownloadMediaResponse } from './downloadMedia';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

interface MediaURLResponse {
  url?: string;
}

/**
 * Retrieves media from Facebook Graph API based on the provided ID, MIME type, and media type.
 * @param id - The ID of the media.
 * @param mimeType - The MIME type of the media.
 * @param mediaType - The type of the media.
 * @returns A Promise that resolves to the downloaded media URL, or undefined if no URL is found.
 */
export const getMedia = async (
  id: string,
  mimeType: string,
  mediaType: string
): Promise<DownloadMediaResponse | undefined> => {
  const url = `https://graph.facebook.com/v18.0/${id}/`;

  try {
    const response = await axios.get<MediaURLResponse>(url, { headers });

    if (response.data && response.data.url) {
      console.log('Media URL:', response.data.url);
      return downloadMedia(response.data.url, mimeType, mediaType);
    } else {
      console.error('No URL found in the media response');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
};
