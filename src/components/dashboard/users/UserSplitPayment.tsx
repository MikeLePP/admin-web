import { Card, CardHeader, Divider } from '@material-ui/core';
import type { FC } from 'react';
import { User } from '../../../types/users';

interface SplitPaymentProps {
  user: User;
}

const SplitPayment: FC<SplitPaymentProps> = (props) => {
  const { user, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Split Payments" />
      <Divider />
    </Card>
  );
};

export default SplitPayment;
