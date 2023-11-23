import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequestScopes } from '../auth/authConfig';
import axios from 'axios';
import { callMsGraph } from '../api/graphCall';
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

  const callUserInfo = async () => {
    instance
      .acquireTokenSilent({
        ...loginRequestScopes,
        account: accounts[0],
      })
      .then((response) => {
        if (response) {
          callMsGraph(response.accessToken).then((response) => {
            console.log('Response  ', response);
          });
          setToken(response.accessToken);
        }
        console.log('Response  ', response);
      });
  };

  const getFileInfo = async () => {
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
    const endpoint = `https://graph.microsoft.com/v1.0/me/drive/root/children`;
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('OneDrive Response ', response);
    } catch (error) {
      console.error(error);
    }
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
            const response = await uploadLargeFileToOneDrive(files[i], token);
            if (response) {
              toastResponse(response);
            }
          } else {
            const response = await uploadFileToOneDrive(files[i], token);
            if (response) {
              toastResponse(response);
              setIsLoading(false);
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
        <div className='flex flex-row justify-between items-center w-full gap-10'>
          <Input
            label='File Path'
            placeholder='Enter the file Path to upload'
          />
          <FileInput onChange={(e) => handleFileChange(e)} id='files-upload' />
          {isLoading ? (
            <LoadingButton />
          ) : (
            <Button className='w-80 self-end mb-1' onClick={handleUploadFile}>
              Upload a File
            </Button>
          )}
        </div>
        {files && files?.length > 0 && (
          <>
            <h3 className='text-lg font-medium'>Files to Upload</h3>
            <div className='flex flex-col gap-2'>
              {Array.from(files).map((file) => (
                <p key={file.name}>{file.name}</p>
              ))}
            </div>
          </>
        )}

        {/* <Button onClick={callUserInfo}>Get Info</Button>
        <Button onClick={getFileInfo}>Get File</Button> */}
      </div>
    </>
  );
};

export default UploadPage;
