import { useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  useListContext,
  ShowButton,
  FunctionField,
  ResourceComponentProps,
} from 'react-admin';

import { Typography, Button, TextField as InputField } from '@material-ui/core';
import { ListAlt as CheckIcon, Edit as EditIcon } from '@material-ui/icons';
import { useHistory } from 'react-router';
import { lowerCase, upperFirst } from 'lodash';

import { toLocalDateString } from '../../helpers/date';
import ListToolbar from '../../components/ListToolbar';
import { getId } from '../../helpers/url';
import RedirectButton from '../../components/RedirectButton';

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

type TMyPropsType = {
  submitAt: string;
  createdAt: string;
  status: string;
  id: string;
};

export default (props: ResourceComponentProps): JSX.Element => {
  const userId = getId(props.location?.search);
  return (
    <List
      {...props}
      filter={{ userId }}
      bulkActionButtons={false}
      pagination={false}
      empty={<Empty id={userId} />}
      sort={{ field: 'createdAt', order: 'DESC' }}
      actions={<ListToolbar to={`${String(props.basePath)}/create/${String(userId)}`} {...props} />}
    >
      <Datagrid>
        <FunctionField<TMyPropsType>
          label="Created on"
          render={(v: TMyPropsType | undefined) => toLocalDateString(v ? v.createdAt : '')}
        />
        <FunctionField<TMyPropsType>
          label="Status"
          render={(v: TMyPropsType | undefined) => upperFirst(lowerCase(v ? v.status : ''))}
        />
        <TextField label="Amount" source="amount" />
        <TextField label="Description" source="description" />
        <TextField label="Send to" source="destination" />
        <TextField label="Send from" source="source" />
        <FunctionField<TMyPropsType>
          label="Submit on"
          render={(v: TMyPropsType | undefined) => toLocalDateString(v ? v.submitAt : '')}
        />
        <ShowButton />
        <RedirectButton
          buttonLabel="Edit"
          to={(r: { id: string }) => `/transactions/${String(r.id)}?userId=${String(userId)}`}
          icon={<EditIcon />}
        />
      </Datagrid>
    </List>
  );
};
