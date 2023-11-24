import { AxiosResponse } from 'axios';

export interface IUploadFileResponse {
  status: number;
  uploadResponse?: AxiosResponse;
  shareableLink?: Promise<string> | string;
  error?: string;
}

export interface IFileInput extends File {
  uid: string;
}
