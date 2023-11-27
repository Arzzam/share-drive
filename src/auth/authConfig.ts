import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common/',
    redirectUri: '/',
    postLogoutRedirectUri: '/',
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean
      ) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequestScopes = {
  scopes: ['User.Read', 'Files.ReadWrite.All'],
};
