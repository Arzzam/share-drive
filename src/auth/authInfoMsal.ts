import { loginRequestScopes } from './authConfig';
import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';

export const getAccessToken = async (
  instance: IPublicClientApplication,
  accounts: AccountInfo
) => {
  instance
    .acquireTokenSilent({
      ...loginRequestScopes,
      account: accounts,
    })
    .then((response) => {
      return response.accessToken;
    })
    .catch((error) => {
      console.log(error);
    });
  return '';
};
