import { Divider } from '@material-ui/core';
import {
  Create,
  DateTimeInput,
  Error,
  FunctionField,
  Loading,
  maxLength,
  maxValue,
  NumberInput,
  RadioButtonGroupInput,
  required,
  SimpleForm,
  TextField,
  TextInput,
  useGetIdentity,
  useGetOne,
  useNotify,
  ResourceComponentProps,
} from 'react-admin';
import Toolbar from '../../components/SaveToolbar';
import { notifyOnFailure } from '../../helpers/notify';
import { getFullname } from '../../helpers/string';
import { getId } from '../../helpers/url';
import { futureDate } from '../../helpers/validation';

export default (props: ResourceComponentProps): JSX.Element | null => {
  const userId = getId(props.location?.pathname);
  if (!userId) {
    props.history?.push(props.basePath!);
    return null;
  }

  const { data, loading, error } = useGetOne('users', userId);
  const { identity } = useGetIdentity();
  const notify = useNotify();

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!data) return null;

  const transform = (innerData: any) =>
    ({ ...innerData, userId, createdBy: identity?.id } as Record<string, unknown>);

  const destinationRecord = {
    destination: process.env.REACT_APP_TRANSACTION_DESTINATION_ACCOUNT,
    destinationId: process.env.REACT_APP_TRANSACTION_DESTINATION_ACCOUNT_ID,
  };

  return (
    <Create
      {...props}
      record={{
        ...data,
        ...destinationRecord,
      }}
      onFailure={notifyOnFailure(notify)}
      transform={transform}
    >
      <SimpleForm redirect="show" toolbar={<Toolbar saveButtonLabel="Create" />}>
        <FunctionField label="Name" render={getFullname} />
        <TextField label="Email" source="email" />
        <TextField label="Mobile" source="mobileNumber" />
        <Divider />

        <RadioButtonGroupInput
          label="Payment type"
          source="paymentType"
          defaultValue="debit"
          disabled
          choices={[
            { id: 'credit', name: 'Credit' },
            { id: 'debit', name: 'Debit' },
          ]}
        />
        <NumberInput
          type="tel"
          label="Amount"
          source="amount"
          min={0}
          max={100}
          autoFocus
          validate={[required(), maxValue(100)]}
        />
        <NumberInput
          type="number"
          label="Fee"
          source="amountFee"
          min={0}
          max={100}
          validate={[maxValue(100)]}
        />
        <TextInput
          label="Description"
          source="description"
          helperText="What happened?"
          multiline
          rows={4}
          validate={[required(), maxLength(500)]}
        />
        <TextInput
          label="Debit from"
          source="source"
          defaultValue={getFullname(data)}
          validate={[required()]}
        />
        <TextInput
          label="Debit from ID"
          source="sourceId"
          defaultValue={data.paymentAccountId}
          disabled
          validate={[required()]}
        />
        <DateTimeInput label="Submit on" source="submitAt" validate={[required(), futureDate()]} />
        <Divider />

        <TextInput label="Send to" source="destination" disabled />
        <TextInput label="Send to ID" source="destinationId" disabled />
      </SimpleForm>
    </Create>
  );
};
