import {
  Datagrid,
  EditButton,
  List,
  ResourceComponentProps,
  ShowButton,
  TextField,
} from 'react-admin';

const RiskModelList = (props: ResourceComponentProps): JSX.Element => (
  <List
    {...props}
    bulkActionButtons={false}
    sort={{ field: 'createdAt', order: 'DESC' }}
    pagination={false}
  >
    <Datagrid>
      <TextField label="Id" source="id" />
      <TextField label="Name" source="name" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export default RiskModelList;
