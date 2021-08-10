import { useCallback, useState, useEffect, useMemo } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {
  UserDetails,
  CustomerDataManagement,
  UserUpdatingLimit,
  CustomerInvoices,
  UserBankDetails,
  CustomerLogs,
} from '../../components/dashboard/customer';
import ChevronRightIcon from '../../icons/ChevronRight';
import PencilAltIcon from '../../icons/PencilAlt';
import gtm from '../../lib/gtm';
import useSettings from '../../hooks/useSettings';
import { getUser, updateBalanceLimit, swapMobileNumber } from '../../slices/user';
import { useDispatch, useSelector } from '../../store';
import { getFullname } from '../../lib/string';
import SwapPhoneNumber from '../../components/commons/SwapNumber';

const tabs = [
  { label: 'Details', value: 'details' },
  // { label: 'Invoices', value: 'invoices' },
  // { label: 'Logs', value: 'logs' },
];

const CustomerDetails: FC = () => {
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState<string>('details');
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { userId: id } = useParams();
  const [showSwapPhoneNumber, setShowWrapPhoneNumber] = useState(false);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const user = useMemo(() => {
    const {
      users: { byId },
      targetUserId,
    } = userSelector;
    return byId[targetUserId];
  }, [userSelector]);

  useEffect(() => {
    dispatch(getUser({ id }));
  }, [dispatch, id]);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const handleUpdateLimit = useCallback(
    (value: number) => {
      dispatch(updateBalanceLimit({ userId: id, balanceLimit: value }));
    },
    [dispatch, id],
  );

  const handleSwapPhoneNumber = useCallback(
    (userId: string) => {
      dispatch(swapMobileNumber({ userId: id, swapUserId: userId }));
    },
    [dispatch, id],
  );

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Customer Details | Material Kit Pro</title>
      </Helmet>
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
                {getFullname(user)}
              </Typography>
              <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRightIcon fontSize="small" />} sx={{ mt: 1 }}>
                <Link color="textPrimary" component={RouterLink} to="/management/users" variant="subtitle2">
                  Management
                </Link>
                <Link color="textPrimary" component={RouterLink} to="/management/users" variant="subtitle2">
                  Users
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  {user.email}
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
                  to="/dashboard/customers/1/edit"
                  variant="contained"
                >
                  Edit
                </Button>
                <Button
                  color="primary"
                  startIcon={<SwapHorizIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  variant="contained"
                  onClick={() => setShowWrapPhoneNumber(true)}
                >
                  Swap mobile number
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
              <Grid container spacing={3}>
                <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                  <UserDetails user={user} />
                </Grid>
                <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                  <UserBankDetails user={user} />
                </Grid>
                <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                  <UserUpdatingLimit user={user} onUpdateLimit={handleUpdateLimit} />
                </Grid>
                <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                  <CustomerDataManagement />
                </Grid>
              </Grid>
            )}
            {currentTab === 'invoices' && <CustomerInvoices />}
            {currentTab === 'logs' && <CustomerLogs />}
          </Box>
        </Container>
      </Box>
      <SwapPhoneNumber
        open={showSwapPhoneNumber}
        setOpen={setShowWrapPhoneNumber}
        user={user}
        onSwapPhoneNumber={handleSwapPhoneNumber}
      />
    </>
  );
};

export default CustomerDetails;
