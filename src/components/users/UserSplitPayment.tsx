import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardTypeMap,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import { DefaultComponentProps } from '@material-ui/core/OverridableComponent';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { User } from '../../types/users';

interface SplitPaymentProps extends DefaultComponentProps<CardTypeMap> {
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
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <TextField
            placeholder="count"
            type="number"
            variant="outlined"
            value={count}
            onChange={handleChangeCount}
            inputProps={{ min: '1', max: '10', step: '1' }}
          />
          <Typography sx={{ ml: 2 }}>x</Typography>
          <TextField
            placeholder="amount"
            type="number"
            name="amount"
            variant="outlined"
            value={amount}
            onChange={handleChangeAmount}
            inputProps={{ min: '1', max: '1000', step: '1' }}
            sx={{ ml: 2 }}
          />
          <Typography sx={{ ml: 2 }}>+</Typography>
          <TextField
            placeholder="fee"
            type="number"
            name="fee"
            variant="outlined"
            value={fee}
            onChange={handleChangeFee}
            inputProps={{ min: '0', max: '50', step: '1' }}
            sx={{ ml: 2 }}
          />
          <Typography sx={{ ml: 2 }}>fee</Typography>
          <Typography sx={{ ml: 2, flexGrow: 1, textAlign: 'right' }}>Total: ${total.toFixed(2)}</Typography>
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              name="pauseCollectionEmail"
              checked={pauseCollectionEmail}
              onClick={() => setPauseCollectionEmail(!pauseCollectionEmail)}
            />
          }
          label="Pause collection email"
          sx={{ mt: 2 }}
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
          sx={{ mt: 2 }}
        />
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
