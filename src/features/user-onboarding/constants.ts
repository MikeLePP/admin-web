import BankVerification from './BankVerification';
import RiskAssessment from './RiskAssessment';
import Identification from './Identification';

export const ONBOARDING_STEPS = {
  1: {
    component: BankVerification,
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
    component: RiskAssessment,
    name: 'Risk assessment',
    completed: undefined,
    riskAssessmentId: '',
    values: {
      approved: undefined,
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
      identityVerified: undefined,
    },
    labels: {
      identityVerified: 'Identification verified?',
    },
  },
} as { [key: number]: any };

export const GOVERNMENT_SUPPORT = [
  { id: true, name: 'Yes' },
  { id: false, name: 'No' },
];
export const RISK_MODELS = ['COMB-A', 'COMB-B', 'COMB-C', 'COMB-D', 'COMB-E'];
export const DECLINE_REASONS = [
  { value: 'NI', label: 'No employer income' },
  { value: 'I1', label: 'Number consecutive pay cycles assessed' },
  { value: 'I2', label: 'Average weekly income minimum' },
  { value: 'I3', label: 'Number income timing variations' },
  { value: 'I4', label: 'Number days income is off by ' },
  { value: 'I5', label: 'Income variance percentage' },
  { value: 'I6', label: 'Government income as % total' },
  { value: 'B1', label: 'Min day 1 ending balance' },
  { value: 'B2', label: 'Number times day 1 income is allowed below minimum' },
];
