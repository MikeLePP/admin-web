import React, { useEffect, useState, useContext } from 'react';
import Auth from '@aws-amplify/auth';
import Amplify, { Hub } from '@aws-amplify/core';
import { HubCapsule } from '@aws-amplify/core/lib-esm/Hub';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AuthClass } from '@aws-amplify/auth/lib-esm/Auth';
import { UserIdentity } from 'react-admin';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

export const NOT_INSIDE_AMPLIFY_PROVIDER =
  'No AuthenticationContext. Did you forget to wrap your app in <AmplifyProvider />?';

/** Provides the entire Auth object via a hook to use it with hooks. Sugar. */
const AmplifyAuthContext = React.createContext<AuthClass | undefined>(undefined);

/** Provides just the user object */
const UserContext = React.createContext<CognitoUser | undefined>(undefined);

/**
 * This is written specifically for Amplify/Hub, however, you can replace
 * this provider with another provider (say <AzureProvider />) that replicates
 * the API above and everything using useAuth and useUser should just work!
 */
export const AmplifyAuthProvider: React.FC = ({ children }) => {
  // on mount, store the user and listen to hub changes (Amplify's internal)
  const [user, setUser] = useState<undefined | CognitoUser>(undefined);
  useEffect(() => {
    // get user on mount with a immediately invoked function
    (async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser === 'not authenticated' ? undefined : currentUser);
      } catch (error) {
        // trackBug(error)
      }
    })()
      .then(() => null)
      .catch((err) => new Error(err));

    // bind hub listener for auth changes
    const listener = async ({ payload }: HubCapsule) => {
      if (payload.event === 'signIn') {
        try {
          const currentUser = await Auth.currentAuthenticatedUser();
          setUser(currentUser);
        } catch (error) {
          // trackBug(error)
        }
      } else if (payload.event === 'signOut') {
        setUser(undefined);
      }
    };
    Hub.listen('auth', (payload) => {
      (async () => {
        await listener(payload);
      })()
        .then(() => null)
        .catch((err) => new Error(err));
    });

    // clean up hub listener
    return () => {
      Hub.remove('auth', (payload) => {
        (async () => {
          await listener(payload);
        })()
          .then(() => null)
          .catch((err) => new Error(err));
      });
    };
  }, []);

  /**
   * Used by react-admin
   */

  return (
    <AmplifyAuthContext.Provider value={Auth}>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </AmplifyAuthContext.Provider>
  );
};

export function useAuth(): any {
  const context = useContext(AmplifyAuthContext);
  if (!context) throw Error(NOT_INSIDE_AMPLIFY_PROVIDER);
  return context;
}

export function useAuthProvider(): any {
  return {
    /** Signs in either using username and password, or federated if a provider is passed. */
    login: ({ username, password, provider }: any) =>
      username && password && !provider
        ? Auth.signIn(username, password)
        : Auth.federatedSignIn({ provider }),
    logout: () => Auth.signOut(),
    checkAuth: async () => {
      await Auth.currentSession();
    },
    checkError: () => Promise.resolve(),
    getIdentity: (): Promise<UserIdentity> =>
      new Promise(async (resolve, reject) => {
        try {
          const userSession = await Auth.currentSession();
          const idToken = userSession.getIdToken();
          const { email } = idToken.payload;
          return resolve({ id: email, fullName: email, avatar: '' });
        } catch (error) {
          return reject(error);
        }
      }),
    /** Providers permissions for the whole app. identityId is used with S3Input. */
    getPermissions: () =>
      Promise.all([Auth.currentSession(), Auth.currentCredentials()]).then(
        ([session, { identityId }]) => ({
          claims: { ...session.getIdToken().payload, identityId },
        }),
      ),
  };
}

export function useUser(): any {
  const context = useContext(UserContext);
  return context;
}
