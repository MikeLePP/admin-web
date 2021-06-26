import moment from 'moment';
import { useState, useEffect } from 'react';
import { useNotify } from 'react-admin';
import { callApi } from '../helpers/api';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';

export interface ITransaction {
  reportUrl: string;
  status: IStatus;
  dataLastAt: moment.Moment;
}

export function useTransaction(userId: string): ITransaction {
  const [reportUrl, setReportUrl] = useState<string>('');
  const [status, setStatus] = useState<IStatus>('idle');
  const [dataLastAt, setDataLastAt] = useState<moment.Moment>(moment(new Date(0)));
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
        setDataLastAt(moment(json.data.attributes.dataLastAt));
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
