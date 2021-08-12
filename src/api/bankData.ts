import Auth from '@aws-amplify/auth';
import toast from 'react-hot-toast';
import { get } from 'lodash';
import { getAuthToken } from '../helpers/auth';

const apiRoot = process.env.REACT_APP_API_URL;
class BankApi {
  async postBankData(userId: string): Promise<any> {
    try {
      await fetch(`${apiRoot}/messaging/bank-data`, {
        method: 'POST',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      });
      toast.success('Request bank data success');
    } catch (err) {
      const errTitle = get(err, 'body.errors[0].title', 'Request bank data failed');
      toast.error(errTitle);
    }
  }
}

export const bankApi = new BankApi();
