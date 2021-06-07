import { Button, Typography } from '@material-ui/core';
import { useState } from 'react';
import { User } from '../../types/user';
import { callApi } from '../../helpers/api';

interface GreenIDVerificationValues {
  userDetails: User;
}

const isUserIdentityVerified = async (userDetails: User): Promise<boolean> => {
  const { status, body } = await callApi(`/identities/`, 'put', {
    data: {
      attributes: { ...userDetails },
    },
  });
  if (status === 200) {
    const {
      data: {
        attributes: { verified },
      },
    } = JSON.parse(body);
    return verified as boolean;
  }
  return false;
};

const isUserPassportsVerified = async (userDetails: User): Promise<boolean> => {
  const { status, body } = await callApi(`/identities/${userDetails.identity.id}/passport`, 'put', {
    data: {
      attributes: { passportNumber: userDetails.identity.number },
    },
  });
  if (status === 200) {
    const {
      data: {
        attributes: { verified },
      },
    } = JSON.parse(body);
    return verified as boolean;
  }
  return false;
};

const GreenIDVerification = ({ userDetails }: GreenIDVerificationValues): JSX.Element => {
  const [state, setState] = useState({
    isFirstRender: true,
    isGreenIDVerified: false,
  });
  const checkGreenID = async () => {
    const identityVerified = await isUserIdentityVerified(userDetails);
    if (identityVerified) {
      setState({
        isFirstRender: false,
        isGreenIDVerified: true,
      });
    } else {
      const passportVerified = await isUserPassportsVerified(userDetails);
      if (passportVerified) {
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
