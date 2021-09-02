import { Box, Breadcrumbs, Card, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { UserList as UserListComponent, UserListInArrears } from '../../components/users';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';

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

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const view = useMemo(() => searchParams.get('view') || 'all', [searchParams]);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    if (view !== value) {
      searchParams.set('view', value);
      setSearchParams(searchParams);
    }
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
              {view === 'all' && <UserListComponent />}
              {view === 'in-arrears' && <UserListInArrears />}
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserList;
