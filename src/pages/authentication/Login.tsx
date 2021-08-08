import { useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Card, CardContent, Container, Divider, Link, Typography } from '@material-ui/core';
import { LoginAmplify, LoginAuth0, LoginFirebase, LoginJWT } from '../../components/authentication/login';
import Logo from '../../components/Logo';
import useAuth from '../../hooks/useAuth';
import gtm from '../../lib/gtm';

const Login: FC = () => {
  const { platform } = useAuth() as any;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | Material Kit Pro</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="sm" sx={{ py: '80px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 8,
            }}
          >
            <RouterLink to="/">
              <Logo
                sx={{
                  height: 40,
                  width: 40,
                }}
              />
            </RouterLink>
          </Box>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 4,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <div>
                  <Typography color="textPrimary" gutterBottom variant="h4">
                    Log in
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Log in to PressPay admin portal.
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                {platform === 'Amplify' && <LoginAmplify />}
                {platform === 'Auth0' && <LoginAuth0 />}
                {platform === 'Firebase' && <LoginFirebase />}
                {platform === 'JWT' && <LoginJWT />}
              </Box>
              <Divider sx={{ my: 3 }} />
              {platform === 'Amplify' && (
                <Link
                  color="textSecondary"
                  component={RouterLink}
                  sx={{ mt: 1 }}
                  to="/authentication/password-recovery"
                  variant="body2"
                >
                  Forgot password
                </Link>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
