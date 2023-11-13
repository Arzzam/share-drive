import { useMsal } from '@azure/msal-react';
import Button from './Button';
import { loginRequestScopes } from '../auth/authConfig';

const SignInButton: React.FC = () => {
  const { instance } = useMsal();

  const handleSignIn = () => {
    instance.loginRedirect(loginRequestScopes).catch((e) => {
      console.log(e);
    });
  };

  return <Button onClick={handleSignIn}>Sign In</Button>;
};

export default SignInButton;
