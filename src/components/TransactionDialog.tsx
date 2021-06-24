import React from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

interface IProps {
  setShowAllTransactions: (value: boolean) => void;
  openDialog: boolean;
  reportUrl: string;
}

function TransactionDialog({ setShowAllTransactions, openDialog, reportUrl }: IProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setOpen(openDialog);
  }, [openDialog]);
  const handleShowAllTransactions = (): void => {
    setOpen(false);
    setShowAllTransactions(false);
  };
  const handleLoaded = () => {
    setLoading(false);
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
