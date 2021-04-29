import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  ResourceComponentPropsWithId,
} from 'react-admin';
import ShowToolbar from '../../components/ShowToolbar';

export default (props: ResourceComponentPropsWithId): JSX.Element => (
  <Show {...props} actions={<ShowToolbar />}>
    <SimpleShowLayout>
      <TextField label="First name" source="firstName" />
      <TextField label="Middle name" source="middleName" />
      <TextField label="Last name" source="lastName" />
      <TextField label="Email" source="email" />
      <TextField label="Mobile number" source="mobileNumber" />
      <DateField label="Date of birth" source="dob" />
      <TextField label="Identity verified" source="identity.verified" />
      <TextField label="Pay frequency" source="incomeFrequency" />
      <DateField label="Next pay date" source="incomeNextDate" />
      <TextField label="Bank name" source="bankAccount.bankName" />
      <TextField label="Account BSB" source="bankAccount.accountBsb" />
      <TextField label="Account number" source="bankAccount.accountNumber" />
      <NumberField label="Current balance" source="balanceCurrent" />
    </SimpleShowLayout>
  </Show>
);
