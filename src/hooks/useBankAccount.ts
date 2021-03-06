import { useEffect, useState } from 'react';
import { userApi } from '../api/user';
import { BankAccount } from '../types/bankAccount';

export type IStatus = 'idle' | 'loading' | 'success' | 'fail';

type IBankAccountHook = {
  bankAccounts: BankAccount[];
  status: IStatus;
};

export function useBankAccount(userId?: string): IBankAccountHook {
  const [bankAccounts, setBankAccounts] = useState([] as BankAccount[]);
  const [status, setStatus] = useState<IStatus>('idle');

  useEffect(() => {
    setStatus('loading');
    if (!userId) {
      return;
    }
    (async () => {
      const mappingBankAccounts = await userApi.getBankAccount(userId);
      setBankAccounts(mappingBankAccounts);
      setStatus('success');
    })()
      .then(() => null)
      .catch((err) => {
        setStatus('fail');
      });
  }, [userId]);
  return {
    bankAccounts,
    status,
  };
}
