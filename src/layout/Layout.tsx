import { useIsAuthenticated } from '@azure/msal-react';
import SignOutButton from '../components/SignOutButton';
import SignInButton from '../components/SignInButton';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const isAuthenticated = useIsAuthenticated();
  return (
    <>
      <nav className='flex flex-row justify-between w-full'>
        <h1 className='self-center'>Easy Share Drive</h1>
        {isAuthenticated ? <SignOutButton /> : <SignInButton />}
      </nav>
      <main className='flex flex-col justify-center items-center mt-4 h-full'>
        {props.children}
      </main>
    </>
  );
};

export default Layout;
