import { Button, Chip, Grid, Typography } from '@material-ui/core';
import { FormEvent, useState } from 'react';
import TextLabel from '../../components/TextLabel';
import YesNoButtons from '../../components/YesNoButtons';
import { callApi } from '../../helpers/api';
import { toLocalDateString, yearOldString } from '../../helpers/date';
import ActionButtons from './ActionButtons';
import { IdentificationValues, OnboardingComponentProps } from './OnboardingSteps';

interface GreenIdResult {
  verified: boolean;
  status: string;
}

const Identification = ({
  values: { identityStatus, identityVerified },
  userDetails,
  onChange,
  onPrevStep,
  onNextStep,
  notify,
  identity,
}: OnboardingComponentProps<IdentificationValues>): JSX.Element => {
  const [notifyContinue, setNotifyContinue] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      await Promise.all([
        callApi(`/identities/${userDetails.identity.id}`, 'patch', {
          verified: identityVerified,
          updatedBy: identity?.id,
        }),
        callApi(`/onboarding/${userDetails.id}`, 'post', {
          step: 'identity',
          identityId: userDetails.identity.id,
          notifyUser: notifyContinue,
          updatedBy: identity?.id,
        }),
      ]);

      onChange({ identityVerified }, undefined, identityVerified);
      onNextStep(!identityVerified);
    } catch (error) {
      notify(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkGreenId = async () => {
    try {
      setLoading(true);
      const response = await callApi<{ data: { attributes: GreenIdResult } }>(
        `/users/${userDetails.id}/identity-verification`,
        'put',
      );

      const { status, verified } = response.json.data.attributes;
      onChange(
        {
          identityStatus: status,
          identityVerified: verified,
        },
        undefined,
        verified,
      );
    } catch (error) {
      notify(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleFormSubmit}>
      <div className="px-8 mb-8">
        <Typography variant="subtitle2" className="font-bold mb-4">
          User entries
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextLabel label="First name" value={userDetails.firstName} />
          </Grid>
          <Grid item xs={6}>
            <TextLabel label="Middle name" value={userDetails.middleName || '-'} />
          </Grid>
          <Grid item xs={6}>
            <TextLabel label="Last name" value={userDetails.lastName || '-'} />
          </Grid>
          <Grid item xs={6}>
            <div>
              <Typography className="text-gray-500">Date of birth</Typography>
            </div>
            <div className="flex items-center space-x-1">
              <Typography component="span">{toLocalDateString(userDetails.dob) || '-'}</Typography>
              {userDetails.dob && (
                <Chip size="small" label={`${yearOldString(userDetails.dob)} yr old`} />
              )}
            </div>
          </Grid>
          <Grid item xs={6}>
            <TextLabel label="ID type" value={userDetails.identity.source || '-'} />
          </Grid>
          {userDetails.identity?.source?.toLowerCase() === 'aus-passport' ? (
            <Grid item xs={6}>
              <TextLabel label="Passport number" value={userDetails.identity.number || '-'} />
            </Grid>
          ) : (
            <>
              <Grid item xs={6}>
                <TextLabel label="Licence number" value={userDetails.identity.number || '-'} />
              </Grid>
              <Grid item xs={6}>
                <TextLabel label="Licence State" value={userDetails.identity.state || '-'} />
              </Grid>
            </>
          )}
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" className="mb-4">
              Green ID Verification
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => checkGreenId()}
              disabled={loading}
            >
              Verify ID
            </Button>
          </Grid>
          {identityStatus && (
            <Grid item xs={6}>
              <TextLabel label="Status" value={identityStatus} />
            </Grid>
          )}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" className="mb-4">
              Identification verified?
            </Typography>
            <YesNoButtons
              isYes={identityVerified}
              onYesClick={() => onChange(true, 'identityVerified')}
              onNoClick={() => onChange(false, 'identityVerified')}
            />
          </Grid>
        </Grid>
      </div>
      <div className="flex-grow"></div>
      <ActionButtons onBackButtonClick={onPrevStep} loading={loading}>
        <div className="space-x-2">
          <Button variant="contained" color="secondary" type="submit" disabled={loading}>
            Continue
          </Button>
          {!identityVerified && (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              onClick={() => setNotifyContinue(true)}
            >
              Notify and continue
            </Button>
          )}
        </div>
      </ActionButtons>
    </form>
  );
};

export default Identification;
