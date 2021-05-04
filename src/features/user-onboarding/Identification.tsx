import { Button, Chip, Grid, Typography } from '@material-ui/core';
import { useState } from 'react';
import TextLabel from '../../components/TextLabel';
import YesNoButtons from '../../components/YesNoButtons';
import { callApi } from '../../helpers/api';
import { toLocalDateString, yearOldString } from '../../helpers/date';
import ActionButtons from './ActionButtons';

export type IdentificationPropsType = {
  values: any;
  userDetails: any;
  onChange: any;
  onPrevStep: any;
  onNextStep: any;
  notify: any;
  identity: any;
};

export default ({
  values: { identityVerified },
  userDetails,
  onChange,
  onPrevStep,
  onNextStep,
  notify,
  identity,
}: IdentificationPropsType): JSX.Element => {
  const [notifyContinue, setNotifyContinue] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      await Promise.all([
        callApi(`/identities/${String(userDetails.identity.id)}`, 'patch', {
          verified: identityVerified,
          updatedBy: identity?.id,
        }),
        callApi(`/onboarding/${String(userDetails.id)}`, 'post', {
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
                <Chip size="small" label={`${String(yearOldString(userDetails.dob))} yr old`} />
              )}
            </div>
          </Grid>
          <Grid item xs={6}>
            <TextLabel label="ID type" value={userDetails.identity.source || '-'} />
          </Grid>
          {userDetails.identity?.source?.toLowerCase() === 'passport' ? (
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
        <div className="mt-8">
          <Typography variant="h6" className="mb-4">
            Identification verified?
          </Typography>
          <YesNoButtons
            isYes={identityVerified}
            onYesClick={() => onChange(true, 'identityVerified') as Record<string, unknown>}
            onNoClick={() => onChange(false, 'identityVerified') as Record<string, unknown>}
          />
        </div>
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
