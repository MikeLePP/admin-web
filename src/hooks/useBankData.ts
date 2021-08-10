import moment from 'moment';
import { useState, useEffect } from 'react';
import { userApi } from '../api/user';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';

export interface IBankData {
  reportUrl: string;
  status: IStatus;
  dataLastAt: string | undefined;
  setDataLastAt: React.Dispatch<React.SetStateAction<string>>;
}

export function useBankData(userId: string): IBankData {
  const [reportUrl, setReportUrl] = useState<string>('');
  const [status, setStatus] = useState<IStatus>('idle');
  const [dataLastAt, setDataLastAt] = useState<string | undefined>();
  useEffect(() => {
    if (!userId) {
      return;
    }
    setStatus('loading');

    const getBankData = async () => {
      try {
        const {
          data: { meta, attributes },
        } = await userApi.getBankData(userId);
        setReportUrl(meta.reportUrl);
        if (attributes.dataLastAt) {
          setDataLastAt(moment(attributes.dataLastAt).toString());
        }
        setStatus('success');
      } catch (err) {
        setStatus('fail');
      }
    };
    void getBankData();
  }, [userId]);
  return {
    reportUrl,
    status,
    dataLastAt,
    setDataLastAt,
  };
}
