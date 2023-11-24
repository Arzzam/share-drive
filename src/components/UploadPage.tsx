import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';

import { loginRequestScopes } from '../auth/authConfig';
import Button from './Button';
import Input from './Input';
import DragAndDrop from './DragDropFile';
import LoadingButton from './LoadingButton';
import { IFileInput } from '../utils/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadFileToOneDrive } from '../api/graphCall';

const UploadPage = () => {
  const { instance, accounts } = useMsal();
  const [files, setFiles] = useState<IFileInput[]>([]);
  const [filePath, setFilePath] = useState<string>('');
  const [token, setToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearFileInputs = () => {
    setFiles([]);
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pathValue = e.target.value;
    setFilePath(pathValue);
  };

  const fetchAccessToken = async () => {
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
  };

  useEffect(() => {
    fetchAccessToken();
  }, [accounts]);

  const handleUploadFile = async () => {
    try {
      if (files.length > 0 && token) {
        setIsLoading(true);
        const response = await uploadFileToOneDrive(files, token, filePath);
        console.log(response);
        clearFileInputs();
      } else {
        toast.error('Please select a file to upload');
      }
    } catch (error) {
      toast.error('An error occurred during file upload');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <h5 className='font-normal text-xl self-start'>
        Welcome <span className='font-bold'>{accounts[0]?.name}</span>
      </h5>
      <div className='flex flex-row justify-center mt-4 items-center gap-10 w-[80%]'>
        <DragAndDrop
          className='w-[30%] max-h-[60vh] overflow-auto pr-3'
          setFiles={setFiles}
          files={files}
        />

        <div className='w-[30%] flex flex-col gap-2 self-start h-full'>
          <Input
            label='File Path'
            placeholder='Enter the file Path to upload'
            onChange={(e) => handlePathChange(e)}
          />
          {isLoading ? (
            <LoadingButton />
          ) : (
            <Button className='self-center mb-1' onClick={handleUploadFile}>
              Upload a File
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadPage;
