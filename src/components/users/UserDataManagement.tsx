import type { FC } from 'react';
import { startCase } from 'lodash';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Typography,
  TextField,
  Collapse,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, Save as SaveIcon } from '@material-ui/icons';
import TrashIcon from '../../icons/Trash';
import { useState } from 'react';
import { User, UserStatus } from '../../types/users';

interface UserDataManagementProps {
  user: User;
  onUserStatusChanged: (userStatus: string, userStatusReason?: string) => void;
}

const UserDataManagement: FC<UserDataManagementProps> = (props) => {
  const { onUserStatusChanged, user } = props;
  const [updateStatusOpened, setUpdateStatusOpened] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<typeof UserStatus[number]>(user.status);
  const [userStatusReason, setUserStatusReason] = useState<string>(null);

  const handleUpdate = (e) => {
    onUserStatusChanged(userStatus, userStatusReason);
  };

  return (
    <Card {...props}>
      <CardHeader title="Data Management" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            className="flex items-center cursor-pointer select-none"
            onClick={() => setUpdateStatusOpened(!updateStatusOpened)}
          >
            <Typography variant="subtitle2" className="mb-4 font-bold">
              Update status
            </Typography>
            {updateStatusOpened ? (
              <ExpandLess className="mb-4" fontSize="small" />
            ) : (
              <ExpandMore className="mb-4" fontSize="small" />
            )}
          </Box>
          <Collapse in={updateStatusOpened} timeout="auto" unmountOnExit>
            <TextField
              style={{ marginBottom: 15 }}
              fullWidth
              name="option"
              label="Status reason"
              onChange={(event): void => setUserStatusReason(event.target.value)}
              value={userStatusReason}
              variant="outlined"
            />
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
            <Box sx={{ mt: 2 }}>
              <Button
                color="primary"
                startIcon={<SaveIcon fontSize="small" />}
                variant="contained"
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>
          </Collapse>
        </Box>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography color="textSecondary" variant="body2">
            Remove this customer’s chart if he requested that, if not please be aware that what has been deleted can
            never brought back
          </Typography>
        </Box>
        <Button
          startIcon={<TrashIcon fontSize="small" />}
          sx={{
            backgroundColor: 'error.main',
            color: 'error.contrastText',
            '&:hover': {
              backgroundColor: 'error.dark',
            },
          }}
          variant="contained"
        >
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserDataManagement;
