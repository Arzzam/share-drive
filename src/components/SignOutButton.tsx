import { useMsal } from '@azure/msal-react';
import Button from './Button';

const SignOutButton: React.FC = () => {
  const { instance } = useMsal();

  const currentActiveAccount = instance.getActiveAccount();

  const handleSignOut = () => {
    instance.logoutPopup({
      account: currentActiveAccount,
      logoutHint: currentActiveAccount!.homeAccountId,
      mainWindowRedirectUri: '/',
      popupWindowAttributes: { popupSize: { width: 0, height: 0 } },
      postLogoutRedirectUri: '/',
    });
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>;
};

export default SignOutButton;
