import Auth from '@aws-amplify/auth';
import type { User } from '../types/users';

const apiRoot = process.env.REACT_APP_API_URL;

class UserApi {
  async getUsers(): Promise<User[]> {
    console.log('apiRoot', apiRoot);
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    console.log(signInUserSession);
    try {
      const res = await fetch(
        `${apiRoot}/users?filter=%7B%7D&range=%5B0%2C9%5D&sort=%5B%22createdAt%22%2C%22DESC%22%5D`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${String(signInUserSession.accessToken.jwtToken)}`,
          },
        },
      );
      const user = (await res.json()) as User[];
      return user;
    } catch (err) {
      console.error('[Auth Api]: ', err);
      throw new Error('Internal server error');
    }
  }

  async getUser({ id }: { id: string }): Promise<User> {
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    try {
      const res = await fetch(`${apiRoot}/users/${id}`, {
        headers: {
          authorization: `Bearer ${signInUserSession as string}`,
        },
      });
      const user = (await res.json()) as User;
      return user;
    } catch (err) {
      console.error('[Auth Api]: ', err);
      throw new Error('Internal server error');
    }
  }
}

export const userApi = new UserApi();
