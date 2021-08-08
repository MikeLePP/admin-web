import { Divider } from '@material-ui/core';
import { lowerCase, upperFirst } from 'lodash';
import {
  DateField,
  FunctionField,
  NumberField,
  Record,
  ResourceComponentPropsWithId,
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin';
import ShowToolbar from '../../components/ShowToolbar';

const TransactionShow = (props: ResourceComponentPropsWithId): JSX.Element => (
  <Show {...props} actions={<ShowToolbar deleteCustomLabel="Cancel" />}>
    <SimpleShowLayout>
      <TextField label="First name" source="firstName" />
      <TextField label="Middle name" source="middleName" />
      <TextField label="Last name" source="lastName" />
      <TextField label="Email" source="email" />
      <TextField label="Mobile" source="mobileNumber" />
      <Divider />

      <FunctionField
        label="Status"
        render={(record?: Record) => record && upperFirst(lowerCase(record.status))}
      />
      <TextField label="Status reason" source="statusReason" />
      <TextField label="Payment type" source="paymentType" />
      <NumberField label="Amount" source="amount" />
      <NumberField label="Fee" source="amountFee" />
      <TextField label="Description" source="description" />
      <TextField label="Debit from" source="source" />
      <TextField label="Debit from ID" source="sourceId" />
      <DateField label="Submit on" source="submitAt" showTime options={{ hour12: true }} />
      <Divider />
      <TextField label="Send to" source="destination" />
      <TextField label="Send to ID" source="destinationId" />
    </SimpleShowLayout>
  </Show>
);

export default TransactionShow;
