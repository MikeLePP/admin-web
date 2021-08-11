import { useState, useCallback, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { UserEditForm } from '../../components/dashboard/customer';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { useDispatch, useSelector } from '../../store';
import { getUser } from '../../slices/user';

const CustomerEdit: FC = () => {
  const { settings } = useSettings();
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

  return (
    <>
      <Helmet>
        <title>Management: User Edit</title>
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
                User Edit
              </Typography>
              <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRightIcon fontSize="small" />} sx={{ mt: 1 }}>
                <Link color="textPrimary" component={RouterLink} to="/management" variant="subtitle2">
                  Management
                </Link>
                <Link color="textPrimary" component={RouterLink} to="/management/users" variant="subtitle2">
                  Users
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  {user?.email}
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box mt={3}>
            <UserEditForm userId={id} user={user} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CustomerEdit;
