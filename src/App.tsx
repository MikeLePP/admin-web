import * as history from 'history';
import { Admin, Resource } from 'react-admin';
import { useAuthProvider } from './authProvider';
import dataProvider from './dataProvider';
import LoginPage from './features/login-page';
import transactions from './features/transactions';
import users from './features/users';
import userOnboarding from './features/user-onboarding';

const browserHistory = history.createBrowserHistory();

const App: React.FC = () => {
  const authProvider = useAuthProvider();
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      history={browserHistory}
    >
      <Resource {...users} />
      <Resource {...transactions} />
      <Resource {...userOnboarding} />
    </Admin>
  );
};

export default App;
