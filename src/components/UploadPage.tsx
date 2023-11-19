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

const UploadPage = () => {
  const { instance, accounts } = useMsal();
  const [file, setFile] = useState<File>();
  const [token, setToken] = useState<string>();

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
        console.log('RESPONSE IN UPLOAD PAGE ', response);
      });
    const endpoint = `https://graph.microsoft.com/v1.0/me/drive/root/children`;
    try {
      console.log('token', token);
      await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        const response = await uploadLargeFileToOneDrive(file, token);
        alert(response);
      } else {
        const response = await uploadFileToOneDrive(file, token);
        alert(response);
      }
    }
  };

  return (
    <>
      <h5 className='card-title'>Welcome {accounts[0]?.name}</h5>
      <input
        className='w-52'
        type={'file'}
        onChange={(e) => handleFileChange(e)}
      />
      <button onClick={handleUploadFile}>Upload a File</button>
      <button onClick={callUserInfo}>GEt Info</button>
      <button onClick={getFileInfo}>GEt File</button>
    </>
  );
};

export default UploadPage;
