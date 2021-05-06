import { Button, TextField as InputField, Typography } from '@material-ui/core';
import { Edit as EditIcon, ListAlt as CheckIcon } from '@material-ui/icons';
import { lowerCase, upperFirst } from 'lodash';
import { useState } from 'react';
import {
  Datagrid,
  FunctionField,
  List,
  Record,
  ResourceComponentProps,
  ShowButton,
  TextField,
  useListContext,
} from 'react-admin';
import { useHistory } from 'react-router';
import ListToolbar from '../../components/ListToolbar';
import RedirectButton from '../../components/RedirectButton';
import { toLocalDateString } from '../../helpers/date';
import { getId } from '../../helpers/url';

const Empty = ({ id = '' }): JSX.Element => {
  const [userId, setUserId] = useState(id);
  const { basePath } = useListContext();
  const history = useHistory();
  const handleOnClick = () => history.push(`${basePath}/create/${userId.trim()}`);
  return (
    <div className="text-center mt-8">
      <CheckIcon className="text-9xl text-gray-500" />
      <Typography variant="h6" className="mb-6">
        No transaction found
      </Typography>
      <Typography>Create one now?</Typography>
      <div className="flex flex-col items-center space-y-4 mt-4">
        <InputField
          variant="outlined"
          placeholder="Please enter a User ID"
          autoFocus
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          size="medium"
          disabled={!userId}
          onClick={handleOnClick}
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default (props: ResourceComponentProps): JSX.Element | null => {
  const userId = getId(props.location?.search);

  if (!props.basePath || !userId) {
    return null;
  }

  return (
    <List
      {...props}
      filter={{ userId }}
      bulkActionButtons={false}
      pagination={false}
      empty={<Empty id={userId} />}
      sort={{ field: 'createdAt', order: 'DESC' }}
      actions={<ListToolbar to={`${props.basePath}/create/${userId}`} {...props} />}
    >
      <Datagrid>
        <FunctionField
          label="Created on"
          render={(record?: Record) => toLocalDateString(record ? record.createdAt : '')}
        />
        <FunctionField
          label="Status"
          render={(record?: Record) => upperFirst(lowerCase(record ? record.status : ''))}
        />
        <TextField label="Amount" source="amount" />
        <TextField label="Description" source="description" />
        <TextField label="Send to" source="destination" />
        <TextField label="Send from" source="source" />
        <FunctionField
          label="Submit on"
          render={(record?: Record) => toLocalDateString(record ? record.submitAt : '')}
        />
        <ShowButton />
        <RedirectButton
          buttonLabel="Edit"
          to={(record: Record) => `/transactions/${record.id}?userId=${userId}`}
          icon={<EditIcon />}
        />
      </Datagrid>
    </List>
  );
};
