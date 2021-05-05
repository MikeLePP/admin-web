/* eslint-disable no-underscore-dangle */
import { Divider } from '@material-ui/core';
import { ChangeEvent } from 'react';
import RA, {
  Create,
  DateInput,
  Error,
  FunctionField,
  Loading,
  NullableBooleanInput,
  NumberInput,
  required,
  ResourceComponentProps,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  useGetIdentity,
  useGetOne,
  useNotify,
} from 'react-admin';
import { useForm } from 'react-final-form';
import Checkbox from '../../components/Checkbox';
import SaveToolbar from '../../components/SaveToolbar';
import incomeFrequencies from '../../constants/incomeFrequencies';
import { notifyOnFailure } from '../../helpers/notify';
import { getFullName } from '../../helpers/string';
import { getId } from '../../helpers/url';
import { pastDate } from '../../helpers/validation';

const ApprovedInput = (props: NullableBooleanInputProps) => {
  const { change } = useForm();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const approved = e.target.value === 'true';
    change('approvedAmount', approved ? '100' : '0');
  };

  return <NullableBooleanInput {...props} onChange={handleChange} />;
};

const formValidations = (data: RA.Record) => (values: RA.Record) => {
  const errors: Record<string, string[]> = {};

  if (data.accountBsb !== values._accountBsb) {
    errors._accountBsb = ["Account BSB does not match user's record, please verify and try again"];
  }

  if (data.accountNumber !== values._accountNumber) {
    errors._accountNumber = [
      "Account number does not match user's record, please verify and try again",
    ];
  }

  return errors;
};

export default (props: ResourceComponentProps): JSX.Element | null => {
  const userId = getId(props.location?.pathname);
  if (!userId) {
    if (props.basePath) {
      props.history?.push(props.basePath);
    }

    return null;
  }

  const { data, loading, error } = useGetOne('users', userId);
  const { identity } = useGetIdentity();
  const notify = useNotify();

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!data) return null;

  const redirect = (basePath: string) => `${basePath}/${userId}`;

  return (
    <Create
      {...props}
      title="Create Risk Assessment"
      record={data}
      onFailure={notifyOnFailure(notify)}
      transform={(innerData) => ({ ...innerData, createdBy: identity?.id, userId })}
    >
      <SimpleForm
        redirect={redirect}
        toolbar={<SaveToolbar saveButtonLabel="Create" />}
        validate={formValidations(data)}
      >
        <FunctionField label="Name" render={getFullName} />
        <TextField label="Email" source="email" />
        <TextField label="Mobile" source="mobileNumber" />
        <TextField label="Date of Birth" source="dob" />
        <Divider />
        <TextInput label="Account BSB" source="_accountBsb" />
        <TextInput label="Account number" source="_accountNumber" />

        <Divider />
        <NullableBooleanInput
          label="Identity verified?"
          source="identityVerified"
          nullLabel="Unable to verify"
          readonly={data.identityVerified}
          defaultValue={data.identityVerified}
        />

        <Divider />
        <DateInput
          label="Last income date"
          source="incomeLastDate"
          validate={[required(), pastDate()]}
        />
        <SelectInput
          label="Pay cycle"
          source="incomeFrequency"
          choices={incomeFrequencies}
          validate={[required()]}
        />
        <NumberInput label="Average pay" source="incomeAverage" validate={[required()]} min={0} />

        <Checkbox label="Government income" source="incomeIsWelfare" />
        <ApprovedInput label="Approved" source="approved" validate={[required()]} />
        {/* <NumberInput label="Approved amount" source="approvedAmount" disabled /> */}
      </SimpleForm>
    </Create>
  );
};
