import { get, map } from 'lodash';
import moment from 'moment';
import toast from 'react-hot-toast';
import { getAuthToken } from '../helpers/auth';
import { flatObject } from '../lib/apiHelpers';
import type { BankAccount } from '../types/bankAccount';
import type { User, UserStatus } from '../types/users';
import { TransactionsAccount, UserIdentity } from '../types/transactionsAccount';

const apiRoot = process.env.REACT_APP_API_URL;

class UserApi {
  async deleteUser(userId: string): Promise<void> {
    await fetch(`${apiRoot}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: await getAuthToken(),
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json();
        throw new Error(get(body, 'errors[0].title', 'Cannot delete user'));
      }
      return undefined;
    });
  }

  async getUsers(
    filter: Record<string, unknown> = {},
    range = '[0,9]',
    sort = 'sort=["createdAt","DESC"]',
  ): Promise<User[]> {
    try {
      const res = await fetch(
        `${apiRoot}/users?filter=${encodeURIComponent(JSON.stringify(filter))}&range=${encodeURIComponent(
          range,
        )}&sort=${encodeURIComponent(sort)}`,
        {
          method: 'GET',
          headers: {
            Authorization: await getAuthToken(),
          },
        },
      );
      const jsonResponse = (await res.json()) as { data: { attributes: User; id: string; type: string }[] };
      return jsonResponse.data.map(flatObject);
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot get users'));
    }
    return [];
  }

  async getUsersInArrears(
    comparer: string,
    frequencyCount: number,
    pageKey?: Record<string, unknown>,
  ): Promise<{ user: User[]; meta: { pageKey: Record<string, unknown> } }> {
    const pageKeyQuery = pageKey ? `&pageKey=${encodeURIComponent(JSON.stringify(pageKey))}` : '';
    try {
      const res = await fetch(
        `${apiRoot}/users/balance-overdue?comparer=${comparer}&frequencyCount=${frequencyCount}${pageKeyQuery}`,
        {
          method: 'GET',
          headers: {
            Authorization: await getAuthToken(),
          },
        },
      );
      const jsonResponse = (await res.json()) as {
        data: { attributes: User; id: string; type: string }[];
        meta: { pageKey: Record<string, unknown> };
      };
      const { meta } = jsonResponse;
      return { user: jsonResponse.data.map(flatObject), meta };
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot get in arrears users'));
    }
    return {
      user: [],
      meta: {
        pageKey: {},
      },
    };
  }

  async getUser({ id }: { id: string }): Promise<User | undefined> {
    try {
      const res = await fetch(`${apiRoot}/users/${id}`, {
        headers: {
          Authorization: await getAuthToken(),
        },
      });
      const user = (await res.json()) as { data: any };
      return flatObject<User>(user.data);
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot get user details'));
    }
    return undefined;
  }

  async getBankAccount(userId: string): Promise<BankAccount[]> {
    try {
      const res = await fetch(`${apiRoot}/users/${userId}/bank-accounts`, {
        method: 'GET',
        headers: {
          Authorization: await getAuthToken(),
        },
      });
      const jsonResponse = (await res.json()) as { data: { attributes: BankAccount; id: string }[] };
      return jsonResponse.data.map(flatObject);
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot get bank accounts'));
    }
    return [];
  }

  async getBankData(userId: string): Promise<any> {
    try {
      const res = await fetch(`${apiRoot}/users/${userId}/bank-data`, {
        method: 'GET',
        headers: {
          Authorization: await getAuthToken(),
        },
      });
      const jsonResponse = (await res.json()) as {
        data: { meta: { reportUrl: string }; attributes: { dataLastAt: string } };
      };
      return jsonResponse;
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot get bank data'));
    }
    return {};
  }

  async postBankData(userId: string, days: number): Promise<any> {
    try {
      const res = await fetch(`${apiRoot}/users/${userId}/bank-data?days=${days}`, {
        method: 'POST',
        headers: {
          Authorization: await getAuthToken(),
        },
      });
      const jsonResponse = (await res.json()) as {
        data: { meta: { reportUrl: string }; attributes: { dataLastAt: string } };
      };
      return jsonResponse;
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot submit bank data'));
    }
    return {};
  }

  async updateBalanceLimit(userId: string, balanceLimit: number): Promise<void> {
    try {
      await fetch(`${apiRoot}/users/${userId}/balance-limit`, {
        method: 'PATCH',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          balanceLimit,
        }),
      });
      toast.success("User's balance limit has been updated");
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', "Cannot update user's balance limit"));
    }
  }

  async swapMobileNumber(userId: string, swapUserId: number): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${apiRoot}/users/${userId}/mobile-number/swap`, {
        method: 'POST',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: swapUserId,
        }),
      });
      if (res.status !== 204) {
        const jsonRes = await res.json();
        if (jsonRes && jsonRes.errors) {
          toast.error(get(jsonRes, 'errors[0].title', 'Cannot swap mobile number'));
          return {
            success: false,
          };
        }
      }
      toast.success('Swapped mobile numbers');
      return {
        success: true,
      };
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot swap mobile number'));
      return {
        success: false,
      };
    }
  }

  async updateUser(userId: string, user: User): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${apiRoot}/users/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (res.status !== 200) {
        return {
          success: false,
        };
      }
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', "Cannot update user's details"));
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  }

  async updateUserStatus(
    userId: string,
    status: typeof UserStatus[number],
    statusReason: string,
    updatedBy?: string,
  ): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${apiRoot}/users/${userId}/status`, {
        method: 'PATCH',
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
      if (res.status !== 200) {
        return {
          success: false,
        };
      }
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', "Cannot update user's status"));
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  }

  async updateCollectionReminderPausedUntil(
    userId: string,
    collectionReminderPausedUntil: string,
  ): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${apiRoot}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionReminderPausedUntil: collectionReminderPausedUntil
            ? moment.utc(collectionReminderPausedUntil).toISOString()
            : null,
        }),
      });
      if (res.status !== 200) {
        toast.error("Updating user's collection reminder failed");
        return {
          success: false,
        };
      }
      toast.success(
        collectionReminderPausedUntil
          ? "User's collection reminders have paused"
          : "User's collection reminders have resumed",
      );
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', "Cannot update user's collection reminder pause date"));
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  }

  async userSplitPayment(
    userId: string,
    params: {
      count: string;
      amount: string;
      fee: string;
      pauseCollectionReminder: boolean;
      cancelAllPendingTransactions: boolean;
    },
  ): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${apiRoot}/users/${userId}/split-payments`, {
        method: 'POST',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      const resJson = await res.json();
      if (res.status !== 200) {
        toast.error(get(resJson, 'errors[0].title', "Cannot split user's payment"));
        return {
          success: false,
        };
      }
      toast.success("Split user's payment success");
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', "Cannot split user's payment"));
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  }

  async getUserBankAccounts(userId: string) {
    try {
      const res = await fetch(`${apiRoot}/users/${userId}/bank-data/accounts`, {
        method: 'GET',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
      });
      if (res.status !== 200) {
        return {
          success: false,
          error: res.json(),
        };
      }
      const resJson = await res.json();
      return {
        success: true,
        transactionAccountList: resJson.data,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
        errorMessage: get(err, 'data.errors[0].title', 'Cannot user bankaccounts'),
      };
    }
  }

  async createSelectedBankAccountsAndOnboardUser(
    selectedBankAccounts: TransactionsAccount[],
    userId: string,
    identity?: UserIdentity,
    notifyUser = false,
  ) {
    try {
      // call bank to create selected bank accounts
      const createBankAccountsRes = await fetch(`${apiRoot}/users/${userId}/bank-accounts`, {
        method: 'PUT',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: map(selectedBankAccounts, (account) => ({
            attributes: {
              accountBsb: account.attributes.accountBsb,
              accountName: account.attributes.accountName,
              accountNumber: account.attributes.accountNumber,
              accountType: account.attributes.accountType,
              bankDataAccountId: account.id,
              bankName: account.attributes.institutionName,
              createdBy: identity?.id,
            },
          })),
        }),
      });

      // call onboarding api to complete this step
      const onboardingRes = await fetch(`${apiRoot}/onboarding/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: await getAuthToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'bank-account',
          notifyUser,
          updatedBy: identity?.id,
        }),
      });
      if ((await createBankAccountsRes.json()).status !== 200 || (await onboardingRes.json()).status !== 200) {
        return {
          success: false,
          errorMessage: 'API respond unsuccess',
        };
      }
      return {
        success: true,
      };
    } catch (err) {
      return {
        error: err,
        errorMessage: get(err, 'data.errors[0].title', 'Cannot onboard user'),
        success: false,
      };
    }
  }
}

export const userApi = new UserApi();
