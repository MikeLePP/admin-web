import { useState, useEffect } from 'react';
import { useNotify } from 'react-admin';
import { callApi } from '../helpers/api';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';

export interface RiskAssessment {
  approved: boolean;
  approvedAmount: number;
  incomeAverage: number;
  incomeDay1Min?: number;
  incomeFrequency: 'fortnightly' | 'monthly-by-date' | 'monthly-by-day' | 'weekly';
  incomeLastDate: string;
  incomeSupport: boolean;
  incomeVariationMax?: number;
  rejectedReasons?: string[];
  riskModelVersion: string;
  userId: string;
}

interface IRiskAssessment {
  riskAssessment?: RiskAssessment;
  status: IStatus;
}

export function useRiskAssessment(riskAssessmentId?: string): IRiskAssessment {
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | undefined>();
  const [status, setStatus] = useState<IStatus>('idle');
  const notify = useNotify();
  useEffect(() => {
    if (!riskAssessmentId) {
      return;
    }
    setStatus('loading');
    const getRiskAssessment = async () => {
      try {
        const {
          json: { data },
        } = await callApi<{
          data: { attributes: RiskAssessment };
        }>(`/risk-assessments/${riskAssessmentId}`);
        setRiskAssessment(data.attributes);
        setStatus('success');
      } catch (error) {
        setStatus('fail');
        notify("Cannot get user's risk assessment data", 'error');
      }
    };
    void getRiskAssessment();
  }, [notify, riskAssessmentId]);
  return {
    status,
    riskAssessment,
  };
}
