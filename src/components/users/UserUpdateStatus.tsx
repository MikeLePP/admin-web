import { Button, Card, CardActions, CardContent, CardHeader, CardTypeMap, Divider, TextField } from '@material-ui/core';
import { DefaultComponentProps } from '@material-ui/core/OverridableComponent';
import { Save as SaveIcon } from '@material-ui/icons';
import { startCase } from 'lodash';
import type { FC } from 'react';
import { useState } from 'react';
import { User, UserStatus } from '../../types/users';

interface UserUpdateStatusProps extends DefaultComponentProps<CardTypeMap> {
  user: User;
  onUserStatusChanged: (userStatus: string, userStatusReason?: string) => void;
}

const UserUpdateStatus: FC<UserUpdateStatusProps> = (props) => {
  const { onUserStatusChanged, user } = props;
  const [userStatus, setUserStatus] = useState<typeof UserStatus[number]>(user.status);
  const [userStatusReason, setUserStatusReason] = useState<string>(null);

  const handleUpdate = (e) => {
    onUserStatusChanged(userStatus, userStatusReason);
  };

  const disabled = !userStatus || !userStatusReason;

  return (
    <Card {...props}>
      <CardHeader title="Update Status" />
      <Divider />
      <CardContent>
        <TextField
          fullWidth
          name="option"
          onChange={(event): void => setUserStatus(event.target.value as typeof UserStatus[number])}
          select
          SelectProps={{ native: true }}
          value={userStatus}
          variant="outlined"
        >
          {UserStatus.filter((item) => item !== 'inactive').map((value) => (
            <option key={value} value={value}>
              {startCase(value)}
            </option>
          ))}
        </TextField>
        <TextField
          style={{ marginBottom: 15 }}
          fullWidth
          name="option"
          label="Reason"
          onChange={(event): void => setUserStatusReason(event.target.value)}
          value={userStatusReason}
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          startIcon={<SaveIcon fontSize="small" />}
          variant="contained"
          onClick={handleUpdate}
          disabled={disabled}
        >
          Update
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserUpdateStatus;
