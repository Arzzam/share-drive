import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { CHUNK_SIZE, toastConfig } from './utils';
// import { graphConfig } from '../api/graphCall';

export const uploadFileToOneDrive = async (
  file: File,
  token: string | undefined,
  filePath: string
): Promise<string> => {
  const endpoint = `https://graph.microsoft.com/v1.0/me/drive/items/root:/${
    filePath ? filePath + '/' : ''
  }${file.name}:/content`;
  try {
    const uploadResponse = await axios.put(endpoint, file, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': file?.type,
      },
    });
    toast.success('File uploaded successfully', toastConfig);
    return await getShareableLink(uploadResponse, token);
  } catch (error) {
    console.error(error);
    toast.error('Error uploading file', toastConfig);
    return Promise.reject(error);
  }
};

export const uploadLargeFileToOneDrive = async (
  file: File,
  token: string | undefined,
  filePath: string
): Promise<string> => {
  const endpoint = `https://graph.microsoft.com/v1.0/me/drive/items/root:/${
    filePath ? filePath + '/' : ''
  }${file.name}:/createUploadSession`;
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

    let start = 0;
    let end = Math.min(CHUNK_SIZE, fileSize);
    let uploadResponse: AxiosResponse | undefined;

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
      end = Math.min(start + CHUNK_SIZE, fileSize);
    }
    toast.success('File uploaded successfully', toastConfig);
    return await getShareableLink(uploadResponse, token);
  } catch (e) {
    const error = e as AxiosError;
    console.error(error);
    toast.error('Error uploading file', toastConfig);
    return Promise.reject(error);
  }
};

// const handleAxiosError = (error: AxiosError) => {
//   if (error.response) {
//     console.log(error.response.data);
//     console.log(error.response.status);
//     console.log(error.response.headers);
//     return error.response;
//   } else if (error.request) {
//     console.log(error.request);
//     return error.request;
//   } else {
//     console.log('Error', error.message);
//     return error.message;
//   }
// };

const getShareableLink = async (
  uploadResponse: AxiosResponse | undefined,
  token: string | undefined
) => {
  if (!uploadResponse || !token) return '';
  const createLinkUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${uploadResponse.data.id}/createLink`;
  const payload = {
    type: 'view', // or 'edit' for edit access
    scope: 'anonymous',
  };

  const urlResponse = await axios.post(createLinkUrl, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const shareableLink: string = urlResponse.data.link.webUrl;

  return shareableLink;
};
