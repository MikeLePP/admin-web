import { Box, Breadcrumbs, Card, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UserList as UserListComponent, UserListInArrears } from '../../components/users';
import useSettings from '../../hooks/useSettings';
import useQuery from '../../hooks/useQuery';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { exportUserCSV, filterMoreUsers, getUsersInArrears, getUsersWithFilter, getAllUsers } from '../../slices/user';
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
  const query = useQuery();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const userSelector = useSelector((state) => state.user);
  const [currentTab, setCurrentTab] = useState<string>(tabs[0].value);
  const [frequencyCount, setFrequencyCount] = useState(1);
  const queryToSearch = query.get('query');
  useEffect(() => {
    gtm.push({ event: 'page_view' });
    dispatch(getAllUsers());
  }, [dispatch]);

  const users = useMemo(() => {
    const {
      users: { allIds, byId },
    } = userSelector;
    return allIds.map((id) => byId[id]);
  }, [userSelector]);

  useEffect(() => {
    if (queryToSearch && userSelector.allUsers.allIds.length) {
      dispatch(getUsersWithFilter(queryToSearch));
    }
    if (!queryToSearch && userSelector.allUsers.allIds.length) {
      dispatch(getAllUsers());
    }
  }, [dispatch, queryToSearch, userSelector.allUsers.allIds.length]);

  useEffect(() => {
    if (currentTab === 'inArrears') {
      dispatch(getUsersInArrears(frequencyCount));
    }
  }, [currentTab, dispatch, frequencyCount]);

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
    if (value === 'inArrears') {
      dispatch(getUsersInArrears(frequencyCount));
    }
    if (value === 'all') {
      if (!queryToSearch) {
        dispatch(getAllUsers());
      } else {
        dispatch(getUsersWithFilter(queryToSearch));
      }
    }
  };

  const handleFilter = useCallback(
    (newQuery: string) => {
      if (newQuery) {
        navigate(`/management/users?query=${encodeURIComponent(newQuery)}`);
      } else {
        navigate(`/management/users`);
      }
    },
    [navigate],
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
                <UserListComponent
                  initialQuery={queryToSearch}
                  loading={loadingState}
                  users={users}
                  onFilter={handleFilter}
                />
              )}
              {currentTab === tabs[1].value && (
                <UserListInArrears
                  loading={loadingState}
                  users={users}
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
