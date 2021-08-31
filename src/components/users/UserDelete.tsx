import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardTypeMap,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from '@material-ui/core';
import { DefaultComponentProps } from '@material-ui/core/OverridableComponent';
import DeleteIcon from '@material-ui/icons/Delete';
import { FC, useMemo, useState } from 'react';
import type { User } from '../../types/users';

interface IProps extends DefaultComponentProps<CardTypeMap> {
  user: User;
  onUserDeleted: () => void;
}

const DeleteColors = {
  backgroundColor: 'error.main',
  color: 'error.contrastText',
  '&:hover': {
    backgroundColor: 'error.dark',
  },
};

const UserUpdateBalanceLimit: FC<IProps> = ({ user, onUserDeleted, ...remains }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [show, setShow] = useState(false);

  const disableDelete = useMemo(() => user.mobileNumber !== mobileNumber, [user, mobileNumber]);
  const showDeleteDialog = () => {
    setMobileNumber('');
    setShow(true);
  };

  return (
    <Card {...remains}>
      <CardHeader title="DANGER ZONE" />
      <Divider />
      <CardContent>
        <Typography>
          Delete a user that has not made any transactions. Deleting a user is permanent and cannot be undone.
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          startIcon={<DeleteIcon fontSize="small" />}
          variant="contained"
          onClick={showDeleteDialog}
          sx={DeleteColors}
        >
          DELETE
        </Button>
      </CardActions>
      <MuiDialog open={show}>
        <DialogTitle>Permanent Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? Deleting a user is permanent and cannot be undone. Type the
            user's phone number to proceed.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Mobile number"
            margin="dense"
            onChange={(event): void => setMobileNumber(event.target.value)}
            value={mobileNumber}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShow(false)} color="primary">
            CANCEL
          </Button>
          <Button disabled={disableDelete} onClick={onUserDeleted} sx={DeleteColors}>
            DELETE PERMANENTLY
          </Button>
        </DialogActions>
      </MuiDialog>
    </Card>
  );
};

export default UserUpdateBalanceLimit;
