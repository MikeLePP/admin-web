import { Box, Button, FormHelperText, TextField } from '@material-ui/core';
import { Formik } from 'formik';
import type { Location } from 'history';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useAuth from '../../../hooks/useAuth';
import useMounted from '../../../hooks/useMounted';

interface LocationState {
  username?: string;
  password?: string;
  firstTimeLogin?: boolean;
}

const PasswordChangeAmplify: FC = () => {
  const mounted = useMounted();
  const { passwordChange, passwordComplete } = useAuth() as any;
  const location = useLocation() as Location<LocationState>;
  const navigate = useNavigate();
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 6);
  }, []);

  return (
    <Formik
      initialValues={{
        email: location.state?.username || '',
        existingPassword: location.state?.password || '',
        password: '',
        passwordConfirm: '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        existingPassword: Yup.string().min(7, 'Must be at least 7 characters').max(255).required('Required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().min(7, 'Must be at least 7 characters').max(255).required('Required'),
        passwordConfirm: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Required'),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        try {
          const { firstTimeLogin } = location.state;
          const { email, existingPassword, password } = values;
          if (firstTimeLogin) {
            await passwordComplete(email, existingPassword, password);
          } else {
            await passwordChange(email, existingPassword, password);
          }
          navigate('/authentication/login');
        } catch (err) {
          console.error(err);
          if (mounted.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values,
      }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          {!location.state?.username ? (
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
          ) : (
            <TextField fullWidth margin="normal" value={location.state.username} variant="outlined" />
          )}
          <TextField
            error={Boolean(touched.existingPassword && errors.existingPassword)}
            fullWidth
            helperText={touched.existingPassword && errors.existingPassword}
            label="Existing Password"
            margin="normal"
            name="existingPassword"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.existingPassword}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="New Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
            fullWidth
            helperText={touched.passwordConfirm && errors.passwordConfirm}
            label="Password Confirmation"
            margin="normal"
            name="passwordConfirm"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.passwordConfirm}
            variant="outlined"
          />
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 3 }}>
            <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
              Update Password
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default PasswordChangeAmplify;
