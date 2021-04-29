import { useEffect, useMemo, useState } from 'react';
import { Typography } from '@material-ui/core';
import { set, cloneDeep, reduce, map } from 'lodash';
import {
  Error,
  Loading,
  NotificationType,
  useGetIdentity,
  useGetOne,
  useNotify,
} from 'react-admin';

import Summary from './Summary';
import CustomerInfo from './CustomerInfo';
import ApprovalStatus from './ApprovalStatus';
import { getId } from '../../helpers/url';
import { ONBOARDING_STEPS } from './constants';

const INIT_STEP = 1;

export default (props: Record<string, unknown>): JSX.Element => {
  const userId = getId(props.location.search);
  if (!userId) {
    props.history.push('/users');
    return null;
  }

  const { data: userDetails, loading, error } = useGetOne('users', userId);
  const { identity } = useGetIdentity();
  const notify = useNotify();

  const [currentStep, setCurrentStep] = useState(INIT_STEP);
  const [previousStep, setPreviousStep] = useState(INIT_STEP);

  const Component = useMemo(() => {
    if (currentStep < 4) {
      return ONBOARDING_STEPS[currentStep].component as Record<string, unknown>;
    }
    return Summary;
  }, [currentStep]);

  const [wizardData, setWizardData] = useState(ONBOARDING_STEPS);

  useEffect(() => {
    if (userDetails && (userDetails.bankAccount || userDetails.identity)) {
      let newObj: any = cloneDeep(wizardData);
      if (userDetails.bankAccount && userDetails.bankAccount.verified) {
        newObj = set(newObj, '1.values', {
          bankDetailsAvailable: userDetails.bankAccount.verified,
          accountBsb: userDetails.bankAccount.accountBsb,
          accountNumber: userDetails.bankAccount.accountNumber,
        });
      }
      if (userDetails.identity) {
        newObj = set(newObj, '3.values', { identityVerified: userDetails.identity.verified });
      }
      setWizardData(newObj);
    }
    // only update once when the userDetails change
  }, [userDetails]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!userDetails) return null;

  const handleChange = (values: any, key?: string, completed?: boolean, stepValues?: any) => {
    let newObj: any = cloneDeep(wizardData);
    if (key) {
      newObj = set(newObj, `${currentStep}.values.${key}`, values);
    } else {
      newObj = set(newObj, `${currentStep}.values`, {
        ...newObj[currentStep].values,
        ...values,
      });
    }
    if (completed !== undefined) {
      newObj = set(newObj, `${currentStep}.completed`, completed);
    }
    if (stepValues) {
      newObj = set(newObj, `${currentStep}`, { ...newObj[currentStep], ...stepValues });
    }

    setWizardData(newObj);
  };

  const handleCompleteStep = (completed: boolean) => {
    let newObj: any = cloneDeep(wizardData);
    newObj = set(newObj, `${currentStep}.completed`, completed);
    setWizardData(newObj);
  };

  const handleNextStep = (goToSummary = false) => {
    setPreviousStep(currentStep);
    setCurrentStep(goToSummary ? 4 : currentStep + 1);
  };

  const handlePrevStep = () => {
    if (previousStep !== currentStep) {
      setCurrentStep(previousStep);
    } else if (currentStep !== 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNotification = (message: any, notificationType: NotificationType) => {
    if (typeof message === 'object' && notificationType === 'error' && message.body) {
      notify(
        reduce(
          message.body.errors,
          (acc, cur): any => {
            let innerAcc = acc;
            innerAcc += map(cur, (c: Record<string, unknown>) => c).join('\n\n');
            return innerAcc;
          },
          '',
        ),
        'error',
      );
    } else {
      notify(message, notificationType);
    }
  };

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 pb-24 overflow-y-auto">
        <Typography variant="h4" className="text-gray-800 font-thin p-8">
          Customer onboarding
        </Typography>
        <Component
          notify={handleNotification}
          identity={identity}
          {...wizardData[currentStep]}
          summaries={wizardData}
          userDetails={userDetails}
          onChange={handleChange}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onCompleteStep={handleCompleteStep}
        />
      </div>
      <div className="w-64 border-l">
        <CustomerInfo userDetails={userDetails}>
          <ApprovalStatus summaries={wizardData} />
        </CustomerInfo>
      </div>
    </div>
  );
};
