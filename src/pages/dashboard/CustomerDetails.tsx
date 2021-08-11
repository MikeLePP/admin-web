import { useCallback, useState, useEffect, useMemo } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {
  UserDetails,
  CustomerDataManagement,
  UserUpdateLimit,
  UserBankDetails,
  UserSwapMobileNumber,
} from '../../components/dashboard/customer';
import ChevronRightIcon from '../../icons/ChevronRight';
import PencilAltIcon from '../../icons/PencilAlt';
import gtm from '../../lib/gtm';
import useSettings from '../../hooks/useSettings';
import { getUser, updateBalanceLimit, swapMobileNumber } from '../../slices/user';
import { useDispatch, useSelector } from '../../store';
import { getFullname } from '../../lib/string';

const tabs = [{ label: 'Details', value: 'details' }];

const CustomerDetails: FC = () => {
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState<string>('details');
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { userId: id } = useParams();

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
    [dispatch, id],
  );

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Management: User Details</title>
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
              <Grid container spacing={3}>
                <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                  <UserDetails user={user} />
                </Grid>
                <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                  <UserBankDetails user={user} />
                </Grid>
                <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                  <UserUpdateLimit user={user} onUpdateLimit={handleUpdateLimit} />
                </Grid>
                <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                  <UserSwapMobileNumber user={user} onSwapPhoneNumber={handleSwapMobileNumber} />
                </Grid>
                <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                  <CustomerDataManagement />
                </Grid>
              </Grid>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CustomerDetails;
