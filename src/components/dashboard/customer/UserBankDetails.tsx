import { useMemo } from 'react';
import type { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CurrencyDollarIcon from '../../../icons/CurrencyDollar';

import { User } from '../../../types/users';
import { useBankAccount } from '../../../hooks/useBankAccount';

interface UserBankDetailsProps {
  user: User;
}

const UserBankDetails: FC<UserBankDetailsProps> = (props) => {
  const { bankAccounts } = useBankAccount(props.user?.id);
  const primaryBankAccount = useMemo(() => {
    const userBankAccountId = props.user?.bankAccountId;
    const bankAccount = bankAccounts.find((account) => userBankAccountId && account.id === userBankAccountId);
    return {
      bankAccount,
      text: `Name: ${bankAccount?.accountName || 'N/A'} | BSB: ${bankAccount?.accountBsb || 'N/A'} | ACC: ${
        bankAccount?.accountNumber || 'N/A'
      }`,
    };
  }, [bankAccounts, props.user]);
  return (
    <Card {...props}>
      <CardHeader title="Bank Details" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Bank Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {props.user?.bankAccount?.bankName}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Primary Bank Account
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {primaryBankAccount?.bankAccount ? primaryBankAccount?.text : null}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Current balance
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {props.user?.balanceCurrent}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Available balance
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {props.user?.balanceLimit - props.user?.balanceCurrent}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Balance limit
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {props.user?.balanceLimit}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserBankDetails;
