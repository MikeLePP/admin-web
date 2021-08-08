import { useState, useEffect } from 'react';
import { useNotify } from 'react-admin';
import { callApi } from '../helpers/api';

type IStatus = 'idle' | 'loading' | 'success' | 'fail';

export interface ITransactionAttributes {
  amount?: number;
  amountFee?: number;
  bankAccountId?: string;
  description?: string;
  destinationId?: string;
  email?: string;
  firstName?: string;
  id: string;
  lastName?: string;
  mobileNumber?: string;
  paymentAccountId?: string;
  paymentType?: string;
  riskAssessmentId?: string;
  source?: string;
  sourceId?: string;
  status?: string;
  statusReason?: string;
  submitAt?: string;
  userId?: string;
  updatedBy?: string;
}

export interface ITransaction {
  status: IStatus;
  attributes?: ITransactionAttributes;
}

export function useTransaction(transactionId: string): ITransaction {
  const [status, setStatus] = useState<IStatus>('idle');
  const [transaction, setTransaction] = useState<ITransactionAttributes | undefined>();
  const notify = useNotify();
  useEffect(() => {
    if (!transactionId) {
      return;
    }
    setStatus('loading');
    const getBankData = async () => {
      try {
        const { json } = await callApi<ITransactionAttributes>(`/transactions/${transactionId}`);
        setTransaction(json);
        setStatus('success');
      } catch (error) {
        setStatus('fail');
        notify('Cannot get transaction', 'error');
      }
    };
    void getBankData();
  }, [notify, transactionId]);
  return {
    status,
    attributes: transaction,
  };
}
