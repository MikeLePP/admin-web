import Auth from '@aws-amplify/auth';

export const getAuthToken = async (): Promise<string> => {
  const { signInUserSession } = await Auth.currentAuthenticatedUser();
  return String(signInUserSession.accessToken.jwtToken);
};
