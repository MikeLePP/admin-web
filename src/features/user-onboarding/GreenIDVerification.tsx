import { Button, Typography, Box } from '@material-ui/core';
import { useState } from 'react';
import { User } from '../../types/user';
import { callApi } from '../../helpers/api';

interface GreenIDVerificationValues {
  userDetails: User;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const GreenIDVerification = ({
  userDetails,
  loading,
  setLoading,
}: GreenIDVerificationValues): JSX.Element => {
  const [state, setState] = useState({
    isFirstRender: true,
    isGreenIDVerified: false,
  });
  const checkGreenID = async () => {
    setLoading(true);
    setState({ isFirstRender: true, isGreenIDVerified: false });
    const identityVerification = await callApi(
      `/users/${userDetails.id}/identity-verification`,
      'put',
    );
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
    setLoading(false);
  };
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => checkGreenID()}
        disabled={loading}
      >
        Green ID Verification
      </Button>
      {!state.isFirstRender &&
        !loading &&
        (state.isGreenIDVerified ? (
          <Box bgcolor="success.light">
            <Typography variant="h6" className="mb-4">
              User is verified
            </Typography>
          </Box>
        ) : (
          <Box bgcolor="error.light">
            <Typography variant="h6" className="mb-4">
              Unverified
            </Typography>
          </Box>
        ))}
    </>
  );
};

export default GreenIDVerification;
