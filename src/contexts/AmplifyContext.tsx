import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { FederatedSignInOptions } from '@aws-amplify/auth/lib-esm/types';
import { amplifyConfig } from '../config';
import type { User } from '../types/user';

Amplify.configure(amplifyConfig);

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends State {
  platform: 'Amplify';
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyCode: (username: string, code: string) => Promise<void>;
  resendCode: (username: string) => Promise<void>;
  passwordRecovery: (username: string) => Promise<void>;
  passwordReset: (username: string, code: string, newPassword: string) => Promise<void>;
  passwordChange: (username: string, existingPassword: string, newPassword: string) => Promise<void>;
  passwordComplete: (username: string, existingPassword: string, newPassword: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
};

type VerifyCodeAction = {
  type: 'VERIFY_CODE';
};

type ResendCodeAction = {
  type: 'RESEND_CODE';
};
type PasswordRecoveryAction = {
  type: 'PASSWORD_RECOVERY';
};

type PasswordResetAction = {
  type: 'PASSWORD_RESET';
};

type PasswordChangeAction = {
  type: 'PASSWORD_CHANGE';
};
type PasswordCompleteAction = {
  type: 'PASSWORD_COMPLETE';
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | VerifyCodeAction
  | ResendCodeAction
  | PasswordRecoveryAction
  | PasswordResetAction
  | PasswordCompleteAction
  | PasswordChangeAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state: State): State => ({ ...state }),
  VERIFY_CODE: (state: State): State => ({ ...state }),
  RESEND_CODE: (state: State): State => ({ ...state }),
  PASSWORD_RECOVERY: (state: State): State => ({ ...state }),
  PASSWORD_RESET: (state: State): State => ({ ...state }),
  PASSWORD_CHANGE: (state: State): State => ({ ...state }),
  PASSWORD_COMPLETE: (state: State): State => ({ ...state }),
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'Amplify',
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve(),
  passwordChange: () => Promise.resolve(),
  passwordComplete: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const user = await Auth.currentAuthenticatedUser();

        // Here you should extract the complete user profile to make it
        // available in your entire app.
        // The auth state only provides basic information.

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user: {
              id: user.sub,
              avatar: user.attributes.picture,
              email: user.attributes.email,
              name: user.attributes.name,
              plan: 'Admin',
            },
          },
        });
      } catch (error) {
        console.log({ error });
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    void initialize();
  }, []);

  const signInWithEmailAndPassword = async (email: string, password: string): Promise<any> => {
    const user = await Auth.signIn(email, password);
    if (user.challengeName) {
      console.error(
        `Unable to login, because challenge "${
          user.challengeName as string
        }" is mandated and we did not handle this case.`,
      );
      return user;
    }

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          id: user.attributes.sub,
          avatar: user.attributes.picture,
          email: user.attributes.email,
          name: user.attributes.name,
          plan: 'Admin',
        },
      },
    });
    return user;
  };

  const signInWithGoogle = async (): Promise<void> => {
    const user = await Auth.federatedSignIn({ provider: 'Google' } as FederatedSignInOptions);
    console.log({ user });
    dispatch({
      type: 'VERIFY_CODE',
    });
  };

  const logout = async (): Promise<void> => {
    await Auth.signOut();
    dispatch({
      type: 'LOGOUT',
    });
  };

  const register = async (email: string, password: string): Promise<void> => {
    await Auth.signUp({
      username: email,
      password,
      attributes: { email },
    });
    dispatch({
      type: 'REGISTER',
    });
  };

  const verifyCode = async (username: string, code: string): Promise<void> => {
    await Auth.confirmSignUp(username, code);
    dispatch({
      type: 'VERIFY_CODE',
    });
  };

  const resendCode = async (username: string): Promise<void> => {
    await Auth.resendSignUp(username);
    dispatch({
      type: 'RESEND_CODE',
    });
  };

  const passwordRecovery = async (username: string): Promise<void> => {
    await Auth.forgotPassword(username);
    dispatch({
      type: 'PASSWORD_RECOVERY',
    });
  };

  const passwordReset = async (username: string, code: string, newPassword: string): Promise<void> => {
    await Auth.forgotPasswordSubmit(username, code, newPassword);
    dispatch({
      type: 'PASSWORD_RESET',
    });
  };

  const passwordChange = async (email: string, existingPassword: string, newPassword: string): Promise<void> => {
    const user = await Auth.signIn(email, existingPassword);
    await Auth.changePassword(user, existingPassword, newPassword);
    dispatch({
      type: 'PASSWORD_CHANGE',
    });
  };

  const passwordComplete = async (email: string, existingPassword: string, newPassword: string): Promise<void> => {
    const user = await Auth.signIn(email, existingPassword);
    await Auth.completeNewPassword(user, newPassword, {
      email,
    });
    dispatch({
      type: 'PASSWORD_COMPLETE',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Amplify',
        signInWithEmailAndPassword,
        signInWithGoogle,
        logout,
        register,
        verifyCode,
        resendCode,
        passwordRecovery,
        passwordReset,
        passwordChange,
        passwordComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
