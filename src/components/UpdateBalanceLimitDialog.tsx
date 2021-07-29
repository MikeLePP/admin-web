import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import get from 'lodash/get';
import React, { ChangeEvent, useEffect } from 'react';
import { useNotify } from 'react-admin';
import { APPROVED_AMOUNT } from '../features/user-onboarding/constants';
import { useUser } from '../features/users/user-hooks';
import { callApi } from '../helpers/api';
import { User } from '../types/user';

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  userId: string;
}

export default function UpdateBalanceLimitDialog({ open, setOpen, userId }: IProps): JSX.Element {
  const notify = useNotify();
  const [limitValue, setLimitValue] = React.useState<number | string>('');
  const { user } = useUser(userId);
  useEffect(() => {
    setLimitValue(user?.balanceLimit || '');
  }, [user]);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
    const { value: newValue } = e.target;
    setLimitValue(Number(newValue));
  };

  const handleUpdate = () => {
    async function updateUser(currentUser: User) {
      try {
        await callApi(`/users/${currentUser.id}`, 'put', {
          ...currentUser,
          balanceLimit: limitValue,
        });
        notify('Update user balance limit success', 'success');
        setOpen(false);
      } catch (err) {
        const errTitle = get(err, 'body.errors[0].title', 'Cannot update risk model');
        notify(errTitle, 'error');
      }
    }
    if (user) {
      void updateUser(user);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="form-dialog-title">Update Balance Limit</DialogTitle>
      <DialogContent>
        <DialogContentText>Current Balance Limit: {user?.balanceLimit || ''}</DialogContentText>
        <FormControl className="m-1 min-w-full">
          <InputLabel htmlFor="balance-limit-dialog">Balance Limit</InputLabel>
          <Select
            fullWidth
            id="balance-limit-dialog-id"
            value={limitValue}
            onChange={handleChange}
            input={<Input id="balance-limit-dialog" />}
          >
            {APPROVED_AMOUNT.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          color="primary"
          disabled={limitValue === user?.balanceLimit || !user}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
