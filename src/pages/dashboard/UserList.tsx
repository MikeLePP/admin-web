import { Box, Breadcrumbs, Card, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { UserList as UserListComponent, UserListInArrears } from '../../components/users';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { exportUserCSV, filterMoreUsers, filterUsers, getUsers, getUsersWithFilter } from '../../slices/user';
import { useDispatch, useSelector } from '../../store';

const tabs = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'In arrears',
    value: 'inArrears',
  },
];

const UserList: FC = () => {
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const userSelector = useSelector((state) => state.user);
  const [currentTab, setCurrentTab] = useState<string>(tabs[0].value);
  const [frequencyCount, setFrequencyCount] = useState(1);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(() => {
    if (currentTab === 'all') {
      dispatch(getUsers());
    } else if (currentTab === 'inArrears') {
      dispatch(filterUsers(frequencyCount));
    }
  }, [dispatch, currentTab, frequencyCount]);

  const user = useMemo(() => {
    const {
      users: { allIds, byId },
    } = userSelector;
    return allIds.map((id) => byId[id]);
  }, [userSelector]);

  const loadingState = useMemo(() => userSelector.status === 'loading', [userSelector]);
  const pageKey = useMemo(() => userSelector.pageKey, [userSelector]);

  const handleFilterUserInArrears = useCallback((newFrequencyCount) => {
    setFrequencyCount(newFrequencyCount);
  }, []);

  const handleLoadMore = useCallback(() => {
    dispatch(filterMoreUsers(frequencyCount));
  }, [dispatch, frequencyCount]);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const handleFilter = useCallback(
    (query) => {
      dispatch(getUsersWithFilter(query));
    },
    [dispatch],
  );

  const handleExport = useCallback(() => {
    dispatch(exportUserCSV());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Management: User List</title>
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
                User List
              </Typography>
              <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRightIcon fontSize="small" />} sx={{ mt: 1 }}>
                <Link color="textPrimary" component={RouterLink} to="/" variant="subtitle2">
                  Management
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  Users
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Card>
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
              <Divider />
              {currentTab === tabs[0].value && (
                <UserListComponent loading={loadingState} users={user} onFilter={handleFilter} />
              )}
              {currentTab === tabs[1].value && (
                <UserListInArrears
                  loading={loadingState}
                  users={user}
                  onFilterUserInArrears={handleFilterUserInArrears}
                  initialFrequencyCount={frequencyCount}
                  pageKey={pageKey}
                  onLoadMore={handleLoadMore}
                  onExport={handleExport}
                />
              )}
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserList;
