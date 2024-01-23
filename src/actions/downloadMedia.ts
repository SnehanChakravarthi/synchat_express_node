import fs from 'fs';
import path from 'path';
import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
};

export interface DownloadMediaResponse {
  base64Data?: string;
  filePath?: string;
}

/**
 * Downloads media from the specified URL and saves it to the appropriate location based on the media type.
 * @param downloadURL The URL of the media to be downloaded.
 * @param mimeType The MIME type of the media.
 * @param mediaType The type of the media (e.g., 'image', 'audio').
 * @returns A promise that resolves to a DownloadMediaResponse object containing the downloaded media.
 * @throws An error if the media type is unsupported or if there is an error downloading the media.
 */
export const downloadMedia = async (
  downloadURL: string,
  mimeType: string,
  mediaType: string
): Promise<DownloadMediaResponse> => {
  const fileExtension = mimeType.split('/')[1].split(';')[0];
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    responseType: 'arraybuffer',
    url: downloadURL,
    headers,
  };

  try {
    const response = await axios.request(config);
    const binaryData = response.data;

    switch (mediaType) {
      // Fetch the image and return the base64 string
      case 'image':
        const base64FilePath = path.join(
          __dirname,
          '..',
          'media',
          'base64MediaFile.txt'
        );
        const base64Data = Buffer.from(binaryData, 'binary').toString('base64');
        await fs.promises.writeFile(base64FilePath, base64Data);
        return { base64Data };

      case 'audio':
        // Fetch the audio and return the file path
        const filePath = path.join(
          __dirname,
          '..',
          'media',
          `mediaFile.${fileExtension}`
        );
        await fs.promises.writeFile(filePath, binaryData);
        return { filePath };

      default:
        throw new Error(`Unsupported media type: ${mediaType}`);
    }
  } catch (error) {
    console.error('Error downloading media:', error);
    throw error;
  }
};
