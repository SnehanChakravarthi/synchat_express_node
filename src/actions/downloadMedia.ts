import fs from 'fs';
import path from 'path';
import axios, { type AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
};

export const downloadMedia = async (
  downloadURL: string,
  mime_type: string,
  media: string
) => {
  const fileExtension = mime_type.split('/')[1].split(';')[0];

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

    if (media === 'image') {
      const base64FilePath = path.join(
        __dirname,
        '..',
        'media',
        `base64MediaFile.txt`
      );
      const base64Data = Buffer.from(binaryData, 'binary').toString('base64');
      await fs.promises.writeFile(base64FilePath, base64Data);

      return base64Data;
    } else if (media === 'audio') {
      const filePath = path.join(
        __dirname,
        '..',
        'media',
        `mediaFile.${fileExtension}`
      );
      await fs.promises.writeFile(filePath, binaryData);

      return filePath;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
