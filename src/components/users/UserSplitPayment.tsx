import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import { FC, useState } from 'react';
import { User } from '../../types/users';

interface SplitPaymentProps {
  user: User;
}

const SplitPayment: FC<SplitPaymentProps> = (props) => {
  const { user, ...other } = props;
  const [pauseCollectionEmail, setPauseCollectionEmail] = useState(true);
  const [cancelAllPendingTransaction, setCancelAllPendingTransaction] = useState(false);
  const handleCreate = () => {};

  return (
    <Card {...other}>
      <CardHeader title="Split Payments" />
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2,
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 50,
          }}
        >
          <TextField variant="outlined" />
        </Box>
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 10,
          }}
        >
          <Typography>x</Typography>
        </Box>
        <Box
          sx={{
            m: 1,
            width: 100,
          }}
        >
          <TextField name="sort" variant="outlined" />
        </Box>
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 20,
          }}
        >
          <Typography>+</Typography>
        </Box>
        <Box
          sx={{
            m: 1,
            width: 100,
          }}
        >
          <TextField name="sort" variant="outlined" />
        </Box>
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 10,
          }}
        >
          <Typography>fee</Typography>
        </Box>
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 140,
          }}
        >
          <Typography className="text-right">Total: $105</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2,
        }}
      >
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
              checked={cancelAllPendingTransaction}
              onClick={() => setCancelAllPendingTransaction(!cancelAllPendingTransaction)}
            />
          }
          label="Cancel all pending transaction"
          className="w-full"
        />
      </Box>
      <CardActions>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create
        </Button>
      </CardActions>
    </Card>
  );
};

export default SplitPayment;
