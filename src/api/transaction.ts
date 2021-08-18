import { get } from 'lodash';
import toast from 'react-hot-toast';
import { flatObject } from '../lib/apiHelpers';
import { getAuthToken } from '../helpers/auth';
import type { ITransactionAttributes, TransactionStatus } from '../types/transaction';

type ITransactionStatus = typeof TransactionStatus[number];

const apiRoot = process.env.REACT_APP_API_URL;
class TransactionApi {
  async getTransactionsByUserId(userId: string): Promise<ITransactionAttributes[]> {
    const filter = { userId };
    try {
      const res = await fetch(`${apiRoot}/transactions?filter=${encodeURIComponent(JSON.stringify(filter))}`, {
        method: 'GET',
        headers: {
          Authorization: await getAuthToken(),
        },
      });
      const jsonResponse = (await res.json()) as {
        data: { attributes: ITransactionAttributes; id: string; type: string }[];
      };
      return jsonResponse.data.map(flatObject);
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot get users'));
    }
    return [];
  }

  async reconcileTransaction({
    id,
    status,
    statusReason,
    updatedBy,
  }: {
    id: string;
    status: ITransactionStatus;
    statusReason?: string;
    updatedBy?: string;
  }): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${apiRoot}/transactions/${id}/reconcile`, {
        method: 'POST',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          statusReason,
          updatedBy,
        }),
      });
      if (res.status !== 204) {
        const resJson = await res.json();
        toast.error(get(resJson, 'errors[0].title', 'Reconciling transaction failed'));
        return {
          success: false,
        };
      }
      toast.success('Reconciling transaction successfully');
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Reconciling transaction failed'));
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  }

  async updateTransaction(transaction: ITransactionAttributes): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${apiRoot}/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      if (res.status !== 200) {
        const resJson = await res.json();
        toast.error(get(resJson, 'errors[0].title', 'Cannot update this transaction'));
        return {
          success: false,
        };
      }
      toast.success('Updating transaction successfully');
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot update this transaction'));
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  }
}

export const transactionApi = new TransactionApi();
