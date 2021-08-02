import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useNotify } from 'react-admin';
import { callApi } from '../../helpers/api';
import { User } from '../../types/user';
import { BankAccount } from '../../types/bank-account';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';
type IUserHook = {
  user?: User;
  status: IStatus;
};

type IBankAccountHook = {
  bankAccounts: BankAccount[];
  status: IStatus;
};

export function useUser(userId: string): IUserHook {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [status, setStatus] = useState<IStatus>('idle');
  const notify = useNotify();
  useEffect(() => {
    if (!userId) {
      return;
    }
    setStatus('loading');
    (async () => {
      const response = await callApi(`/users/${userId}`);
      const userResponse = get(response, 'json', {}) as User;
      setStatus('success');
      setUser(userResponse);
    })().catch((err) => {
      notify('Cannot get user', 'error');
      setStatus('fail');
    });
  }, [notify, userId]);
  return {
    user,
    status,
  };
}

export function useBankAccount(userId?: string): IBankAccountHook {
  const [bankAccounts, setBankAccounts] = useState([] as BankAccount[]);
  const notify = useNotify();
  const [status, setStatus] = useState<IStatus>('idle');

  useEffect(() => {
    setStatus('loading');
    if (!userId) {
      return;
    }
    (async () => {
      const response = await callApi(`/users/${userId}/bank-accounts`);
      const mappingBankAccounts: BankAccount[] = (
        get(response, 'json.data', []) as { attributes: BankAccount; id: string }[]
      ).map((item) => ({
        bankAccountId: item.id,
        accountBsb: item.attributes.accountBsb,
        accountNumber: item.attributes.accountNumber,
        bankName: item.attributes.bankName,
        accountType: item.attributes.accountType,
        accountName: item.attributes.accountName,
        paymentAccountId: item.attributes.paymentAccountId,
      }));
      setBankAccounts(mappingBankAccounts);
      setStatus('success');
    })()
      .then(() => null)
      .catch((err) => {
        notify('Cannot get bank account', 'error');
        setStatus('fail');
      });
  }, [notify, userId]);
  return {
    bankAccounts,
    status,
  };
}
