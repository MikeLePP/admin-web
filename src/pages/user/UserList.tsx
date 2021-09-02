import { Box, Breadcrumbs, Card, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import { merge, omit } from 'lodash';
import type { ChangeEvent, FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { UserList as UserListComponent, UserListInArrears } from '../../components/users';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { exportUserCSV, filterMoreUsers, getAllUsers, getUsersInArrears, getUsersWithFilter } from '../../slices/user';
import { useDispatch, useSelector } from '../../store';

const tabs = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'In arrears',
    value: 'in-arrears',
  },
];

const UserList: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    dispatch(getAllUsers());
  }, [dispatch]);

  const arrearsComparer = useMemo(() => searchParams.get('ac') || 'e', [searchParams]);
  const arrearsFrequency = useMemo(() => +searchParams.get('af') || 1, [searchParams]);
  const filter = useMemo(() => searchParams.get('filter'), [searchParams]);
  const view = useMemo(() => searchParams.get('view') || 'all', [searchParams]);

  const users = useMemo(() => {
    const {
      users: { allIds, byId },
    } = userSelector;
    return allIds.map((id) => byId[id]);
  }, [userSelector]);

  useEffect(() => {
    if (view === 'all') {
      if (filter) {
        dispatch(getUsersWithFilter(filter));
      } else {
        dispatch(getAllUsers());
      }
    } else if (view === 'in-arrears') {
      dispatch(getUsersInArrears(arrearsComparer, arrearsFrequency));
    }
  }, [view, dispatch, arrearsComparer, arrearsFrequency, filter]);

  const loadingState = useMemo(() => userSelector.status === 'loading', [userSelector]);
  const pageKey = useMemo(() => userSelector.pageKey, [userSelector]);

  const handleFilterUserInArrears = (comparer, frequency) => {
    searchParams.set('ac', comparer);
    searchParams.set('af', frequency);
    setSearchParams(searchParams);
  };

  const handleLoadMore = useCallback(() => {
    dispatch(filterMoreUsers(arrearsComparer, arrearsFrequency));
  }, [dispatch, arrearsComparer, arrearsFrequency]);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    searchParams.set('view', value);
    setSearchParams(searchParams);
  };

  const handleFilter = (value: string) => {
    if (value) {
      searchParams.set('filter', value);
    } else {
      searchParams.delete('filter');
    }
    setSearchParams(searchParams);
  };

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
                value={view}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
              <Divider />
              {view === 'all' && (
                <UserListComponent initialQuery={filter} loading={loadingState} users={users} onFilter={handleFilter} />
              )}
              {view === 'in-arrears' && (
                <UserListInArrears
                  initialComparer={arrearsComparer}
                  initialFrequencyCount={arrearsFrequency}
                  loading={loadingState}
                  onExport={handleExport}
                  onFilterUserInArrears={handleFilterUserInArrears}
                  onLoadMore={handleLoadMore}
                  pageKey={pageKey}
                  users={users}
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
