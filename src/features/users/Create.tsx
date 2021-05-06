import { Divider } from '@material-ui/core';
import {
  Create,
  DateInput,
  email,
  maxLength,
  minLength,
  number,
  required,
  ResourceComponentProps,
  SimpleForm,
  TextInput,
  useNotify,
} from 'react-admin';
import Toolbar from '../../components/SaveToolbar';
import { notifyOnFailure } from '../../helpers/notify';
import { pastDate, phone } from '../../helpers/validation';

const UserCreate = (props: ResourceComponentProps): JSX.Element => {
  const notify = useNotify();
  return (
    <Create {...props} onFailure={notifyOnFailure(notify)}>
      <SimpleForm redirect="list" toolbar={<Toolbar saveButtonLabel="Create" />}>
        <TextInput label="First name" source="firstName" validate={[required()]} autoFocus />
        <TextInput label="Middle name" source="middleName" />
        <TextInput label="Last name" source="lastName" validate={[required()]} />
        <TextInput
          label="Email"
          source="email"
          validate={[required(), email('Please enter a valid email address')]}
        />
        <TextInput label="Mobile" source="mobileNumber" validate={[required(), phone()]} />
        <DateInput label="Date of birth" source="dob" validate={[required(), pastDate()]} />
        <Divider />
        <TextInput label="Bank Name" source="bankName" />
        <TextInput
          label="Account BSB"
          source="accountBsb"
          validate={[
            required(),
            number('Please enter a valid BSB number'),
            minLength(6),
            maxLength(6),
          ]}
        />
        <TextInput
          label="Account number"
          source="accountNumber"
          validate={[required(), number('Please enter a valid account number'), maxLength(9)]}
        />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
