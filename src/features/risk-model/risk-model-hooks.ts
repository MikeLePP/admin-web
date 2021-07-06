import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useNotify } from 'react-admin';
import { callApi } from '../../helpers/api';
import { RiskModel } from '../../types/risk-model';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';

type IRiskModel = {
  riskModel?: RiskModel;
  status: IStatus;
};

export function useRiskModel(riskModelId: string): IRiskModel {
  const [riskModel, setRiskModel] = useState<RiskModel | undefined>(undefined);
  const [status, setStatus] = useState<IStatus>('idle');
  const [approvedLimit, setApprovedLimit] = useState(0);
  const notify = useNotify();
  useEffect(() => {
    if (!riskModelId) {
      return;
    }
    setStatus('loading');
    (async () => {
      const response = await callApi(`/risk-models/${riskModelId}`);
      const riskModelResponse = get(response, 'json', {}) as RiskModel;
      setStatus('success');
      setRiskModel(riskModelResponse);
      setApprovedLimit(riskModelResponse.ruleSets.length);
    })().catch((err) => {
      notify('Cannot get risk-model', 'error');
      setStatus('fail');
    });
  }, [notify, riskModelId]);
  return {
    riskModel,
    status,
  };
}
