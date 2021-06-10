import { Button, Typography } from '@material-ui/core';
import { useState } from 'react';
import { User } from '../../types/user';
import { callApi } from '../../helpers/api';

interface GreenIDVerificationValues {
  userDetails: User;
}

const GreenIDVerification = ({ userDetails }: GreenIDVerificationValues): JSX.Element => {
  const [state, setState] = useState({
    isFirstRender: true,
    isGreenIDVerified: false,
  });
  const checkGreenID = async () => {
    const identityVerification = await callApi(`/users/${userDetails.id}/identities`, 'put');
    if (identityVerification) {
      setState({
        isFirstRender: false,
        isGreenIDVerified: true,
      });
    } else {
      setState({
        isFirstRender: false,
        isGreenIDVerified: false,
      });
    }
  };
  return (
    <>
      <Button variant="contained" color="primary" onClick={() => checkGreenID()}>
        Green ID Verification
      </Button>
      {!state.isFirstRender && (
        <Typography>{state.isGreenIDVerified ? 'User is verified' : 'Unverified'}</Typography>
      )}
    </>
  );
};

export default GreenIDVerification;
