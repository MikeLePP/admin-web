import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import useAuth from '../../hooks/useAuth';
import { ITransactionAttributes, TransactionStatus } from '../../types/transaction';

type ITransactionStatus = typeof TransactionStatus[number];

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  transaction: ITransactionAttributes;
  onReconcileTransaction: (
    params: {
      id: string;
      status: ITransactionStatus;
      statusReason?: string;
      updatedBy?: string;
    },
    callback: (status: boolean) => void,
  ) => void;
}

export default function ReconcileTransaction({
  open,
  setOpen,
  transaction,
  onReconcileTransaction,
}: IProps): JSX.Element {
  const { user } = useAuth();
  const [status, setStatus] = useState<ITransactionStatus>(transaction.status);
  const [reason, setReason] = useState<string | undefined>(transaction.statusReason);

  useEffect(() => {
    setStatus(transaction.status);
    setReason(transaction.statusReason);
  }, [transaction]);
  const handleClose = () => {
    setOpen(false);
  };

  const handleStatusChanged = (e: ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
    const { value: newValue } = e.target;
    setStatus(newValue as ITransactionStatus);
  };

  const handleChangeReason = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value: newValue } = e.target;
    setReason(newValue);
  };

  const handleReconcileTransaction = () => {
    onReconcileTransaction(
      {
        id: transaction.id,
        status,
        statusReason: reason,
        updatedBy: user.id,
      },
      (reconcileStatus) => {
        if (reconcileStatus) {
          setOpen(false);
        }
      },
    );
  };
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="form-dialog-title">Reconcile transaction</DialogTitle>
      <DialogContent>
        <TextField
          className="my-1"
          id="standard-read-only-input"
          label="Status"
          value={status}
          fullWidth
          required
          select
          variant="outlined"
          onChange={handleStatusChanged}
        >
          {[
            {
              label: 'Confirmed',
              value: 'confirmed',
            },
            {
              label: 'Failed',
              value: 'failed',
            },
          ].map(({ value, label }) => (
            <MenuItem value={value}>{label}</MenuItem>
          ))}
        </TextField>
        <TextField
          className="my-1"
          id="standard-read-only-input"
          label="Reason"
          value={reason}
          fullWidth
          required
          variant="outlined"
          onChange={handleChangeReason}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleReconcileTransaction} color="primary" disabled={status === transaction.status}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
