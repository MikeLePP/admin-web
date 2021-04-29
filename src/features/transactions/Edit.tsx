import { Divider } from '@material-ui/core';
import { capitalize, lowerCase } from 'lodash';
import {
  DateTimeInput,
  Edit,
  FunctionField,
  maxLength,
  maxValue,
  NumberInput,
  RadioButtonGroupInput,
  required,
  SimpleForm,
  TextField,
  TextInput,
  useEditController,
  useGetIdentity,
  useNotify,
} from 'react-admin';
import SaveToolbar from '../../components/SaveToolbar';
import EditToolbar from '../../components/EditToolbar';
import { notifyOnFailure } from '../../helpers/notify';
import { getFullname } from '../../helpers/string';
import { getId } from '../../helpers/url';
import { futureDate } from '../../helpers/validation';

export default (props: Record<string, unknown>): JSX.Element => {
  const userId = getId(props.location.search);
  if (!userId) return props.history.push(props.basePath) as Record<string, unknown>;

  const { identity } = useGetIdentity();
  const notify = useNotify();
  const { record } = useEditController(props);

  const transform = (data: any) =>
    ({ ...data, userId, editedBy: identity?.id } as Record<string, unknown>);

  const disabled = record?.status !== 'pending_submission';

  return (
    <Edit
      {...props}
      title="Edit Transaction"
      onFailure={notifyOnFailure(notify)}
      transform={transform}
      mutationMode="pessimistic"
      actions={<EditToolbar />}
    >
      <SimpleForm redirect="show" toolbar={<SaveToolbar />}>
        <FunctionField label="Name" render={getFullname} />
        <TextField label="Email" source="email" />
        <TextField label="Mobile" source="mobileNumber" />
        <Divider />
        <FunctionField label="Status" render={(v: any) => capitalize(lowerCase(v.status))} />

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
          disabled={disabled}
        />
        <NumberInput
          type="number"
          label="Fee"
          source="amountFee"
          min={0}
          max={100}
          autoFocus
          validate={[required(), maxValue(100)]}
          disabled={disabled}
        />
        <TextInput
          label="Description"
          source="description"
          helperText="What happened?"
          multiline
          rows={4}
          validate={[required(), maxLength(500)]}
          disabled={disabled}
        />
        <TextInput label="Debit from" source="source" validate={[required()]} disabled={disabled} />
        <TextInput label="Debit from ID" source="sourceId" validate={[required()]} disabled />
        <DateTimeInput
          label="Submit on"
          source="submitAt"
          validate={[required(), futureDate()]}
          disabled={disabled}
        />
        <Divider />

        <TextInput label="Send to" source="destination" disabled />
        <TextInput label="Send to ID" source="destinationId" disabled />
      </SimpleForm>
    </Edit>
  );
};
