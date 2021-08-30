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
  const [count, setCount] = useState(2);
  const [amount, setAmount] = useState(50);
  const [fee, setFee] = useState(2.5);

  const roundTwoDecimal = (value: number): number => Math.round(value * 100) / 100;

  const handleChangeCount = (event) => {
    const { value } = event.target;
    const newCount = parseInt(value, 10);
    const newAmount = roundTwoDecimal(user.balanceBook / newCount);
    const newFee = Math.round(newAmount * 5) / 100;

    setCount(newCount);
    setAmount(newAmount);
    setFee(newFee);
  };

  const handleChangeAmount = (event) => {
    const { value } = event.target;
    const newAmount = roundTwoDecimal(parseFloat(value));
    const newFee = Math.round(newAmount * 5) / 100;

    setAmount(newAmount);
    setFee(newFee);
  };

  const handleChangeFee = (event) => {
    const { value } = event.target;
    const newFee = roundTwoDecimal(parseFloat(value));
    setFee(newFee);
  };

  const total = useMemo(() => {
    if (!count || !amount || !fee) {
      return 0;
    }
    return roundTwoDecimal(count * (amount + fee));
  }, [count, amount, fee]);

  const handleCreate = () => {
    onSplitPayment?.(
      {
        count,
        amount,
        fee,
        pauseCollectionEmail,
        cancelAllPendingTransactions,
      },
      (success) => {
        if (success) {
          setCount(2);
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
                inputProps={{ min: '1', max: '10', step: '1' }}
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
                inputProps={{ min: '1', max: '1000', step: '1' }}
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
                inputProps={{ min: '0', max: '50', step: '1' }}
              />
            </Box>
            <Box sx={{ m: 1, maxWidth: '100%', width: 10 }}>
              <Typography>fee</Typography>
            </Box>
          </Box>
          <Box sx={{ m: 1, maxWidth: '100%', width: 140 }}>
            <Typography className="text-right">Total: ${total.toFixed(2)}</Typography>
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
