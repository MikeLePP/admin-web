import { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

import { Close as CloseIcon } from '@material-ui/icons';
import TextLabel from './TextLabel';
import { callApi } from '../helpers/api';

const MINUTES_TO_DISABLE_REFRESH = 1;
const REFRESH_DAYS = [
  { value: 1, label: '1 day' },
  { value: 30, label: '30 days' },
  { value: 180, label: '180 days' },
];

interface IProps {
  setShowAllTransactions: (value: boolean) => void;
  openDialog: boolean;
  reportUrl: string;
  userId: string;
  lastUpdatedAt: string;
  setLastUpdatedAt: React.Dispatch<React.SetStateAction<string>>;
}

function TransactionDialog({
  setShowAllTransactions,
  openDialog,
  reportUrl,
  lastUpdatedAt,
  setLastUpdatedAt,
  userId,
}: IProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(1);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setOpen(openDialog);
  }, [openDialog]);
  useEffect(() => {
    setUrl(reportUrl);
  }, [reportUrl]);
  const handleShowAllTransactions = (): void => {
    setOpen(false);
    setShowAllTransactions(false);
  };
  const handleLoaded = () => {
    setLoading(false);
  };
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDays(Number(event.target.value));
  };

  const onRefreshClick = async (): Promise<void> => {
    try {
      setLoading(true);
      const { json } = await callApi<{
        data: { meta: { reportUrl: string }; attributes: { dataLastAt: string } };
      }>(`/users/${userId}/data?days=${days}`, 'post');
      setUrl(json.data.meta.reportUrl);
      setLastUpdatedAt(json.data.attributes.dataLastAt);
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} disableBackdropClick disableEscapeKeyDown fullWidth maxWidth="lg">
      <DialogTitle disableTypography className="flex items-center justify-between">
        <Typography variant="h6">All account transactions</Typography>

        <IconButton onClick={handleShowAllTransactions}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="h-screen p-0">
        {loading && (
          <div className="flex items-center justify-center w-full h-4/5 absolute">
            <CircularProgress />
          </div>
        )}
        <iframe
          title="Account transactions"
          src={url}
          className="w-full h-full border-0"
          loading="eager"
          onLoad={handleLoaded}
        />
      </DialogContent>
      <DialogActions>
        <Grid container justify="center" spacing={8}>
          <Grid item>
            <TextLabel label="Last Refreshed" value={moment(lastUpdatedAt).fromNow()} />
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel>days</InputLabel>
              <Select value={days} onChange={handleChange} autoWidth>
                {REFRESH_DAYS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onRefreshClick}
              disabled={
                loading || moment().diff(lastUpdatedAt, 'minutes') < MINUTES_TO_DISABLE_REFRESH
              }
            >
              REFRESH BANK DATA
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

export default TransactionDialog;
