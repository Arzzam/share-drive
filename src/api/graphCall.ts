import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  CHUNK_SIZE,
  isLargeFile,
  linkConfigPayload,
  toastConfig,
} from '../utils/utils';
import { toast } from 'react-toastify';
import { EFileType, IFileInput, IUploadLinkResponse } from '../utils/types';

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  driveEndpoint: `https://graph.microsoft.com/v1.0/me/drive/items/root:/`,
};

export const uploadFilesToOneDrive = async (
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
      }${file.name}`;
      // let fileUploadResponse: AxiosResponse;
      if (isLargeFile(file.size)) {
        await uploadLargeFile(file, token, fileEndPoint);
      } else {
        await uploadSmallFile(file, token, fileEndPoint);
      }
      // const fileLink = await getShareableLink(
      //   fileUploadResponse.data.id,
      //   token
      // );
      // response.push({
      //   name: file.name,
      // link: fileLink,
      //   type: EFileType.File,
      //   id: fileUploadResponse.data.id,
      // });
    }
    const { id: folderId, name: folderName } = await getDriveItemId(
      token,
      folderEndPoint
    );
    const folderLink = await getShareableLink(folderId, token);
    response.push({
      name: folderName,
      link: folderLink,
      type: EFileType.Folder,
      id: folderId,
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
  try {
    const response = await axios.get(filePath, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const { id, name } = response.data;
    return { id, name };
  } catch (error) {
    console.error(error);
    toast.error('Error getting drive item id', toastConfig);
    return Promise.reject(error);
  }
};

const uploadLargeFile = async (
  file: IFileInput,
  token: string,
  fileEndPoint: string
): Promise<AxiosResponse> => {
  try {
    const sessionFileEndPoint = `${fileEndPoint}:/createUploadSession`;
    const sessionResponse = await axios.post(sessionFileEndPoint, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': file?.type,
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
    const uploadFileEndPoint = `${fileEndPoint}:/content`;
    const uploadResponse = await axios.put(uploadFileEndPoint, file, {
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

const MAX_RETRIES = 15;
let retries = 0;

const getShareableLink = async (id: string, token: string): Promise<string> => {
  const createLinkUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${id}/createLink`;
  try {
    const urlResponse = await axios.post(createLinkUrl, linkConfigPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const shareableLink: string = urlResponse.data.link.webUrl;
    return shareableLink;
  } catch (e) {
    const error = e as AxiosError;
    if (
      error.response &&
      error.response.status === 429 &&
      retries < MAX_RETRIES
    ) {
      const retryAfter = parseInt(error.response.headers['retry-after']) || 1;
      console.log(
        `Rate limit exceeded. Retrying after ${retryAfter} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      retries++;
      return getShareableLink(id, token); // Retry the request
      // // Implement exponential backoff
      // const delay = Math.pow(2, retries) * 1000; // 2^retries seconds
      // await new Promise((resolve) => setTimeout(resolve, delay));
      // retries++;
      // return getShareableLink(id, token); // Retry the request
      return Promise.reject(error);
    } else {
      console.error(error);
      toast.error('Error getting shareable link', toastConfig);
      return Promise.reject(error);
    }
  }
};

// const getShareableLink1 = async (
//   id: string,
//   token: string,
//   maxRetries: number = 3
// ): Promise<string> => {
//   const createLinkUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${id}/createLink`;

//   let retries = 0;

//   while (retries < maxRetries) {
//     try {
//       // Make a POST request to create the sharing link
//       const urlResponse = await axios.post(createLinkUrl, linkConfigPayload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       console.log('🚀 ~ file: graphCall.ts:32 ~ urlResponse:', urlResponse);
//       const shareableLink: string = urlResponse.data.link.webUrl;

//       return shareableLink;
//     } catch (e) {
//       // Handle 429 errors by retrying after the specified duration
//       const error = e as AxiosError;
//       if (error.response && error.response.status === 429) {
//         const retryAfter = parseInt(error.response.headers['retry-after']) || 1;
//         console.log(
//           `Rate limit exceeded. Retrying after ${retryAfter} seconds...`
//         );
//         await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
//         retries++;
//       }
//       return Promise.reject(error);
//     }
//   }
//   throw new Error('Max retries reached. Unable to complete the request.');
// };

//   // If max retries are reached, reject the promise
//   return Promise.reject(
//     new Error('Max retries reached. Unable to complete the request.')
//   );
// };

const getShareableLinkBatch = async (
  response: IUploadLinkResponse[],
  token: string
): Promise<string[]> => {
  // Construct the batch request
  const batchUrl = 'https://graph.microsoft.com/v1.0/$batch';

  // Prepare individual requests for each file ID
  const requests = response.map((res, index) => {
    const request = {
      id: index.toString(), // Unique identifier for the request in the batch
      method: 'POST',
      url: `/me/drive/items/${res.id}/createLink`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkConfigPayload), // Ensure linkConfigPayload is correctly defined
    };

    // Validate JSON body
    try {
      JSON.parse(request.body);
      console.log(JSON.parse(request.body));
    } catch (error) {
      console.error(`Invalid JSON body for request id : ${index}`);
      throw error;
    }

    return request;
  });

  // Create the batch request payload
  const batchPayload = {
    requests: requests,
  };

  try {
    // Make a POST request to the batch endpoint
    const batchResponse = await axios.post(batchUrl, batchPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('🚀 ~ file: graphCall.ts:32 ~ batchResponse:', batchResponse);

    // Extract the shareable links from the batch response
    // const shareableLinks: string[] = batchResponse.data.responses.map(response => response.body.link.webUrl);

    // Return the array of shareable links
    return [];
  } catch (e) {
    // Handle errors by rejecting the promise with the error
    const error = e as AxiosError;
    console.error(error);
    return [];
  }
};
