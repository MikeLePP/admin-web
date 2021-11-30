import { Box, Breadcrumbs, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { DefaultStaticLossReport, ZeptoStaticLossReport } from '../../components/reporting';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';

const tabs = [
  { label: 'Static Loss', value: 'default' },
  { label: 'Zepto Static Loss', value: 'zepto' },
];

const StaticLossReport: FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { tabId } = useParams();
  const [currentTab, setCurrentTab] = useState<string>(tabs[0].value);

  useEffect(() => {
    const defaultTabValue = tabs[0].value;
    if (!tabId) {
      setCurrentTab(defaultTabValue);
    }
    const matchedTab = tabs.find((tab) => tab.value === tabId);
    setCurrentTab(matchedTab?.value || defaultTabValue);
  }, [tabId]);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
    navigate(`/reporting/static-loss/${value}`);
  };

  return (
    <>
      <Helmet>
        <title>Static Loss Report</title>
      </Helmet>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100%', py: 8 }}>
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                Static Loss Reports
              </Typography>
              <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRightIcon fontSize="small" />} sx={{ mt: 1 }}>
                <Link color="textPrimary" component={RouterLink} to="/reporting" variant="subtitle2">
                  Reporting
                </Link>
                <Link color="textPrimary" component={RouterLink} to={`/reporting/static-loss`} variant="subtitle2">
                  Static Loss
                </Link>
              </Breadcrumbs>
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
            <Divider />
            {currentTab === 'default' && <DefaultStaticLossReport />}
            {currentTab === 'zepto' && <ZeptoStaticLossReport />}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StaticLossReport;
