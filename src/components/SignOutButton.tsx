import { useMsal } from '@azure/msal-react';
import Button from './Button';

const SignOutButton: React.FC = () => {
  const { instance, accounts } = useMsal();

  const handleSignOut = () => {
    instance
      .logoutRedirect({
        authority: `https://login.microsoftonline.com/${accounts[0]?.tenantId}`,
        onRedirectNavigate() {
          return false;
        },
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>;
};

export default SignOutButton;
