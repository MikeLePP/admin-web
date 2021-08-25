import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, Divider, FormHelperText, TextField, Typography } from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import useMounted from '../../../hooks/useMounted';

const LoginAmplify: FC = (props) => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const { signInWithEmailAndPassword, signInWithGoogle } = useAuth() as any;

  const handleGoogleClick = async (): Promise<void> => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div {...props}>
      <Button
        fullWidth
        onClick={handleGoogleClick}
        size="large"
        sx={{
          backgroundColor: 'common.white',
          color: 'common.black',
          '&:hover': {
            backgroundColor: 'common.white',
            color: 'common.black',
          },
        }}
        variant="contained"
      >
        <Box alt="Google" component="img" src="/static/icons/google.svg" sx={{ mr: 1 }} />
        Google
      </Button>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          mt: 2,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Divider orientation="horizontal" />
        </Box>
        <Typography color="textSecondary" sx={{ m: 2 }} variant="body1">
          OR
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Divider orientation="horizontal" />
        </Box>
      </Box>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
          try {
            const user = await signInWithEmailAndPassword(values.email, values.password);
            if (mounted.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
              navigate('/authentication/password-change', {
                state: {
                  firstTimeLogin: true,
                  username: values.email,
                  password: values.password,
                },
              });
            }
          } catch (err) {
            console.error(err);

            if (err.code === 'UserNotConfirmedException') {
              navigate('/authentication/verify-code', {
                state: {
                  username: values.email,
                },
              });
              return;
            }

            if (mounted.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              autoFocus
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.password && errors.password)}
              fullWidth
              helperText={touched.password && errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
              variant="outlined"
            />
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Log In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default LoginAmplify;
