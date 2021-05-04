import BankVerification, { BankVerificationProps } from './BankVerification';
import RiskAssessment, { RiskAssessmentProps } from './RiskAssessment';
import Identification, { IdentificationPropsType } from './Identification';

export interface OnboardingStep {
  [index: number]: {
    completed?: boolean;
    component: typeof BankVerification | typeof RiskAssessment | typeof Identification;
    labels:
      | BankVerificationProps['labels']
      | RiskAssessmentProps['labels']
      | Record<string, string>;
    name: string;
    riskAssessmentId?: string;
    values:
      | BankVerificationProps['values']
      | RiskAssessmentProps['values']
      | IdentificationPropsType['values'];
  };
}

// export type BankVerificationPropsType = {
//   bankDetailsAvailable: boolean;
//   accountBsb: string;
//   accountNumber: string;
// };

// export type RiskAssessmentPropsType = {
//   approved: boolean;
//   incomeAverage: string;
//   incomeDay1Min: string;
//   incomeFrequency: string;
//   incomeLastDate: string;
//   incomeSupport: string;
//   incomeVariationMax: string;
//   riskModelVersion: string;
//   rejectedReasons: string[];
// };

const onboardingSteps: OnboardingStep = {
  1: {
    component: BankVerification,
    name: 'Bank information',
    completed: undefined,
    values: {
      bankDetailsAvailable: false,
      accountBsb: '',
      accountNumber: '',
    },
    labels: {
      bankDetailsAvailable: 'Bank details available?',
      accountBsb: 'BSB',
      accountNumber: 'Account number',
    },
  },
  2: {
    component: RiskAssessment,
    name: 'Risk assessment',
    completed: undefined,
    riskAssessmentId: '',
    values: {
      approved: false,
      incomeAverage: '',
      incomeDay1Min: '',
      incomeFrequency: '',
      incomeLastDate: '',
      incomeSupport: '',
      incomeVariationMax: '',
      riskModelVersion: '',
      rejectedReasons: [],
    },
    labels: {
      approved: 'Risk assessment approved?',
      incomeAverage: 'Average pay',
      incomeDay1Min: 'Lowest day 1 balance',
      incomeFrequency: 'Pay cycle',
      incomeLastDate: 'Last income date',
      incomeSupport: 'Government income',
      incomeVariationMax: 'Largest income variation',
      riskModelVersion: 'Risk model',
      rejectedReasons: 'Decline reasons',
    },
  },
  3: {
    component: Identification,
    name: 'Identification',
    completed: undefined,
    values: {
      identityVerified: false,
    },
    labels: {
      identityVerified: 'Identification verified?',
    },
  },
};

export default onboardingSteps;
