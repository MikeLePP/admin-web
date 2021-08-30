import { Card, CardActions, CardContent, CardHeader, CardTypeMap, Divider } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DefaultComponentProps } from '@material-ui/core/OverridableComponent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import { get, startCase, upperFirst } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { userApi } from '../../api/user';
import { getFullName } from '../../lib/userHelpers';
import type { User } from '../../types/users';

type IStatus = 'idle' | 'searching' | 'success' | 'fail';

interface IProps extends DefaultComponentProps<CardTypeMap> {
  user: User;
  onSwapPhoneNumber: (swappedUserId: string, swappedMobileNumber: string) => void;
}

export default function SwapPhoneNumber({ user, onSwapPhoneNumber, ...remains }: IProps): JSX.Element {
  const [inputPhoneNumber, setInputPhoneNumber] = React.useState<string | undefined>(undefined);
  const [userFound, setUserFound] = React.useState<User>();
  const [searchStatus, setSearchStatus] = React.useState<IStatus>('idle');

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

      if (inputPhoneNumber === user.mobileNumber) {
        setSearchStatus('fail');
        setUserFound(undefined);
      } else {
        void getUser();
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [inputPhoneNumber, user.mobileNumber]);

  const handleUpdate = () => {
    onSwapPhoneNumber(userFound.id, userFound.mobileNumber);
  };

  const foundUser = searchStatus === 'success' && userFound?.id;

  return (
    <Card {...remains}>
      <CardHeader title="Swap Mobile Number" />
      <Divider />
      <CardContent>
        <TextField
          fullWidth
          id="outlined-helperText"
          label="New mobile number"
          onChange={handleChange}
          value={inputPhoneNumber}
          variant="outlined"
        />
        {searchStatus === 'searching' && (
          <Box className="w-full flex justify-center" sx={{ mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {foundUser ? (
          <Typography sx={{ mt: 2 }}>
            Existing customer found: {getFullName(userFound)} | Status:{' '}
            {upperFirst(startCase(userFound?.status).toLowerCase())}
          </Typography>
        ) : (
          (searchStatus === 'success' || searchStatus === 'fail') && (
            <Typography sx={{ mt: 2 }}>No existing user</Typography>
          )
        )}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          startIcon={<SwapHoriz fontSize="small" />}
          variant="contained"
          onClick={handleUpdate}
          disabled={!(userFound && searchStatus === 'success')}
        >
          Swap
        </Button>
      </CardActions>
    </Card>
  );
}
