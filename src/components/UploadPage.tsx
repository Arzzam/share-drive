import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequestScopes } from '../auth/authConfig';
import axios from 'axios';
import { callMsGraph } from '../auth/graphCall';

const UploadPage = () => {
  const { instance, accounts } = useMsal();
  const [file, setFile] = useState({ name: '', type: '' });
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
        console.log('RESPONSE IN UPLOAD PAGE ', response);
      });
    const endpoint = `https://graph.microsoft.com/v1.0/me/drive/items/root:/${file.name}:/content`;
    try {
      console.log('token', token);
      await axios.put(endpoint, file, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': file?.type,
        },
      });
      alert('File Uploaded Successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <input
        className='w-52'
        type={'file'}
        onChange={(e) => handleFileChange(e)}
      />
      <button onClick={handleUploadFile}>Upload a File</button>
      <button onClick={callUserInfo}>GEt Info</button>
    </>
  );
};

export default UploadPage;
