import moment from 'moment';
import { useState, useEffect } from 'react';
import { useNotify } from 'react-admin';
import { callApi } from '../helpers/api';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';

export interface IBankData {
  reportUrl: string;
  status: IStatus;
  dataLastAt: string | undefined;
}

export function useBankData(userId: string): IBankData {
  const [reportUrl, setReportUrl] = useState<string>('');
  const [status, setStatus] = useState<IStatus>('idle');
  const [dataLastAt, setDataLastAt] = useState<string | undefined>();
  const notify = useNotify();
  useEffect(() => {
    if (!userId) {
      return;
    }
    setStatus('loading');
    const getBankData = async () => {
      try {
        const {
          json: {
            data: { meta, attributes },
          },
        } = await callApi<{
          data: { meta: { reportUrl: string }; attributes: { dataLastAt: string } };
        }>(`/users/${userId}/bank-data`);
        setReportUrl(meta.reportUrl);
        if (attributes.dataLastAt) {
          setDataLastAt(moment(attributes.dataLastAt).toString());
        }
      } catch (error) {
        notify("Cannot get user's bank data", 'error');
      }
    };
    void getBankData();
  }, [notify, userId]);
  return {
    reportUrl,
    status,
    dataLastAt,
  };
}
