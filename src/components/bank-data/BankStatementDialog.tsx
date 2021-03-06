import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { userApi } from '../../api/user';

const MINUTES_TO_DISABLE_REFRESH = 15;
const REFRESH_DAYS = [
  { value: 1, label: '1 day' },
  { value: 30, label: '30 days' },
  { value: 180, label: '180 days' },
];

interface IProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  reportUrl: string;
  userId: string;
  dataLastAt: string | undefined;
  setDataLastAt: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function BankStatementDialog({
  open = false,
  setOpen = () => {},
  reportUrl,
  dataLastAt,
  setDataLastAt,
  userId,
}: IProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(reportUrl);
  }, [reportUrl]);

  const handleShowAllTransactions = (): void => {
    setOpen(false);
  };

  const handleLoaded = () => {
    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDays(Number(event.target.value));
  };

  const onRefreshClick = async (): Promise<void> => {
    setLoading(true);
    const { data } = await userApi.postBankData(userId, days);
    setUrl(data.meta.reportUrl);
    setDataLastAt(data.attributes.dataLastAt);
    setLoading(false);
  };

  return (
    <Dialog open={open} BackdropProps={{ onClick: () => {} }} disableEscapeKeyDown fullWidth maxWidth="lg">
      <DialogTitle disableTypography className="flex items-center justify-between">
        <Typography variant="h6">Bank statements</Typography>
        <IconButton onClick={handleShowAllTransactions}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="h-screen p-0 bg-white">
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
        <Typography sx={{ flexGrow: 1 }}>
          {dataLastAt ? `Last refreshed ${moment(dataLastAt).fromNow()}` : 'Last refreshed time is unavailable'}
        </Typography>
        <Select autoWidth value={days} onChange={handleChange} size="small" sx={{ ml: 1 }}>
          {REFRESH_DAYS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={onRefreshClick}
          disabled={loading || (!!dataLastAt && moment().diff(dataLastAt, 'minutes') < MINUTES_TO_DISABLE_REFRESH)}
          sx={{ ml: 1 }}
        >
          REFRESH BANK DATA
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BankStatementDialog;
