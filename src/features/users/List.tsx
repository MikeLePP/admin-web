import {
  Datagrid,
  EditButton,
  Filter,
  FunctionField,
  List,
  ResourceComponentProps,
  ShowButton,
  TextField,
  TextInput,
} from 'react-admin';
import RedirectButton from '../../components/RedirectButton';
import { getFullname } from '../../helpers/string';

const UserFilter = (props: Record<string, unknown>) => (
  <Filter {...props}>
    <TextInput label="Search by mobile number" source="mobileNumber" alwaysOn resettable />
  </Filter>
);

export default (props: ResourceComponentProps): JSX.Element => (
  <List
    {...props}
    bulkActionButtons={false}
    sort={{ field: 'createdAt', order: 'DESC' }}
    filters={<UserFilter />}
    pagination={false}
  >
    <Datagrid>
      <FunctionField
        label="Created on"
        render={(v: any) => new Date(v.createdAt).toLocaleDateString('en-GB')}
      />
      <TextField label="Status" source="status" />
      <FunctionField label="Name" render={getFullname} />
      <TextField label="Email" source="email" />
      <TextField label="Mobile" source="mobileNumber" />
      <TextField label="Current balance" source="balanceCurrent" />
      <RedirectButton
        buttonLabel="Transactions"
        to={(r: any) => `/transactions?userId=${String(r.id)}`}
      />
      <RedirectButton
        buttonLabel="Onboarding"
        to={(r: any) => `/user-onboarding/create?userId=${String(r.id)}`}
      />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
