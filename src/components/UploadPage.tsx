import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { isLargeFile } from '../utils/utils';
import {
  uploadFileToOneDrive,
  uploadLargeFileToOneDrive,
} from '../utils/uploadUtils';
import Button from './Button';
import LoadingButton from './LoadingButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileInput from './FileInput';
import Input from './Input';

const UploadPage = () => {
  const { instance, accounts } = useMsal();
  const [files, setFiles] = useState<FileList | null>(null); // [File, File, File
  const [filePath, setFilePath] = useState<string>('');
  const [token, setToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toastResponse = (response: string) => {
    toast(response, {
      autoClose: 5000,
      type: 'success',
      position: 'top-right',
    });
  };

  const clearFileInputs = () => {
    setFiles(null);
    const fileInput = document.getElementById(
      'files-upload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileValue = e.target.files;
    console.log('File Value ', fileValue);
    if (fileValue) {
      setFiles(fileValue);
    }
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pathValue = e.target.value;
    setFilePath(pathValue);
  };

  const handleUploadFile = async () => {
    instance
      .acquireTokenSilent({
        ...loginRequestScopes,
        account: accounts[0],
      })
      .then((response) => {
        if (response) {
          setToken(response.accessToken);
        }
      });
    if (files && token) {
      if (files?.length > 0) {
        for (let i = 0; i < files.length; i++) {
          setIsLoading(true);
          if (isLargeFile(files[i]?.size)) {
            const response = await uploadLargeFileToOneDrive(
              files[i],
              token,
              filePath
            );
            if (response) {
              toastResponse(response);
            }
          } else {
            const response = await uploadFileToOneDrive(
              files[i],
              token,
              filePath
            );
            if (response) {
              toastResponse(response);
            }
          }
        }
        clearFileInputs();
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <h5 className='font-normal text-xl self-start'>
        Welcome <span className='font-bold'>{accounts[0]?.name}</span>
      </h5>
      <div className='flex flex-col justify-center items-center gap-2 w-[70%]'>
        <ToastContainer />
        <div className='flex flex-row justify-between items-center w-[80%] gap-10'>
          <FileInput onChange={(e) => handleFileChange(e)} id='files-upload' />
          <Input
            label='File Path'
            placeholder='Enter the file Path to upload'
            onChange={(e) => handlePathChange(e)}
          />
        </div>
        {isLoading ? (
          <LoadingButton />
        ) : (
          <Button className='self-center mb-1' onClick={handleUploadFile}>
            Upload a File
          </Button>
        )}
        {files && files?.length > 0 && (
          <div className='flex flex-col justify-start items-start w-full'>
            <h3 className='text-lg font-medium'>Files to Upload</h3>
            <div className='flex flex-col gap-2 w-full'>
              {Array.from(files).map((file, idx) => (
                <p key={file.name}>{idx + 1 + '. ' + file.name}</p>
              ))}
            </div>
          </div>
        )}

        {/* <Button onClick={callUserInfo}>Get Info</Button>
        <Button onClick={getFileInfo}>Get File</Button> */}
      </div>
    </>
  );
};

export default UploadPage;
