import { Typography } from '@material-ui/core';
import { cloneDeep, set } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import {
  Error,
  Loading,
  NotificationType,
  ResourceComponentProps,
  useGetIdentity,
  useGetOne,
  useNotify,
} from 'react-admin';
import { getId } from '../../helpers/url';
import { User } from '../../types/user';
import ApprovalStatus from './ApprovalStatus';
import BankVerification from './BankVerification';
import CustomerInfo from './CustomerInfo';
import Identification from './Identification';
import onboardingSteps, { OnboardingSteps } from './OnboardingSteps';
import RiskAssessment from './RiskAssessment';
import Summary from './Summary';

const INIT_STEP = 1;

const UserOnboarding = (props: ResourceComponentProps): JSX.Element | null => {
  const userId = getId(props.location?.search);

  const { data: userDetails, loading, error } = useGetOne<User>('users', userId ?? '');
  const { identity } = useGetIdentity();
  const notify = useNotify();

  const [currentStep, setCurrentStep] = useState(INIT_STEP);
  const [previousStep, setPreviousStep] = useState(INIT_STEP);

  const Component = useMemo(() => {
    switch (currentStep) {
      case 1:
        return BankVerification;
      case 2:
        return RiskAssessment;
      case 3:
        return Identification;
      default:
        return Summary;
    }
  }, [currentStep]);

  const [wizardData, setWizardData] = useState(onboardingSteps);

  useEffect(() => {
    if (userDetails && (userDetails.bankAccount || userDetails.identity)) {
      let newObj: OnboardingSteps = cloneDeep(wizardData);
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
  }, [userDetails, wizardData]);

  if (!userId) {
    props.history?.push('/users');
    return null;
  }

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!userDetails) return null;

  const handleChange = (
    values: Record<string, unknown> | unknown,
    key?: string,
    completed?: boolean,
    stepValues?: Record<string, unknown>,
  ) => {
    let newObj: OnboardingSteps = cloneDeep(wizardData);
    if (key) {
      newObj = set(newObj, `${currentStep}.values.${key}`, values);
    } else if (typeof values === 'object') {
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
    let newObj: OnboardingSteps = cloneDeep(wizardData);
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

  const handleNotification = (
    message: string | { body?: { errors: unknown[] } },
    notificationType?: NotificationType,
  ) => {
    if (typeof message === 'string') {
      notify(message, notificationType);
    } else if (typeof message === 'object' && notificationType === 'error') {
      notify(message.body?.errors.join('\n\n') || '', 'error');
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(wizardData[currentStep] as any)}
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

export default UserOnboarding;
