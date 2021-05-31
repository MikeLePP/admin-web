import React, { ChangeEvent, useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import {
  useNotify,
  ResourceComponentPropsWithId,
  ListButton,
  ShowButton,
  TopToolbar,
} from 'react-admin';
import {
  Chip,
  List,
  ListItem,
  Radio,
  ListItemText,
  Typography,
  InputLabel,
  FormControl,
  NativeSelect,
  Button,
  Box,
} from '@material-ui/core';
import { ArrowBack as BackIcon } from '@material-ui/icons';
import SaveIcon from '@material-ui/icons/Save';
import { get, map, startCase } from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';

import InputField from '../../components/InputField';
import incomeFrequencies from '../../constants/incomeFrequencies';
import { callApi } from '../../helpers/api';
import { BankAccount } from '../../types/bank-account';
import { useUser, useBankAccount } from './userHook';

const validationSchema = yup.object({
  firstName: yup.string().required(),
  middleName: yup.string(),
  lastName: yup.string().required(),
  email: yup.string().required(),
  mobileNumber: yup
    .string()
    .matches(/^\+61[0-9]{9}$/, 'Please enter a valid phone number')
    .required(),
  dob: yup.date().max(new Date(), 'Please select an earlier date').required(),
  incomeFrequency: yup.string(),
  incomeNextDate: yup.date().min(new Date(), 'Please select a future date').required(),
  bankAccountId: yup.string(),
});

interface UserRecord extends Record<string, unknown> {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dob: string;
  incomeFrequency?: string;
  incomeNextDate?: string;
  bankAccountId: string;
}

interface CustomEditToolbarProps {
  basePath: string;
  id: string;
}

const CustomEditToolbar = ({ basePath, id }: CustomEditToolbarProps): JSX.Element => {
  const showPath = `${basePath}/${id}/show`;
  return (
    <TopToolbar>
      <ListButton icon={<BackIcon />} />
      <Box display="flex" flexGrow={1} />
      <ShowButton basePath={basePath} to={showPath} />
    </TopToolbar>
  );
};

const UserEdit = (props: ResourceComponentPropsWithId): JSX.Element | null => {
  const notify = useNotify();
  const history = useHistory();
  const userId = get(props, 'id', '');
  const { user } = useUser(userId);
  const { bankAccounts } = useBankAccount(userId);
  const [userRecord, setUserRecord] = useState({} as UserRecord);
  const [updating, setUpdating] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userRecord,
    validationSchema,
    onSubmit: async (_values) => {
      const userUpdated = {
        ...user,
        ..._values,
      };
      try {
        await callApi(`/users/${userId}`, 'put', userUpdated);
        history.push(`${props.basePath || ''}/${userId}/show`);
      } catch (err) {
        notify(err, 'error');
      }
    },
  });
  useEffect(() => {
    if (user.id) {
      const mappingUserRecord: UserRecord = {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        dob: moment(user.dob).format('YYYY-MM-DD'),
        incomeFrequency: user.incomeFrequency,
        incomeNextDate: moment(user.incomeNextDate).format('YYYY-MM-DD'),
        bankAccountId: user.bankAccountId,
      };
      mappingUserRecord.dob = moment(mappingUserRecord.dob).format('YYYY-MM-DD');
      setUserRecord(mappingUserRecord);
    }
  }, [user]);

  useEffect(() => {
    if (bankAccounts.length === 1 && user.id && !user.bankAccountId) {
      setUpdating(true);
      // need confirm!!!!
      setUserRecord((currentUserRecord: UserRecord) => ({
        ...currentUserRecord,
        bankAccountId: bankAccounts[0].bankAccountId,
      }));
    }
  }, [bankAccounts, user, setUserRecord]);
  const handleChangeField =
    (type: string) => async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      await formik.setFieldValue(type, value);
      setUpdating(true);
    };
  const handleChangeIncomeFrequency = async (e: ChangeEvent<HTMLSelectElement>) => {
    await formik.setFieldValue('incomeFrequency', e.target.value);
    setUpdating(true);
  };
  const updateBankAccountId = (account: BankAccount) => async () => {
    setUpdating(true);
    await formik.setFieldValue('bankAccountId', account.bankAccountId);
  };
  const handleCancel = () => {
    history.goBack();
  };
  if (!props.basePath || !userId) {
    return null;
  }

  return (
    <div>
      <CustomEditToolbar basePath={props.basePath} id={userId} />
      <form className="border border-gray-100 bg-white" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col bg-white p-4">
          <InputField
            className="w-64 my-2.5"
            required
            name="firstName"
            label="First name"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.firstName,
            }}
            onChange={handleChangeField('firstName')}
          />
          <InputField
            className="w-64 my-2.5"
            name="middleName"
            label="Middle name"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.middleName,
            }}
            onChange={handleChangeField('middleName')}
          />
          <InputField
            className="w-64 my-2.5"
            required
            name="lastName"
            label="Last name"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.lastName,
            }}
            onChange={handleChangeField('lastName')}
          />
          <InputField
            className="w-64 my-2.5"
            required
            name="email"
            label="Email"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.email,
            }}
            onChange={handleChangeField('email')}
          />
          <InputField
            className="w-64 my-2.5"
            required
            name="mobileNumber"
            label="Mobile number"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.mobileNumber,
            }}
            onChange={handleChangeField('mobileNumber')}
          />
          <InputField
            className="w-64 my-2.5"
            required
            type="date"
            name="dob"
            label="Date of birth"
            formik={formik}
            variant="standard"
            onChange={handleChangeField('dob')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth={false} className="w-64 my-2.5">
            <InputLabel htmlFor="uncontrolled-native">Pay frequency</InputLabel>
            <NativeSelect
              value={formik.values.incomeFrequency}
              inputProps={{
                name: 'name',
                id: 'uncontrolled-native',
              }}
              onChange={handleChangeIncomeFrequency}
            >
              {incomeFrequencies.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <InputField
            className="w-64 my-2.5"
            type="date"
            name="incomeNextDate"
            label="Next pay date"
            formik={formik}
            variant="standard"
            onChange={handleChangeField('incomeNextDate')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {bankAccounts.length > 0 && (
            <>
              <Typography>Primary Bank Account</Typography>
              <List>
                {map(bankAccounts, (account) =>
                  React.cloneElement(
                    <React.Fragment key={account.bankAccountId}>
                      <ListItem key={account.bankAccountId}>
                        <Radio
                          required
                          name="primaryAccountId"
                          checked={
                            formik.values.bankAccountId === account.bankAccountId ||
                            bankAccounts.length === 1
                          }
                          onChange={updateBankAccountId(account)}
                        />
                        <ListItemText
                          primary={
                            <div className="flex">
                              <Typography className="mr-2">
                                {startCase(account.accountType)}
                              </Typography>
                              {formik.values.bankAccountId === account.bankAccountId && (
                                <Chip
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  label="Primary account"
                                />
                              )}
                            </div>
                          }
                          secondary={`[BSB: ${account.accountBsb || '-'} ACC: ${
                            account.accountNumber || '-'
                          }] ${account?.accountName || '-'}`}
                        />
                      </ListItem>
                      {formik.values.bankAccountId === account.bankAccountId &&
                        account.accountType !== 'transaction' && (
                          <Typography color="error" className="ml-4 pl-10">
                            Primary account is not a transaction account type.
                            <br />
                            Are you sure that direct debits may be made to this account?
                            <br />
                            WARNING THIS IS NOT COMMON, SEEK MANAGEMENT APPROVAL.
                          </Typography>
                        )}
                    </React.Fragment>,
                  ),
                )}
              </List>
            </>
          )}
        </div>
        <Box className="p-4 bg-gray-100 flex relative items-center	">
          <Button
            color="primary"
            variant="contained"
            type="submit"
            startIcon={<SaveIcon />}
            disabled={!updating}
          >
            Save
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Box>
      </form>
    </div>
  );
};

export default UserEdit;
