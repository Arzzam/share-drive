import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';

import { loginRequestScopes } from '../auth/authConfig';
import Button from './Button';
import Input from './Input';
import DragAndDrop from './DragDropFile';
import LoadingButton from './LoadingButton';
import { IFileInput, IUploadLinkResponse } from '../utils/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadFilesToOneDrive } from '../api/graphCall';
import TableLayout from './Table';

const UploadPage = () => {
  const { instance, accounts } = useMsal();
  const [files, setFiles] = useState<IFileInput[]>([]);
  const [filePath, setFilePath] = useState<string>('');
  const [token, setToken] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<IUploadLinkResponse[]>([]);

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

  const getFileFromSessionStorage = () => {
    const uploadedFiles = sessionStorage.getItem('uploadedFiles');
    if (uploadedFiles) {
      setUploadedFiles(JSON.parse(uploadedFiles));
    }
  };

  useEffect(() => {
    fetchAccessToken();
    getFileFromSessionStorage();
  }, [accounts]);

  const handleUploadFile = async () => {
    try {
      if (files.length > 0 && token) {
        setIsLoading(true);
        const response = await uploadFilesToOneDrive(files, token, filePath);
        sessionStorage.setItem('uploadedFiles', JSON.stringify(response));
        setUploadedFiles((prev) => [...prev, ...response]);
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
      {uploadedFiles.length > 0 && (
        <TableLayout
          className='w-[80%] mt-10'
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      )}
    </>
  );
};

export default UploadPage;
