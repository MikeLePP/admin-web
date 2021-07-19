import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useNotify } from 'react-admin';
import { callApi } from '../helpers/api';
import { RiskModel } from '../types/risk-model';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';

type IRiskModels = {
  riskModels?: RiskModel[];
  status: IStatus;
};

type IRiskModel = {
  riskModel?: RiskModel;
  status: IStatus;
};

export function useRiskModel(riskModelId: string): IRiskModel {
  const [riskModel, setRiskModel] = useState<RiskModel | undefined>(undefined);
  const [status, setStatus] = useState<IStatus>('idle');
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
    })().catch((err) => {
      notify('Cannot get risk model', 'error');
      setStatus('fail');
    });
  }, [notify, riskModelId]);
  return {
    riskModel,
    status,
  };
}

export function useRiskModels({
  filter = {},
  range = [0.9],
  sort = ['createdAt', 'DESC'],
}: {
  filter?: Record<string, string>;
  range?: number[];
  sort?: string[];
}): IRiskModels {
  const [riskModels, setRiskModels] = useState<RiskModel[] | undefined>(undefined);
  const [status, setStatus] = useState<IStatus>('idle');
  const notify = useNotify();
  useEffect(() => {
    setStatus('loading');
    const queryString = new URLSearchParams({
      filter: JSON.stringify(filter),
      range: JSON.stringify(range),
      sort: JSON.stringify(sort),
    }).toString();

    (async () => {
      const response = await callApi(`/risk-models?${queryString}`);
      const riskModelResponse = get(response, 'json', {}) as RiskModel[];
      setStatus('success');
      setRiskModels(riskModelResponse);
    })().catch((err) => {
      notify('Cannot get risk model', 'error');
      setStatus('fail');
    });
  }, [filter, notify, range, sort]);
  return {
    riskModels,
    status,
  };
}
