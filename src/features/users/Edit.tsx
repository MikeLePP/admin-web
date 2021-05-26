import { useEffect, useState } from 'react';
import {
  Edit,
  DateInput,
  SimpleForm,
  TextInput,
  required,
  email,
  useNotify,
  SelectInput,
  ResourceComponentPropsWithId,
  RadioButtonGroupInput,
} from 'react-admin';
import {
  Divider,
  makeStyles,
  MenuItem,
  List,
  ListItem,
  Radio,
  ListItemText,
  Typography,
  TextField,
} from '@material-ui/core';
import InputField from '../../components/InputField';
import TextLabel from '../../components/TextLabel';
import { get, map, startCase } from 'lodash';
import Toolbar from '../../components/SaveToolbar';
import { notifyOnFailure } from '../../helpers/notify';
import { futureDate, pastDate, phone } from '../../helpers/validation';
import EditToolbar from '../../components/EditToolbar';
import incomeFrequencies from '../../constants/incomeFrequencies';
import { callApi } from '../../helpers/api';
import { BankAccount } from '../../types/bankAccount';
import { User } from '../../types/user';
import { useFormik, FormikValues } from 'formik';
import * as yup from 'yup';
import moment from "moment";

const useStyles = makeStyles(() => ({
  select: {
    '& #bankAccountId': {
      whiteSpace: 'unset !important',
    },
  },
  inputField: {
    width: 256,
    marginTop: 10,
    marginBottom: 10,
  },
  formContainer: {
    background: 'white',
    padding: 16,
    border: '1px solid #e5e7eb',
  },
}));

const validationSchema = yup.object({
  firstName: yup.string().required(),
  middleName: yup.string(),
  lastName: yup.string().required(),
  email: yup.string().required(),
  mobileNumber: yup.string().required(),
  dob: yup.date().required(),
  incomeFrequency: yup.string(),
  incomeNextDate: yup.date().required(),
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

const UserEdit = (props: ResourceComponentPropsWithId): JSX.Element | null => {
  const notify = useNotify();
  const classes = useStyles();
  const userId = props.id;
  const [bankAccounts, setBankAccounts] = useState([] as BankAccount[]);
  const [userRecord, setUserRecord] = useState({} as UserRecord);

  useEffect(() => {
    // get bank accounts with a immediately invoked function
    (async () => {
      const response = await callApi(`/users/${userId || ''}/bank-accounts`);
      const mappingbankAccounts: BankAccount[] = (
        get(response, 'json.data', []) as { attributes: BankAccount; id: string }[]
      ).map((item) => ({
        bankAccountId: item.id,
        accountBsb: item.attributes.accountBsb,
        accountNumber: item.attributes.accountNumber,
        bankName: item.attributes.bankName,
        accountType: item.attributes.accountType,
        accountName: item.attributes.accountName,
      }));
      setBankAccounts(mappingbankAccounts);
    })()
      .then(() => null)
      .catch((err) => new Error(err));

    // get user info
    (async () => {
      const response = await callApi(`/users/${userId || ''}`);
      const user: User = get(response, 'json', {}) as User;
      const {
        firstName,
        middleName,
        lastName,
        email,
        mobileNumber,
        dob,
        incomeFrequency,
        incomeNextDate,
        bankAccountId,
      } = user;
      const mappingUserRecord: UserRecord = {
        firstName,
        middleName,
        lastName,
        email,
        mobileNumber,
        dob,
        incomeFrequency,
        incomeNextDate,
        bankAccountId,
      };
      mappingUserRecord.dob = moment(mappingUserRecord.dob).format("YYYY-MM-DD");
      setUserRecord(mappingUserRecord);
    })()
      .then(() => null)
      .catch((err) => new Error(err));
  }, [userId]);

  if (!props.basePath || !userId) {
    return null;
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userRecord,
    validationSchema,
    onSubmit: async (_values) => {},
  });
  return (
    <div>
      <EditToolbar />
      <div className={classes.formContainer}>
        <form className="flex flex-col" onSubmit={formik.handleSubmit}>
          <InputField
            className={classes.inputField}
            required
            name="firstName"
            label="First name"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.firstName,
            }}
          />
          <InputField
            className={classes.inputField}
            required
            name="middleName"
            label="Middle name"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.middleName,
            }}
          />
          <InputField
            className={classes.inputField}
            required
            name="lastName"
            label="Last name"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.lastName,
            }}
          />
          <InputField
            className={classes.inputField}
            required
            name="email"
            label="Email"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.email,
            }}
          />
          <InputField
            className={classes.inputField}
            required
            name="mobileNumber"
            label="Mobile number"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.mobileNumber,
            }}
          />
          <InputField
            className={classes.inputField}
            required
            type="date"
            name="dob"
            label="Date of birth"
            formik={formik}
            variant="standard"
            onChange={event => console.log(event.target.value)}
            InputLabelProps={{
              shrink: !!formik.values.dob,
            }}
          />
          <InputField
            select
            className={classes.inputField}
            name="incomeFrequency"
            label="Pay frequency"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.incomeFrequency,
            }}
          >
            {incomeFrequencies.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </InputField>
          <InputField
            className={classes.inputField}
            required
            type="date"
            name="incomeNextDate"
            label="Next pay date"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.incomeNextDate,
            }}
          />
          <Typography>Primary Bank Account</Typography>
          <List>
            {map(bankAccounts, (account) => (
              <>
                <ListItem key={account.bankAccountId}>
                  <Radio
                    required
                    name="primaryAccountId"
                    // checked={
                    //   formik.values['bankAccountId'] === account.bankAccountId || bankAccounts.length === 1
                    // }
                    onChange={() => formik.setFieldValue('bankAccountId', account.bankAccountId)}
                  />
                  <ListItemText
                    primary={
                      <div className="flex">
                        <Typography className="mr-2">{startCase(account.accountType)}</Typography>
                      </div>
                    }
                    secondary={`[BSB: ${account.accountBsb || '-'} ACC: ${
                      account.accountNumber || '-'
                    }] ${account.accountName}`}
                  />
                </ListItem>
              </>
            ))}
          </List>
        </form>
      </div>
    </div>
  );
  return (
    <Edit
      {...props}
      title="Edit User"
      onFailure={notifyOnFailure(notify)}
      mutationMode="pessimistic"
      actions={<EditToolbar />}
    >
      <SimpleForm redirect="list" toolbar={<Toolbar />}>
        <TextInput label="First name" source="firstName" validate={[required()]} autoFocus />
        <TextInput label="Middle name" source="middleName" />
        <TextInput label="Last name" source="lastName" validate={[required()]} />
        <TextInput
          label="Email"
          source="email"
          validate={[required(), email('Please enter a valid email address')]}
        />
        <TextInput label="Mobile number" source="mobileNumber" validate={[required(), phone()]} />
        <DateInput label="Date of birth" source="dob" validate={[required(), pastDate()]} />
        <SelectInput label="Pay frequency" source="incomeFrequency" choices={incomeFrequencies} />
        <DateInput label="Next pay date" source="incomeNextDate" validate={[futureDate()]} />

        <Divider />
        <RadioButtonGroupInput
          children={<div>ewdwqiew owieweiwoiewew</div>}
          label="Bank accounts"
          source="bankAccountId"
          row={false}
          optionValue="bankAccountId"
          choices={bankAccounts}
        />
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
