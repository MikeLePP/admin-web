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
  ResourceComponentPropsWithId,
  SimpleForm,
  TextField,
  TextInput,
  useEditController,
  useGetIdentity,
  useNotify,
  Record,
} from 'react-admin';
import EditToolbar from '../../components/EditToolbar';
import SaveToolbar from '../../components/SaveToolbar';
import { notifyOnFailure } from '../../helpers/notify';
import { getFullName } from '../../helpers/string';
import { getId } from '../../helpers/url';
import { futureDate } from '../../helpers/validation';

type TMyPropsType = {
  status: string;
  id: string;
};

const TransactionEdit = (props: ResourceComponentPropsWithId): JSX.Element | null => {
  const userId = getId(props.location?.search);

  const { identity } = useGetIdentity();
  const notify = useNotify();
  const { record } = useEditController(props);

  if (!userId) {
    props.history?.push(props.basePath!);
    return null;
  }

  const transform = (data: Record) => ({ ...data, userId, editedBy: identity?.id });

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
        <FunctionField label="Name" render={getFullName} />
        <TextField label="Email" source="email" />
        <TextField label="Mobile" source="mobileNumber" />
        <Divider />
        <FunctionField<TMyPropsType>
          label="Status"
          render={(v: TMyPropsType | undefined) => capitalize(lowerCase(v ? v.status : ''))}
        />

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

export default TransactionEdit;
