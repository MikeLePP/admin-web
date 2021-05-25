import { useState } from 'react';
import {
  List,
  Datagrid,
  BooleanField,
  TextField,
  FunctionField,
  useListContext,
  NumberField,
  ResourceComponentProps,
  Record,
} from 'react-admin';
import { Typography, Button, TextField as InputField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { SpellcheckRounded as CheckIcon } from '@material-ui/icons';

import ListToolbar from '../../components/ListToolbar';
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
        No risk assessment found
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

const RiskAssessmentList = (props: ResourceComponentProps): JSX.Element | null => {
  const userId = getId(props.location?.pathname);

  if (!props.basePath || !userId) {
    return null;
  }

  return (
    <List
      {...props}
      filter={{ userId }}
      bulkActionButtons={false}
      pagination={false}
      title="Risk Assessments"
      empty={<Empty id={userId} />}
      sort={{ field: 'createdAt', order: 'DESC' }}
      actions={<ListToolbar to={`${props.basePath}/create/${userId}`} />}
    >
      <Datagrid>
        <FunctionField
          label="Created on"
          render={(record?: Record) =>
            record && new Date(record.createdAt).toLocaleDateString('en-GB')
          }
        />
        <BooleanField source="approved" label="Approved" />
        <TextField source="approvedBy" label="Approved by" />
        <NumberField source="approvedAmount" label="Approved amount" />
        {/* <TextField source="incomeAverage" label="Average income" />
        <TextField source="incomeFrequency" label="Frequency" />
        <FunctionField
          label="Last income"
          render={(v: any) => new Date(v.incomeLastDate).toLocaleDateString('en-GB')}
        />
        <BooleanField source="identityVerified" label="ID verified?" /> */}
      </Datagrid>
    </List>
  );
};

export default RiskAssessmentList;
