import { useMsal } from '@azure/msal-react';
import Button from './Button';
import { loginRequestScopes } from '../auth/authConfig';

const SignInButton: React.FC = () => {
  const { instance } = useMsal();

  const handleSignIn = () => {
    // instance.loginRedirect(loginRequestScopes).catch((e) => {
    //   console.log(e);
    // });
    instance.loginPopup(loginRequestScopes).catch((e) => {
      console.log(e);
    });
  };

  return (
    <Button className='hover:bg-[#0078D4]' onClick={handleSignIn}>
      Sign In
    </Button>
  );
};

export default SignInButton;
