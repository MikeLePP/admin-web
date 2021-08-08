import React from 'react';
import { useLogin } from 'react-admin';
import { Button, Box } from '@material-ui/core';

const LoginForm = (): JSX.Element => {
  const login = useLogin();
  const handleLogin = () => login({ federated: true, provider: 'COGNITO' });
  return (
    <Button variant="contained" color="primary" size="large" onClick={handleLogin}>
      Login
    </Button>
  );
};

const LoginPage = (): JSX.Element => (
  <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
    <LoginForm />
  </Box>
);

export default LoginPage;
