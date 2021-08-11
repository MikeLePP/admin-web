import { startCase } from 'lodash';

export const formatBankAccount = (account: {
  accountBsb?: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
}): string =>
  `${account.accountBsb ? `${account.accountBsb.slice(0, 3)}-${account.accountBsb.slice(3, 6)} ` : ''}${
    account.accountNumber
  } - ${account.accountName} (${startCase(account.accountType)})`;
