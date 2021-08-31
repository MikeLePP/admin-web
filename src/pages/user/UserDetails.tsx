import classNames from 'classnames';
import { Box, Breadcrumbs, Button, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import type { ChangeEvent, FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import NotFound from '../../components/commons/NotFound';
import {
  UserBankDetails,
  UserCollectionDetails,
  UserCollectionEmail,
  UserDelete,
  UserDetails as UserDetailsComponent,
  UserSplitPayment,
  UserSwapMobileNumber,
  UserTransactions,
  UserUpdateBalanceLimit,
  UserUpdateStatus,
} from '../../components/users';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import PencilAltIcon from '../../icons/PencilAlt';
import gtm from '../../lib/gtm';
import { getFullName } from '../../lib/userHelpers';
import { getTransactionsByUserId, reconcileTransaction, updateTransaction } from '../../slices/transaction';
import {
  deleteUser,
  getUser,
  splitPayment,
  swapMobileNumber,
  updateBalanceLimit,
  updateCollectionEmailPausedUntil,
  updateUserStatus,
} from '../../slices/user';
import { useDispatch, useSelector } from '../../store';
import { UserStatus } from '../../types/users';

const tabs = [
  { label: 'Details', value: 'details' },
  { label: 'Collections', value: 'collections' },
];

const UserDetails: FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();
  const { userId: id, tabId } = useParams();
  const userSelector = useSelector((state) => state.user);
  const transactionSelector = useSelector((state) => state.transaction);
  const [currentTab, setCurrentTab] = useState<string>(tabs[0].value);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);
  useEffect(() => {
    const defaultTabValue = tabs[0].value;
    if (!tabId) {
      setCurrentTab(defaultTabValue);
    }
    const matchedTab = tabs.find((tab) => tab.value === tabId);
    setCurrentTab(matchedTab?.value || defaultTabValue);
  }, [tabId]);

  const user = useMemo(() => {
    const {
      users: { byId },
      targetUserId,
    } = userSelector;
    const foundUser = byId[targetUserId];
    if (foundUser) {
      setLoading(false);
    }
    return foundUser;
  }, [userSelector]);

  const transactions = useMemo(() => {
    const {
      transactions: { byId, allIds },
    } = transactionSelector;
    return allIds.map((transactionId) => byId[transactionId]);
  }, [transactionSelector]);

  useEffect(() => {
    dispatch(getUser({ id }));
    dispatch(getTransactionsByUserId(id));
  }, [dispatch, id]);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
    navigate(`/management/users/${id}/${value}`);
  };

  const handleUpdateLimit = useCallback(
    (value: number) => {
      dispatch(updateBalanceLimit({ userId: id, balanceLimit: value }));
    },
    [dispatch, id],
  );

  const handleSwapMobileNumber = useCallback(
    (swappedUserId: string, swappedMobileNumber) => {
      dispatch(
        swapMobileNumber({
          userId: id,
          mobileNumber: user?.mobileNumber,
          swappedUserId,
          swappedMobileNumber,
        }),
      );
    },
    [dispatch, id, user?.mobileNumber],
  );

  const handleUpdateCollectionEmailPausedUntil = useCallback(
    (collectionEmailPausedUntil) => {
      dispatch(
        updateCollectionEmailPausedUntil({
          userId: id,
          collectionEmailPausedUntil,
        }),
      );
    },
    [dispatch, id],
  );

  const handleSplitPayment = useCallback(
    (params, callback) => {
      dispatch(
        splitPayment({
          userId: id,
          params,
          callback,
        }),
      );
    },
    [dispatch, id],
  );

  const handleReconcileTransaction = useCallback(
    (params, callback) => {
      dispatch(reconcileTransaction(params, callback));
    },
    [dispatch],
  );

  const handleUpdateTransaction = useCallback(
    (transactionsParams, callback) => {
      dispatch(updateTransaction(transactionsParams, callback));
    },
    [dispatch],
  );

  const handleUserStatusChanged = useCallback(
    (status: typeof UserStatus[number], statusReason: string) => {
      dispatch(
        updateUserStatus({
          userId: id,
          status,
          statusReason,
          updatedBy: auth.user.email,
          onComplete: ({ success }: { success: boolean }) => {
            if (success) {
              toast.success("User's status updated");
            }
          },
        }),
      );
    },
    [auth.user.email, dispatch, id],
  );

  const handleUserDeleted = useCallback(() => {
    dispatch(
      deleteUser({
        userId: id,
        onSuccess: () => {
          toast.success('User deleted');
          navigate('/management/users');
        },
        onError: (err) => toast.error(err.message),
      }),
    );
  }, [dispatch, navigate, id]);

  if (!user && !loading) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{`User details ${user?.mobileNumber}`}</title>
      </Helmet>
      {loading ? (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </div>
      ) : (
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 8,
          }}
        >
          <Container maxWidth={settings.compact ? 'xl' : false}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography color="textPrimary" variant="h5">
                  {getFullName(user)}
                </Typography>
                <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRightIcon fontSize="small" />} sx={{ mt: 1 }}>
                  <Link color="textPrimary" component={RouterLink} to="/management/users" variant="subtitle2">
                    Management
                  </Link>
                  <Link color="textPrimary" component={RouterLink} to={`/management/users`} variant="subtitle2">
                    Users
                  </Link>
                  <Typography color="textSecondary" variant="subtitle2">
                    {user.mobileNumber}
                  </Typography>
                </Breadcrumbs>
              </Grid>
              <Grid item>
                <Box sx={{ m: -1 }} display="flex">
                  <Button
                    color="primary"
                    component={RouterLink}
                    startIcon={<PencilAltIcon fontSize="small" />}
                    sx={{ m: 1 }}
                    to={`/management/users/${id}/edit`}
                    variant="contained"
                  >
                    Edit
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
            </Box>
            <Divider />
            <Box sx={{ mt: 3 }}>
              {currentTab === 'details' && (
                <Box className={classNames('items-start', 'gap-4', 'grid', 'grid-cols-1', 'lg:grid-cols-2')}>
                  <Box className={classNames('gap-4', 'flex', 'flex-col')}>
                    <UserDetailsComponent user={user} />
                    <UserBankDetails user={user} />
                  </Box>
                  <Box className={classNames('gap-4', 'flex', 'flex-col')}>
                    <UserUpdateBalanceLimit user={user} onUpdateLimit={handleUpdateLimit} />
                    <UserSwapMobileNumber user={user} onSwapPhoneNumber={handleSwapMobileNumber} />
                    <UserUpdateStatus user={user} onUserStatusChanged={handleUserStatusChanged} />
                    <UserDelete user={user} onUserDeleted={handleUserDeleted} />
                  </Box>
                </Box>
              )}
              {currentTab === 'collections' && (
                <Box className={classNames('items-start', 'gap-4', 'grid', 'grid-cols-1', 'lg:grid-cols-2')}>
                  <Box className={classNames('gap-4', 'flex', 'flex-col')}>
                    <UserCollectionDetails user={user} />
                    <UserCollectionEmail
                      user={user}
                      onUpdateCollectionEmailPausedUntil={handleUpdateCollectionEmailPausedUntil}
                    />
                    <UserSplitPayment user={user} onSplitPayment={handleSplitPayment} />
                  </Box>
                  <UserTransactions
                    user={user}
                    transactions={transactions}
                    onReconcileTransaction={handleReconcileTransaction}
                    onUpdateTransaction={handleUpdateTransaction}
                  />
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
};

export default UserDetails;
