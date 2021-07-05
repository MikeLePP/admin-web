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

const RiskModelList = (props: ResourceComponentProps): JSX.Element => (
  <List
    {...props}
    bulkActionButtons={false}
    sort={{ field: 'createdAt', order: 'DESC' }}
    pagination={false}
  >
    <Datagrid>
      <TextField label="Name" source="name" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export default RiskModelList;
