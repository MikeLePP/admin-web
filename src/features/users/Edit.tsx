import { useEffect, useState } from 'react';
import {
  Edit,
  DateInput,
  SimpleForm,
  TextInput,
  required,
  email,
  minLength,
  maxLength,
  number,
  useNotify,
  SelectInput,
  ResourceComponentPropsWithId,
} from 'react-admin';
import { Divider } from '@material-ui/core';
import { get } from 'lodash';
import Toolbar from '../../components/SaveToolbar';
import { notifyOnFailure } from '../../helpers/notify';
import { futureDate, pastDate, phone } from '../../helpers/validation';
import EditToolbar from '../../components/EditToolbar';
import incomeFrequencies from '../../constants/incomeFrequencies';
import { callApi } from '../../helpers/api';
import { getId } from '../../helpers/url';
import { BankAccount } from '../../types/bankAccount';

const UserEdit = (props: ResourceComponentPropsWithId): JSX.Element | null => {
  const notify = useNotify();
  const userId = getId(props.id);
  const [bankAccounts, setBankAccounts] = useState([] as BankAccount[]);

  useEffect(() => {
    // get bank accounts with a immediately invoked function
    (async () => {
      try {
        const response = await callApi(`/users/${userId || ''}/bank-accounts`);
        const mappingbankAccounts: BankAccount[] = (
          get(response, 'json.data', []) as { attributes: BankAccount; id: string }[]
        ).map((item) => ({
          bankAccountId: item.id,
          accountBsb: item.attributes.accountBsb,
          accountNumber: item.attributes.accountNumber,
          bankName: item.attributes.bankName,
        }));
        setBankAccounts(mappingbankAccounts);
      } catch (error) {
        console.log('🚀 ~ file: Edit.tsx ~ line 36 ~ error', error);
      }
    })()
      .then(() => null)
      .catch((err) => new Error(err));
  }, []);

  if (!props.basePath || !userId) {
    return null;
  }

  const optionRenderer = (choiceBankAccount: BankAccount) =>
    `BN: ${choiceBankAccount.bankName} | BSB: ${choiceBankAccount.accountBsb} | ACC: ${choiceBankAccount.accountNumber}`;

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
        <SelectInput
          label="Bank accounts"
          source="primaryBankAccountId"
          choices={bankAccounts}
          optionText={optionRenderer}
          optionValue="bankAccountId"
          validate={[required()]}
        />
        {/* <TextInput label="Bank Name" source="bankAccount.bankName" />
        <TextInput
          label="Account BSB"
          source="bankAccount.accountBsb"
          validate={[
            required(),
            number('Please enter a valid BSB number'),
            minLength(6),
            maxLength(6),
          ]}
        />
        <TextInput
          label="Account number"
          source="bankAccount.accountNumber"
          validate={[required(), number('Please enter a valid account number'), maxLength(9)]}
        /> */}
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
