import { get } from 'lodash';
import toast from 'react-hot-toast';
import { flatObject } from '../lib/apiHelpers';
import { getAuthToken } from '../helpers/auth';
import type { ITransactionAttributes } from '../types/transaction';

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
      toast.error(get(err, 'body.errors[0].title', 'Cannot get transactions'));
    }
    return [];
  }
}

export const transactionApi = new TransactionApi();
