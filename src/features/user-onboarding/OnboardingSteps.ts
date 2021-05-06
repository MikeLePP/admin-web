import { NotificationType, UserIdentity } from 'ra-core';
import { User } from '../../types/user';

export interface OnboardingStep<T extends Record<string, unknown>> {
  completed?: boolean;
  labels: Record<keyof T, string>;
  name: string;
  riskAssessmentId?: string;
  values: T;
}

export interface OnboardingSteps {
  [index: number]:
    | OnboardingStep<BankVerificationValues>
    | OnboardingStep<RiskAssessmentValues>
    | OnboardingStep<IdentificationValues>;
}

export interface OnboardingComponentProps<T extends Record<string, unknown>>
  extends OnboardingStep<T> {
  identity?: UserIdentity;
  labels: Record<keyof T, string>;
  notify: (message: string, notificationType?: NotificationType) => void;
  onChange: (
    values: Record<string, unknown> | unknown,
    key?: string,
    completed?: boolean,
    stepValues?: Record<string, unknown>,
  ) => void;
  onCompleteStep: (completed: boolean) => void;
  onNextStep: (goToSummary?: boolean) => void;
  onPrevStep: () => void;
  riskAssessmentId?: string;
  userDetails: User;
  values: T;
}

export interface BankVerificationValues extends Record<string, unknown> {
  bankDetailsAvailable?: boolean;
  accountBsb: string;
  accountNumber: string;
}

export interface RiskAssessmentValues extends Record<string, unknown> {
  approved?: boolean;
  incomeAverage: string;
  incomeDay1Min: string;
  incomeFrequency: string;
  incomeLastDate: string;
  incomeSupport?: boolean;
  incomeVariationMax: string;
  rejectedReasons: string[];
  riskModelVersion: string;
}

export interface IdentificationValues extends Record<string, unknown> {
  identityVerified?: boolean;
}

const onboardingSteps: OnboardingSteps = {
  1: {
    name: 'Bank information',
    completed: undefined,
    values: {
      bankDetailsAvailable: undefined,
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
    name: 'Risk assessment',
    completed: undefined,
    riskAssessmentId: '',
    values: {
      approved: undefined,
      incomeAverage: '',
      incomeDay1Min: '',
      incomeFrequency: '',
      incomeLastDate: '',
      incomeSupport: undefined,
      incomeVariationMax: '',
      rejectedReasons: [],
      riskModelVersion: '',
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
    name: 'Identification',
    completed: undefined,
    values: {
      identityVerified: undefined,
    },
    labels: {
      identityVerified: 'Identification verified?',
    },
  },
};

export default onboardingSteps;
