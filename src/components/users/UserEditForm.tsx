import {
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { Formik } from 'formik';
import { startCase } from 'lodash';
import moment from 'moment';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import incomeFrequencies from '../../constants/incomeFrequencies';
import { formatBankAccount } from '../../helpers/bankAccount';
import { useBankAccount } from '../../hooks/useBankAccount';
import { updateUser } from '../../slices/user';
import { useDispatch } from '../../store';
import type { User } from '../../types/users';

interface UserEditFormProps {
  user: User;
  userId: string;
}

const UserEditForm: FC<UserEditFormProps> = (props) => {
  const { user, userId, ...other } = props;
  const dispatch = useDispatch();
  const { bankAccounts } = useBankAccount(user?.id);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <Formik
      initialValues={{
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        dob: moment(user.dob).format('YYYY-MM-DD'),
        incomeFrequency: user.incomeFrequency,
        incomeNextDate: moment(user.incomeNextDate).format('YYYY-MM-DD'),
        bankAccountId: user.bankAccountId,
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().max(255).required('First name is required'),
        middleName: Yup.string().max(255),
        lastName: Yup.string().max(255).required('Last name is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        mobileNumber: Yup.string()
          .matches(/^\+61[0-9]{9}$/, 'Please enter a valid phone number')
          .required(),
        dob: Yup.date().required(),
        incomeFrequency: Yup.string(),
        incomeNextDate: Yup.date().min(new Date(), 'Please select a future date').required(),
        bankAccountId: Yup.string(),
      })}
      onSubmit={(values, { setStatus, setSubmitting }): void => {
        dispatch(
          updateUser({
            userId,
            user: values,
            onComplete: (result) => {
              if (result && result.success) {
                setStatus({ success: true });
                navigate(`/management/users/${userId}/details`);
                toast.success('User updated');
              } else {
                setStatus({ success: false });
              }

              setSubmitting(false);
            },
          }),
        );
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
        <form onSubmit={handleSubmit} {...other}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.firstName && errors.firstName)}
                    fullWidth
                    helperText={touched.firstName && errors.firstName}
                    label="First name"
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.firstName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={Boolean(touched.middleName && errors.middleName)}
                    helperText={touched.middleName && errors.middleName}
                    label="Middle name"
                    name="middleName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.middleName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.lastName && errors.lastName)}
                    fullWidth
                    helperText={touched.lastName && errors.lastName}
                    label="Last name"
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.lastName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.mobileNumber && errors.mobileNumber)}
                    fullWidth
                    helperText={touched.mobileNumber && errors.mobileNumber}
                    label="Mobile number"
                    name="mobileNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.mobileNumber}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    type="date"
                    error={Boolean(touched.dob && errors.dob)}
                    fullWidth
                    helperText={touched.dob && errors.dob}
                    label="Date of birth"
                    name="dob"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.dob}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth={true}>
                    <InputLabel htmlFor="uncontrolled-native">Pay frequency</InputLabel>
                    <Select
                      fullWidth
                      defaultValue={values.incomeFrequency}
                      value={values.incomeFrequency}
                      name="incomeFrequency"
                      onChange={handleChange}
                    >
                      {incomeFrequencies.map(({ id, name }) => (
                        <MenuItem value={id}>{name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    type="date"
                    error={Boolean(touched.incomeNextDate && errors.incomeNextDate)}
                    fullWidth
                    helperText={touched.incomeNextDate && errors.incomeNextDate}
                    label="Next pay date"
                    name="incomeNextDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.incomeNextDate}
                    variant="outlined"
                  />
                </Grid>
                {bankAccounts.length > 0 && (
                  <Grid item md={6} xs={12}>
                    <InputLabel htmlFor="uncontrolled-native">Primary bank account</InputLabel>
                    <RadioGroup
                      defaultValue={values.bankAccountId}
                      value={values.bankAccountId}
                      onChange={handleChange}
                      name="bankAccountId"
                      sx={{ flexDirection: 'row' }}
                    >
                      {bankAccounts.map((bankAccount) => (
                        <FormControlLabel
                          control={<Radio color="primary" sx={{ ml: 1 }} />}
                          key={bankAccount.id}
                          label={
                            <div>
                              <div className="flex">
                                <Typography className="mr-2">{startCase(bankAccount.accountType)}</Typography>
                                {values.bankAccountId === bankAccount.id && (
                                  <Chip variant="outlined" color="secondary" size="small" label="Primary account" />
                                )}
                              </div>
                              <Typography>{formatBankAccount(bankAccount)}</Typography>
                            </div>
                          }
                          value={bankAccount.id}
                        />
                      ))}
                    </RadioGroup>
                  </Grid>
                )}
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button color="primary" disabled={isSubmitting} type="submit" variant="contained">
                  Update
                </Button>
                <Button disabled={isSubmitting} href={`/management/users/${userId}/details`}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default UserEditForm;
