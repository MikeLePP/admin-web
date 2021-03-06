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

interface IFilter {
  filter?: Record<string, string>;
  range?: number[];
  sort?: string[];
}

export function useRiskModel(riskModelId: string): IRiskModel {
  const [riskModel, setRiskModel] = useState<RiskModel | undefined>(undefined);
  const [status, setStatus] = useState<IStatus>('idle');
  const notify = useNotify();
  useEffect(() => {
    if (!riskModelId) {
      return;
    }
    setStatus('loading');
    async function getRiskModel() {
      try {
        const response = await callApi(`/risk-models/${riskModelId}`);
        const riskModelResponse = get(response, 'json', {}) as RiskModel;
        setStatus('success');
        setRiskModel(riskModelResponse);
      } catch (err) {
        notify('Cannot get risk model', 'error');
        setStatus('fail');
      }
    }
    void getRiskModel();
  }, [notify, riskModelId]);
  return {
    riskModel,
    status,
  };
}

export function useRiskModels(params?: IFilter): IRiskModels {
  const [riskModels, setRiskModels] = useState<RiskModel[] | undefined>(undefined);
  const [status, setStatus] = useState<IStatus>('idle');
  const notify = useNotify();
  useEffect(() => {
    const { filter = {}, range = [0.9], sort = ['createdAt', 'DESC'] } = params || {};
    setStatus('loading');
    const queryString = new URLSearchParams({
      filter: JSON.stringify(filter),
      range: JSON.stringify(range),
      sort: JSON.stringify(sort),
    }).toString();
    async function getRiskModels() {
      try {
        const response = await callApi(`/risk-models?${queryString}`);
        const riskModelResponse = get(response, 'json', {}) as RiskModel[];
        setStatus('success');
        setRiskModels(riskModelResponse);
      } catch (err) {
        notify('Cannot get risk models', 'error');
        setStatus('fail');
      }
    }
    void getRiskModels();
  }, [notify, params]);
  return {
    riskModels,
    status,
  };
}
