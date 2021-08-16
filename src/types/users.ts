export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dob: string;
  incomeFrequency: string;
  incomeNextDate?: string;
  createdAt?: string;
  bankAccount: {
    id: string;
    accountBsb: string;
    accountNumber: string;
    bankName?: string;
    name: string;
    verified?: boolean;
  };
  bankAccountId: string;
  identity: {
    id: string;
    number: string;
    source: string;
    state: string;
    verified?: boolean;
    colour?: 'G' | 'Y' | 'B';
    expiryDate?: string;
    refNumber?: string;
  };
  income: {
    frequency: string;
    incomeSupport: boolean;
    lastDate: string;
    lastAmount: number;
    source: string;
  };
  balanceCurrent: number;
  balanceLimit: number;
  balanceBook: number;
  collectionEmailPausedUntil: string;
  balanceOverdueAt: string;
  riskAssessmentId?: string;
  status: string;
}
