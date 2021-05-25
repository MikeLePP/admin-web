import {
  Datagrid,
  EditButton,
  Filter,
  FunctionField,
  List,
  Record as RaRecord,
  ResourceComponentProps,
  ShowButton,
  TextField,
  TextInput,
} from 'react-admin';
import RedirectButton from '../../components/RedirectButton';
import { getFullName } from '../../helpers/string';

const UserFilter = (props: Record<string, unknown>) => (
  <Filter {...props}>
    <TextInput label="Search by mobile number" source="mobileNumber" alwaysOn resettable />
  </Filter>
);

const UserList = (props: ResourceComponentProps): JSX.Element => (
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
        render={(record?: RaRecord) =>
          new Date(record ? record.createdAt : '').toLocaleDateString('en-GB')
        }
      />
      <TextField label="Status" source="status" />
      <FunctionField label="Name" render={getFullName} />
      <TextField label="Email" source="email" />
      <TextField label="Mobile" source="mobileNumber" />
      <TextField label="Current balance" source="balanceCurrent" />
      <RedirectButton
        buttonLabel="Transactions"
        to={(record?: RaRecord) => (record ? `/transactions?userId=${record.id}` : '')}
      />
      <RedirectButton
        buttonLabel="Onboarding"
        to={(record?: RaRecord) => (record ? `/user-onboarding/create?userId=${record.id}` : '')}
      />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
