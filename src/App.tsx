import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import Layout from './layout/Layout';
import UploadPage from './components/UploadPage';

const App = () => {
  return (
    <div className='p-7'>
      <Layout>
        <AuthenticatedTemplate>
          <UploadPage />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <p>Please sign-in to upload files to your drive.</p>
        </UnauthenticatedTemplate>
      </Layout>
    </div>
  );
};

export default App;
