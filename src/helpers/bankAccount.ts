import { reduce } from 'lodash';
import { BankAccountData, BankAccount } from '../features/user-onboarding/OnboardingSteps';

export const parseBankAccount = (bankAccounts: BankAccountData[]): BankAccount[] =>
  reduce(
    bankAccounts,
    (acc, cur) => {
      acc.push({
        ...cur.attributes,
        id: cur.id,
      });
      return acc;
    },
    [] as BankAccount[],
  );
