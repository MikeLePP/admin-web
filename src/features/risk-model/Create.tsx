import * as React from 'react';
import {
  Create,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  required,
  ResourceComponentProps,
} from 'react-admin';

const riskCreate = (props: ResourceComponentProps): JSX.Element => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" />

      <DateInput label="Publication date" source="published_at" defaultValue={new Date()} />
    </SimpleForm>
  </Create>
);
export default riskCreate;
