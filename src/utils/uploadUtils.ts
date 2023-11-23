import axios from 'axios';
// import { graphConfig } from '../api/graphCall';

export const uploadFileToOneDrive = async (
  file: File,
  token: string | undefined,
  filePath: string
): Promise<string> => {
  const endpoint = `https://graph.microsoft.com/v1.0/me/drive/items/root:/${filePath}/${file.name}:/content`;
  console.log(endpoint);
  try {
    const uploadResponse = await axios.put(endpoint, file, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': file?.type,
      },
    });
    console.log(uploadResponse);
    return 'File Uploaded Successfully';
  } catch (error) {
    console.error(error);
    return 'Error Uploading File';
  }
};

export const uploadLargeFileToOneDrive = async (
  file: File,
  token: string | undefined,
  filePath: string
): Promise<string> => {
  const endpoint = `https://graph.microsoft.com/v1.0/me/drive/items/root:/${filePath}/${file.name}:/createUploadSession`;
  console.log(endpoint);
  try {
    const sessionResponse = await axios.post(endpoint, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const uploadUrl = sessionResponse.data.uploadUrl;
    const fileSize = file.size;

    const chunkSize = 3 * 1024 * 1024; // 3 MB
    let start = 0;
    let end = Math.min(chunkSize, fileSize);
    let uploadResponse;
    while (start < fileSize) {
      const chunk = file.slice(start, end);
      const range = `bytes ${start}-${end - 1}/${fileSize}`;

      uploadResponse = await axios.put(uploadUrl, chunk, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Range': range,
        },
      });

      start = end;
      end = Math.min(start + chunkSize, fileSize);
    }
    console.log(uploadResponse);
    return 'File Uploaded Successfully';
  } catch (error) {
    console.error(error);
    return 'Error Uploading File';
  }
};
