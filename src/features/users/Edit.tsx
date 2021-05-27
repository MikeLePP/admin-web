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
import { User } from '../../types/user';

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
  const [user, setUser] = useState<User>({} as User);
  const [bankAccounts, setBankAccounts] = useState([] as BankAccount[]);
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
        history.push('/');
      } catch (err) {
        notify(err, 'error')
      }
    },
  });
  useEffect(() => {
    // get bank accounts with a immediately invoked function
    (async () => {
      const response = await callApi(`/users/${userId}/bank-accounts`);
      const mappingBankAccounts: BankAccount[] = (
        get(response, 'json.data', []) as { attributes: BankAccount; id: string }[]
      ).map((item) => ({
        bankAccountId: item.id,
        accountBsb: item.attributes.accountBsb,
        accountNumber: item.attributes.accountNumber,
        bankName: item.attributes.bankName,
        accountType: item.attributes.accountType,
        accountName: item.attributes.accountName,
      }));
      setBankAccounts(mappingBankAccounts);
    })()
      .then(() => null)
      .catch((err) => notify(err, 'error'));

    // get user info
    (async () => {
      const response = await callApi(`/users/${userId}`);
      const userResponse = get(response, 'json', {}) as User;
      setUser(userResponse);
      const mappingUserRecord: UserRecord = {
        firstName: userResponse.firstName,
        middleName: userResponse.middleName,
        lastName: userResponse.lastName,
        email: userResponse.email,
        mobileNumber: userResponse.mobileNumber,
        dob: moment(userResponse.dob).format('YYYY-MM-DD'),
        incomeFrequency: userResponse.incomeFrequency,
        incomeNextDate: moment(userResponse.incomeNextDate).format('YYYY-MM-DD'),
        bankAccountId: userResponse.bankAccountId,
      };
      mappingUserRecord.dob = moment(mappingUserRecord.dob).format('YYYY-MM-DD');
      setUserRecord(mappingUserRecord);
    })()
      .then(() => null)
      .catch((err) => notify(err, 'error'));
  }, [userId]);
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
              defaultValue={formik.values.incomeFrequency}
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
                          </div>
                        }
                        secondary={`[BSB: ${account.accountBsb || '-'} ACC: ${
                          account.accountNumber || '-'
                        }] ${account.accountName}`}
                      />
                    </ListItem>,
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
