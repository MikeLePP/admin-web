import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { CustomerListTable } from '../../components/dashboard/customer';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { getUsers } from '../../slices/user';
import { useDispatch, useSelector } from '../../store';

const CustomerList: FC = () => {
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const userSelector = useSelector((state) => state.user);
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const user = useMemo(() => {
    const {
      users: { allIds, byId },
    } = userSelector;
    return allIds.map((id) => byId[id]);
  }, [userSelector]);

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
            <CustomerListTable users={user} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CustomerList;
