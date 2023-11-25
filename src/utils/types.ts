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

export enum EFileType {
  File = 'File',
  Folder = 'Folder',
}

export interface IUploadLinkResponse {
  name: string;
  link: string;
  type: EFileType.File | EFileType.Folder;
  id: string;
}
