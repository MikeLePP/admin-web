import Auth from '@aws-amplify/auth';
import { fetchUtils } from 'react-admin';

export const callApi = async (
  path: string,
  method = 'get',
  body?: Record<string, unknown>,
): Promise<any> => {
  const { signInUserSession } = await Auth.currentAuthenticatedUser();
  const options = {
    method: method.toUpperCase(),
    ...(body && { body: JSON.stringify(body) }),
    user: {
      authenticated: true,
      token: `Bearer ${String(signInUserSession.accessToken.jwtToken)}`,
    },
  };
  return fetchUtils.fetchJson(String(process.env.REACT_APP_API_URL) + String(path), options);
};
