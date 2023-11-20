import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequestScopes } from '../auth/authConfig';
import axios from 'axios';
import { callMsGraph } from '../auth/graphCall';
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
  const [file, setFile] = useState<File>();
  const [token, setToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toastResponse = (response: string) => {
    toast(response, {
      autoClose: 5000,
      type: 'success',
      position: 'top-right',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
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
    if (file && token) {
      if (file && isLargeFile(file?.size)) {
        setIsLoading(true);
        const response = await uploadLargeFileToOneDrive(file, token);
        if (response) {
          toastResponse(response);
          setIsLoading(false);
          setFile(undefined);
        }
      } else {
        setIsLoading(true);
        const response = await uploadFileToOneDrive(file, token);
        if (response) {
          toastResponse(response);
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <>
      <h5 className='font-normal text-xl self-start'>
        Welcome <span className='font-bold'>{accounts[0]?.name}</span>
      </h5>
      <div className='flex flex-col justify-center items-center gap-2'>
        <ToastContainer />
        <Input label='File Path' placeholder='Enter the file Path to upload' />
        <FileInput onChange={(e) => handleFileChange(e)} />
        {isLoading ? (
          <LoadingButton />
        ) : (
          <Button onClick={handleUploadFile}>Upload a File</Button>
        )}
        <Button onClick={callUserInfo}>Get Info</Button>
        <Button onClick={getFileInfo}>Get File</Button>
      </div>
    </>
  );
};

export default UploadPage;
