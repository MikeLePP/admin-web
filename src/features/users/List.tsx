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
import { getFullName } from '../../helpers/string';

type TMyPropsType = {
  createdAt: string;
  id: string;
};

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
      <FunctionField<TMyPropsType>
        label="Created on"
        render={(v: TMyPropsType | undefined) =>
          new Date(v ? v.createdAt : '').toLocaleDateString('en-GB')
        }
      />
      <TextField label="Status" source="status" />
      <FunctionField label="Name" render={getFullName} />
      <TextField label="Email" source="email" />
      <TextField label="Mobile" source="mobileNumber" />
      <TextField label="Current balance" source="balanceCurrent" />
      <RedirectButton
        buttonLabel="Transactions"
        to={(r: { id: string }) => `/transactions?userId=${String(r.id)}`}
      />
      <RedirectButton
        buttonLabel="Onboarding"
        to={(r: { id: string }) => `/user-onboarding/create?userId=${String(r.id)}`}
      />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
