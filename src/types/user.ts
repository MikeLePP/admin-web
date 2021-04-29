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
  bankAccount: {
    id: string;
    accountBsb: string;
    accountNumber: string;
    name: string;
    verified?: boolean;
  };
  identity?: {
    verified?: boolean;
  };
  income: {
    frequency: string;
    incomeSupport: boolean;
    lastDate: string;
    lastAmount: number;
    source: string;
  };
}
