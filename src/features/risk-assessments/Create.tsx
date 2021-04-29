import { Divider } from '@material-ui/core';
import {
  Create,
  DateInput,
  Error,
  FunctionField,
  Loading,
  NullableBooleanInput,
  NumberInput,
  required,
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
import Toolbar from '../../components/SaveToolbar';
import incomeFrequencies from '../../constants/incomeFrequencies';
import { notifyOnFailure } from '../../helpers/notify';
import { getFullname } from '../../helpers/string';
import { getId } from '../../helpers/url';
import { pastDate } from '../../helpers/validation';

const ApprovedInput = (props: any) => {
  const { change } = useForm();

  const handleChange = (e: any) => {
    const approved = e.target.value === 'true';
    change('approvedAmount', approved ? '100' : '0');
  };

  return <NullableBooleanInput onChange={handleChange} {...props} />;
};

const formValidations = (data: any) => (values: any) => {
  const errors: any = {};

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

export default (props: any) => {
  const userId = getId(props.location.pathname);
  if (!userId) {
    void props.history.push(props.basePath);
    return null;
  }

  const { data, loading, error } = useGetOne('users', userId);
  const { identity } = useGetIdentity();
  const notify = useNotify();

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!data) return null;

  const transform = (data: any) => ({ ...data, createdBy: identity?.id, userId });
  const redirect = (basePath: string) => `${basePath}/${userId}`;

  return (
    <Create
      {...props}
      title="Create Risk Assessment"
      record={data}
      onFailure={notifyOnFailure(notify)}
      transform={transform}
    >
      <SimpleForm
        redirect={redirect}
        toolbar={<Toolbar saveButtonLabel="Create" />}
        validate={formValidations(data)}
      >
        <FunctionField label="Name" render={getFullname} />
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
