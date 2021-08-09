import Auth from '@aws-amplify/auth';
import toast from 'react-hot-toast';
import { get } from 'lodash';
import type { User } from '../types/users';

const apiRoot = process.env.REACT_APP_API_URL;

class UserApi {
  async getUsers(): Promise<User[]> {
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
      const users = (await res.json()) as User[];
      return users;
    } catch (err) {
      const errTitle = get(err, 'body.errors[0].title', 'Cannot get list users');
      toast.error(errTitle);
    }
    return [];
  }

  async getUser({ id }: { id: string }): Promise<User | undefined> {
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
      const errTitle = get(err, 'body.errors[0].title', 'Cannot get list users');
      toast.error(errTitle);
    }
    return undefined;
  }
}

export const userApi = new UserApi();
