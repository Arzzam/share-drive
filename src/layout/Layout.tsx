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
      <nav className='bg-[#2886de] py-2 px-8 flex flex-row justify-between w-full'>
        <h1 className='self-center text-white font-semibold text-lg'>
          Share Drive
        </h1>
        {isAuthenticated ? <SignOutButton /> : <SignInButton />}
      </nav>
      <main className='p-8 flex flex-col justify-center items-center h-full'>
        {props.children}
      </main>
    </>
  );
};

export default Layout;
