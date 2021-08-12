import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { UsersTable } from '../../components/dashboard/users';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { getUsers, filterUsers, filterMoreUsers } from '../../slices/user';
import { useDispatch, useSelector } from '../../store';

const UserList: FC = () => {
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const userSelector = useSelector((state) => state.user);
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [arrearFilterValue, setArrearFilterValue] = useState({
    frequencyCount: '1',
  });
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(() => {
    if (currentTab === 'all') {
      dispatch(getUsers());
    } else if (currentTab === 'inArrears') {
      dispatch(filterUsers(arrearFilterValue.frequencyCount));
    }
  }, [dispatch, currentTab, arrearFilterValue]);

  const user = useMemo(() => {
    const {
      users: { allIds, byId },
    } = userSelector;
    return allIds.map((id) => byId[id]);
  }, [userSelector]);

  const loadingState = useMemo(() => userSelector.status === 'loading', [userSelector]);
  const pageKey = useMemo(() => userSelector.pageKey, [userSelector]);

  const handleFilterUserInArrears = ({ frequencyCount }) => {
    setArrearFilterValue({ frequencyCount });
  };

  const handleLoadMore = () => {
    dispatch(filterMoreUsers(arrearFilterValue.frequencyCount));
  };

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
            <UsersTable
              loading={loadingState}
              users={user}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              onFilterUserInArrears={handleFilterUserInArrears}
              arrearFilterValue={arrearFilterValue}
              pageKey={pageKey}
              onLoadMore={handleLoadMore}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserList;
