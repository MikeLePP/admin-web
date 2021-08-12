import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import { filter, get, startCase, upperFirst } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import type { User } from '../../../types/users';
import { userApi } from '../../../api/user';

type IStatus = 'idle' | 'searching' | 'success' | 'fail';

interface IProps {
  user: User;
  onSwapPhoneNumber: (swappedUserId: string, swappedMobileNumber: string) => void;
}

export const getFullName = (record?: User): string =>
  record ? [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ') : '';

export default function SwapPhoneNumber({ user, onSwapPhoneNumber }: IProps): JSX.Element {
  const [currentPhoneNumber, setCurrentPhoneNumber] = React.useState<string | undefined>(undefined);
  const [inputPhoneNumber, setInputPhoneNumber] = React.useState<string | undefined>(undefined);
  const [userFound, setUserFound] = React.useState<User>();
  const [searchStatus, setSearchStatus] = React.useState<IStatus>('idle');

  useEffect(() => {
    setCurrentPhoneNumber(user?.mobileNumber || '');
  }, [user]);

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
          const response = await userApi.getUsers({ mobileNumber: inputPhoneNumber });
          const userResponse = get(response, [0], {}) as User;
          setSearchStatus('success');
          setUserFound(userResponse?.id ? userResponse : undefined);
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
    onSwapPhoneNumber(userFound.id, userFound.mobileNumber);
  };

  const foundUser = searchStatus === 'success' && userFound?.id;

  return (
    <Card>
      <CardHeader title="Swap mobile number" />
      <Divider />
      <CardContent>
        <Typography>User phone number: {currentPhoneNumber}</Typography>
        <TextField
          style={{ marginTop: 10 }}
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
        <Box sx={{ mt: 2 }}>
          <Button
            color="primary"
            startIcon={<SwapHoriz fontSize="small" />}
            variant="contained"
            onClick={handleUpdate}
            disabled={!(userFound && searchStatus === 'success')}
          >
            Swap
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
