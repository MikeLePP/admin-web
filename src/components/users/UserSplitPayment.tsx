import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { User } from '../../types/users';

interface SplitPaymentProps {
  user: User;
  onSplitPayment: (
    params: {
      count: number;
      amount: number;
      fee: number;
      pauseCollectionEmail: boolean;
      cancelAllPendingTransactions: boolean;
    },
    callback: (value: boolean) => void,
  ) => void;
}

const SplitPayment: FC<SplitPaymentProps> = (props) => {
  const { user, onSplitPayment, ...other } = props;
  const [pauseCollectionEmail, setPauseCollectionEmail] = useState(true);
  const [cancelAllPendingTransactions, setCancelAllPendingTransactions] = useState(false);
  const [count, setCount] = useState('2');
  const [amount, setAmount] = useState('50');
  const [fee, setFee] = useState('2.5');

  const handleChangeCount = (event) => {
    const { value } = event.target;
    setCount(value);
    setAmount(`${user.balanceBook / parseFloat(value)}`);
  };
  const handleChangeAmount = (event) => {
    const { value } = event.target;
    setAmount(value);
    setCount(`${user.balanceBook / parseFloat(value)}`);
  };
  const handleChangeFee = (event) => {
    const { value } = event.target;
    setFee(value);
  };

  const total = useMemo(() => {
    if (!count || !amount || !fee) {
      return 0;
    }
    return parseFloat(count) * (parseFloat(amount) + parseFloat(fee));
  }, [count, amount, fee]);

  const handleCreate = () => {
    onSplitPayment?.(
      {
        count: parseFloat(count),
        amount: parseFloat(amount),
        fee: parseFloat(fee),
        pauseCollectionEmail,
        cancelAllPendingTransactions,
      },
      (success) => {
        if (success) {
          setCount('2');
          setAmount('50');
          setFee('2.5');
          setPauseCollectionEmail(false);
          setCancelAllPendingTransactions(false);
        }
      },
    );
  };

  return (
    <Card {...other}>
      <CardHeader title="Split Payments" />
      <Divider />
      <CardContent className="py-4 px-2">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap' }}>
            <Box sx={{ m: 1, maxWidth: '100%', width: 100 }}>
              <TextField
                placeholder="count"
                type="number"
                variant="outlined"
                value={count}
                onChange={handleChangeCount}
              />
            </Box>
            <Box sx={{ m: 1, maxWidth: '100%', width: 10 }}>
              <Typography>x</Typography>
            </Box>
            <Box sx={{ m: 1, width: 120 }}>
              <TextField
                placeholder="amount"
                type="number"
                name="amount"
                variant="outlined"
                value={amount}
                onChange={handleChangeAmount}
              />
            </Box>
            <Box sx={{ m: 1, maxWidth: '100%', width: 10 }}>
              <Typography>+</Typography>
            </Box>
            <Box sx={{ m: 1, width: 120 }}>
              <TextField
                placeholder="fee"
                type="number"
                name="fee"
                variant="outlined"
                value={fee}
                onChange={handleChangeFee}
              />
            </Box>
            <Box sx={{ m: 1, maxWidth: '100%', width: 10 }}>
              <Typography>fee</Typography>
            </Box>
          </Box>
          <Box sx={{ m: 1, maxWidth: '100%', width: 140 }}>
            <Typography className="text-right">Total: ${total}</Typography>
          </Box>
        </Box>

        <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                name="pauseCollectionEmail"
                checked={pauseCollectionEmail}
                onClick={() => setPauseCollectionEmail(!pauseCollectionEmail)}
              />
            }
            label="Pause collection email"
            className="w-full"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="cancelPendingTransaction"
                checked={cancelAllPendingTransactions}
                onClick={() => setCancelAllPendingTransactions(!cancelAllPendingTransactions)}
              />
            }
            label="Cancel current pending transactions"
            className="w-full"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={handleCreate} disabled={!total}>
          Create
        </Button>
      </CardActions>
    </Card>
  );
};

export default SplitPayment;
