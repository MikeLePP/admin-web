import {
  Datagrid,
  EditButton,
  Filter,
  FunctionField,
  List,
  ShowButton,
  TextField,
  TextInput,
} from 'react-admin';
import RedirectButton from '../../components/RedirectButton';
import { getFullname } from '../../helpers/string';

const UserFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search by mobile number" source="mobileNumber" alwaysOn resettable />
  </Filter>
);

export default (props: any) => {
  return (
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
          to={(r: any) => `/transactions?userId=${r.id}`}
        />
        <RedirectButton
          buttonLabel="Onboarding"
          to={(r: any) => `/user-onboarding/create?userId=${r.id}`}
        />
        <ShowButton />
        <EditButton />
      </Datagrid>
    </List>
  );
};