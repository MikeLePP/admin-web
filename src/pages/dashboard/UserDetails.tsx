import { useCallback, useState, useEffect, useMemo } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  UserDetails as UserDetailsComponent,
  CustomerDataManagement,
  UserUpdateBalanceLimit,
  UserBankDetails,
  UserSwapMobileNumber,
} from '../../components/dashboard/users';
import ChevronRightIcon from '../../icons/ChevronRight';
import PencilAltIcon from '../../icons/PencilAlt';
import gtm from '../../lib/gtm';
import useSettings from '../../hooks/useSettings';
import { getUser, updateBalanceLimit, swapMobileNumber } from '../../slices/user';
import { useDispatch, useSelector } from '../../store';
import { getFullname } from '../../lib/userHelpers';
import NotFound from '../../components/commons/NotFound';

const tabs = [{ label: 'Details', value: 'details' }];

const UserDetails: FC = () => {
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState<string>('details');
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { userId: id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

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

  if (!user && !loading) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>Management: User Details</title>
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
                <Grid container spacing={3}>
                  <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                    <UserDetailsComponent user={user} />
                  </Grid>
                  <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                    <UserBankDetails user={user} />
                  </Grid>
                  <Grid item lg={settings.compact ? 6 : 4} md={6} xl={settings.compact ? 6 : 3} xs={12}>
                    <UserUpdateBalanceLimit user={user} onUpdateLimit={handleUpdateLimit} />
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
      )}
    </>
  );
};

export default UserDetails;