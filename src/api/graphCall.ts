import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  CHUNK_SIZE,
  isLargeFile,
  linkConfigPayload,
  toastConfig,
} from '../utils/utils';
import { toast } from 'react-toastify';
import { FileType, IFileInput, IUploadLinkResponse } from '../utils/types';

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  driveEndpoint: `https://graph.microsoft.com/v1.0/me/drive/items/root:/`,
};

export const uploadFileToOneDrive = async (
  files: IFileInput[],
  token: string,
  filePath: string
): Promise<IUploadLinkResponse[]> => {
  const response: IUploadLinkResponse[] = [];
  if (files.length > 0) {
    const folderEndPoint = `${graphConfig.driveEndpoint}${
      filePath ? filePath : ''
    }`;
    for (const file of files) {
      const fileEndPoint = `${graphConfig.driveEndpoint}${
        filePath ? filePath + '/' : ''
      }${file.name}:/content`;
      let fileUploadResponse: AxiosResponse;
      if (isLargeFile(file.size)) {
        fileUploadResponse = await uploadLargeFile(file, token, fileEndPoint);
      } else {
        fileUploadResponse = await uploadSmallFile(file, token, fileEndPoint);
      }
      const fileLink = await getShareableLink(
        fileUploadResponse.data.id,
        token
      );
      response.push({
        name: file.name,
        link: fileLink,
        type: FileType.File,
      });
    }
    const { id: folderId, name: folderName } = await getDriveItemId(
      token,
      folderEndPoint
    );
    const folderLink = await getShareableLink(folderId, token);
    console.log('🚀 ~ file: graphCall.ts:32 ~ folderLink:', folderLink);
    response.push({
      name: folderName,
      link: folderLink,
      type: FileType.Folder,
    });
    return response;
  } else {
    return Promise.reject('No files selected');
  }
};

const getDriveItemId = async (
  token: string,
  filePath: string
): Promise<{ id: string; name: string }> => {
  const response = await axios.get(filePath, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const { id, name } = response.data;
  return { id, name };
};

const uploadLargeFile = async (
  file: IFileInput,
  token: string,
  fileEndPoint: string
): Promise<AxiosResponse> => {
  try {
    const sessionResponse = await axios.post(fileEndPoint, null, {
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
      end = Math.min(end + CHUNK_SIZE, fileSize);
    }
    toast.success('File uploaded successfully', toastConfig);
    return uploadResponse as AxiosResponse;
  } catch (error) {
    console.error(error);
    toast.error('Error uploading file', toastConfig);
    return Promise.reject(error);
  }
};

const uploadSmallFile = async (
  file: IFileInput,
  token: string,
  fileEndPoint: string
): Promise<AxiosResponse> => {
  try {
    const uploadResponse = await axios.put(fileEndPoint, file, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': file?.type,
      },
    });
    toast.success('File uploaded successfully', toastConfig);
    return uploadResponse as AxiosResponse;
  } catch (error) {
    console.error(error);
    toast.error('Error uploading file', toastConfig);
    return Promise.reject(error);
  }
};

const MAX_RETRIES = 5;

const getShareableLink = async (
  id: string | undefined,
  token: string
): Promise<string> => {
  if (!id || !token) return '';
  let retries = 0;
  const createLinkUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${id}/createLink`;
  try {
    const urlResponse = await axios.post(createLinkUrl, linkConfigPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('🚀 ~ file: graphCall.ts:32 ~ urlResponse:', urlResponse);
    const shareableLink: string = urlResponse.data.link.webUrl;
    return shareableLink;
  } catch (e) {
    const error = e as AxiosError;
    if (
      error.response &&
      error.response.status === 429 &&
      retries < MAX_RETRIES
    ) {
      // Implement exponential backoff
      const delay = Math.pow(2, retries) * 1000; // 2^retries seconds
      await new Promise((resolve) => setTimeout(resolve, delay));
      retries++;
      return getShareableLink(id, token); // Retry the request
    } else {
      console.error(error);
      toast.error('Error getting shareable link', toastConfig);
      return Promise.reject(error);
    }
  }
};
