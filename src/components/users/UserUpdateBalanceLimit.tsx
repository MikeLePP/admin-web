import { Box, Button, Card, CardContent, CardHeader, Divider, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { APPROVED_AMOUNT } from '../../constants/amount';
import type { User } from '../../types/users';

interface IProps {
  user: User;
  onUpdateLimit: (limit: number) => void;
}

const UserUpdateBalanceLimit: FC<IProps> = ({ user, onUpdateLimit, ...remains }) => {
  const [balanceLimit, setBalanceLimit] = useState<string>('');
  useEffect(() => {
    setBalanceLimit(user.balanceLimit.toString() || '');
  }, [user]);
  const handleUpdate = () => {
    const limit = parseFloat(balanceLimit);
    onUpdateLimit(limit);
  };
  return (
    <Card {...remains}>
      <CardHeader title="Update Balance Limit" />
      <Divider />
      <CardContent>
        <TextField
          fullWidth
          name="option"
          onChange={(event): void => setBalanceLimit(event.target.value)}
          select
          SelectProps={{ native: true }}
          value={balanceLimit}
          variant="outlined"
        >
          {APPROVED_AMOUNT.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </TextField>
        <Box sx={{ mt: 2 }}>
          <Button
            disabled={user.balanceLimit.toString() === balanceLimit.toString()}
            color="primary"
            startIcon={<SaveIcon fontSize="small" />}
            variant="contained"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserUpdateBalanceLimit;
