import moment from 'moment';
import { useState, useEffect } from 'react';
import { useNotify } from 'react-admin';
import { callApi } from '../helpers/api';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';

export interface ITransaction {
  reportUrl: string;
  status: IStatus;
  dataLastAt: string;
}

export function useTransaction(userId: string): ITransaction {
  const [reportUrl, setReportUrl] = useState<string>('');
  const [status, setStatus] = useState<IStatus>('idle');
  const [dataLastAt, setDataLastAt] = useState<string>(moment('2020-12-1').utc.toString());
  const notify = useNotify();
  useEffect(() => {
    if (!userId) {
      return;
    }
    setStatus('loading');
    const getTransactions = async () => {
      try {
        const { json } = await callApi<{
          data: { meta: { reportUrl: string }; attributes: { dataLastAt: string } };
        }>(`/users/${userId}/bank-data`);
        setReportUrl(json.data.meta.reportUrl);
        setDataLastAt(json.data.attributes.dataLastAt);
      } catch (error) {
        notify(error, 'error');
      }
    };
    void getTransactions();
  }, [notify, userId]);
  return {
    reportUrl,
    status,
    dataLastAt,
  };
}
