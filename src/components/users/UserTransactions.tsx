import { Card, CardHeader, Divider } from '@material-ui/core';
import type { FC } from 'react';
import { User } from '../../types/users';
import { ITransactionAttributes } from '../../types/transaction';

interface SplitPaymentProps {
  user: User;
  transactions: ITransactionAttributes[];
}

const SplitPayment: FC<SplitPaymentProps> = (props) => {
  const { user, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Transactions" />
      <Divider />
    </Card>
  );
};

export default SplitPayment;
