import { Suspense, lazy } from 'react';
import type { PartialRouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DocsLayout from './components/docs/DocsLayout';
import GuestGuard from './components/GuestGuard';
import LoadingScreen from './components/LoadingScreen';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// Authentication pages

const Login = Loadable(lazy(() => import('./pages/authentication/Login')));
const PasswordChange = Loadable(lazy(() => import('./pages/authentication/PasswordChange')));
const PasswordRecovery = Loadable(lazy(() => import('./pages/authentication/PasswordRecovery')));
const PasswordReset = Loadable(lazy(() => import('./pages/authentication/PasswordReset')));
const VerifyCode = Loadable(lazy(() => import('./pages/authentication/VerifyCode')));

// User pages

const UserDetails = Loadable(lazy(() => import('./pages/user/UserDetails')));
const UserEdit = Loadable(lazy(() => import('./pages/user/UserEdit')));
const UserList = Loadable(lazy(() => import('./pages/user/UserList')));

// Reporting
const StaticLossReport = Loadable(lazy(() => import('./pages/reporting/StaticLossReport')));

// Docs pages

const Docs = Loadable(lazy(() => import('./pages/Docs')));

// Error pages

const AuthorizationRequired = Loadable(lazy(() => import('./pages/AuthorizationRequired')));
const NotFound = Loadable(lazy(() => import('./pages/NotFound')));
const ServerError = Loadable(lazy(() => import('./pages/ServerError')));

export const routes: PartialRouteObject[] = [
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'login-unguarded',
        element: <Login />,
      },
      {
        path: 'password-recovery',
        element: <PasswordRecovery />,
      },
      {
        path: 'password-reset',
        element: <PasswordReset />,
      },
      {
        path: 'password-change',
        element: <PasswordChange />,
      },
      {
        path: 'verify-code',
        element: <VerifyCode />,
      },
    ],
  },
  {
    path: 'management',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'users',
        children: [
          {
            path: '/',
            element: <UserList />,
          },
          {
            path: ':userId',
            element: <UserDetails />,
          },
          {
            path: ':userId/:tabId',
            element: <UserDetails />,
          },
          {
            path: ':userId/edit',
            element: <UserEdit />,
          },
        ],
      },
    ],
  },
  {
    path: 'reporting',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/reporting/static-loss" replace />,
      },
      {
        path: 'static-loss',
        children: [
          {
            path: '/',
            element: <StaticLossReport />,
          },
          {
            path: ':tabId',
            element: <StaticLossReport />,
          },
        ],
      },
    ],
  },
  {
    path: 'docs',
    element: <DocsLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/docs/overview/welcome" replace />,
      },
      {
        path: '*',
        element: <Docs />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/management/users" />,
      },
      {
        path: '401',
        element: <AuthorizationRequired />,
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '500',
        element: <ServerError />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
