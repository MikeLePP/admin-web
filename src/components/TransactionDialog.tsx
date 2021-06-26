import { useState, useEffect } from 'react';
import moment from 'moment';
import { useNotify } from 'react-admin';
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  ListItemText,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { REFRESH_DAYS } from '../constants/days-refresh-bank-data';
import { callApi } from '../helpers/api';

interface IProps {
  setShowAllTransactions: (value: boolean) => void;
  openDialog: boolean;
  reportUrl: string;
  userId: string;
  dataLastAt: moment.Moment;
}

function TransactionDialog({
  setShowAllTransactions,
  openDialog,
  reportUrl,
  dataLastAt,
  userId,
}: IProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(1);
  const [url, setUrl] = useState(reportUrl);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(dataLastAt);
  const notify = useNotify();

  useEffect(() => {
    setOpen(openDialog);
  }, [openDialog]);
  const handleShowAllTransactions = (): void => {
    setOpen(false);
    setShowAllTransactions(false);
  };
  const handleLoaded = () => {
    setLoading(false);
  };
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDays(event.target.value as number);
  };
  const now = moment().utc();

  const onRefreshClick = async (): Promise<void> => {
    try {
      setLoading(true);
      const { json } = await callApi<{
        data: { meta: { reportUrl: string }; attributes: { dataLastAt: string } };
      }>(`/users/${userId}/data?days=${days}`, 'post');
      setUrl(json.data.meta.reportUrl);
      setLastUpdatedAt(moment(json.data.attributes.dataLastAt));
    } catch (error) {
      notify(error, 'error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} disableBackdropClick disableEscapeKeyDown fullWidth maxWidth="lg">
      <DialogTitle disableTypography className="flex items-center justify-between">
        <Typography variant="h6">All account transactions</Typography>
        <label></label>
        <div className="mt-8 max-w-sm">
          <FormControl variant="outlined">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={days}
              onChange={handleChange}
            >
              {REFRESH_DAYS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" color="secondary" onClick={onRefreshClick}>
            REFRESH BANK DATA
          </Button>
        </div>
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
          src={reportUrl}
          className="w-full h-full border-0"
          loading="eager"
          onLoad={handleLoaded}
        />
      </DialogContent>
    </Dialog>
  );
}

export default TransactionDialog;
