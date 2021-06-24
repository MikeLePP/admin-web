import { useState, useEffect } from 'react';
import { useNotify } from 'react-admin';
import { callApi } from '../helpers/api';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';

export interface ITransaction {
  reportUrl: string;
  status: IStatus;
}

export function useTransaction(userId: string): ITransaction {
  const [reportUrl, setReportUrl] = useState<string>('');
  const [status, setStatus] = useState<IStatus>('idle');
  const notify = useNotify();
  useEffect(() => {
    if (!userId) {
      return;
    }
    setStatus('loading');
    const getTransactions = async () => {
      try {
        const { json } = await callApi<{ data: { meta: { reportUrl: string } } }>(
          `/users/${userId}/bank-data`,
        );
        setReportUrl(json.data.meta.reportUrl);
      } catch (error) {
        notify(error, 'error');
      }
    };
    void getTransactions();
  }, [notify, userId]);
  return {
    reportUrl,
    status,
  };
}
