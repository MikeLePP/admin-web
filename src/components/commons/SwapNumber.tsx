import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { get, startCase, upperFirst } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import type { User } from '../../types/users';
import { userApi } from '../../api/user';

type IStatus = 'idle' | 'searching' | 'success' | 'fail';

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  user: User;
  onSwapPhoneNumber: (userId: string) => void;
}

export const getFullName = (record?: User): string =>
  record ? [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ') : '';

export default function SwapPhoneNumber({ open, setOpen, user, onSwapPhoneNumber }: IProps): JSX.Element {
  const [currentPhoneNumber, setCurrentPhoneNumber] = React.useState<string | undefined>(undefined);
  const [inputPhoneNumber, setInputPhoneNumber] = React.useState<string | undefined>(undefined);
  const [userFound, setUserFound] = React.useState<User>();
  const [searchStatus, setSearchStatus] = React.useState<IStatus>('idle');

  useEffect(() => {
    setCurrentPhoneNumber(user?.mobileNumber || '');
  }, [user]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value: newValue } = e.target;
    setInputPhoneNumber(newValue);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!inputPhoneNumber) {
        return;
      }

      const getUser = async () => {
        setSearchStatus('searching');
        try {
          const response = await userApi.getUsers(
            `?filter=${encodeURIComponent(JSON.stringify({ mobileNumber: inputPhoneNumber }))}`,
          );
          const userResponse = get(response, [0], {}) as User;
          setSearchStatus('success');
          setUserFound(userResponse);
        } catch (err) {
          setSearchStatus('fail');
          setUserFound(undefined);
        }
      };

      void getUser();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [inputPhoneNumber]);

  const handleUpdate = () => {
    onSwapPhoneNumber(userFound.id);
  };

  const foundUser = searchStatus === 'success' && userFound?.id;

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="form-dialog-title">Swap mobile number</DialogTitle>
      <DialogContent>
        <DialogContentText>User phone number: {currentPhoneNumber}</DialogContentText>
        <TextField
          id="outlined-helperText"
          label="New mobile number"
          variant="outlined"
          onChange={handleChange}
          fullWidth
          value={inputPhoneNumber}
        />
        <Box className="mt-2">
          {searchStatus === 'searching' && (
            <Box className="w-full flex justify-center">
              <CircularProgress />
            </Box>
          )}
          {foundUser ? (
            <Typography>
              {' '}
              Existing Customer: {getFullName(userFound)} | Status:{' '}
              {upperFirst(startCase(userFound?.status).toLowerCase())}{' '}
            </Typography>
          ) : (
            <Typography>No existing user</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary" disabled={!userFound}>
          Swap
        </Button>
      </DialogActions>
    </Dialog>
  );
}
