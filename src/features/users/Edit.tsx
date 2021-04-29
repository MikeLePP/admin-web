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
} from 'react-admin';
import { Divider } from '@material-ui/core';
import Toolbar from '../../components/SaveToolbar';
import { notifyOnFailure } from '../../helpers/notify';
import { futureDate, pastDate, phone } from '../../helpers/validation';
import EditToolbar from '../../components/EditToolbar';
import incomeFrequencies from '../../constants/incomeFrequencies';

export default (props: any) => {
  const notify = useNotify();

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
        <TextInput label="Bank Name" source="bankAccount.bankName" />
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
        />
      </SimpleForm>
    </Edit>
  );
};
