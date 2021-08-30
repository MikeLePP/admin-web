import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { OpenInNewOutlined as OpenInNewIcon } from '@material-ui/icons';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useBankAccount } from '../../hooks/useBankAccount';
import { useBankData } from '../../hooks/useBankData';
import { User } from '../../types/users';
import TransactionDialog from '../commons/TransactionDialog';
import ConfirmDialog from '../commons/Dialog';
import { bankApi } from '../../api/bankData';
import { formatBankAccount } from '../../helpers/bankAccount';

interface UserBankDetailsProps {
  user: User;
}

const UserBankDetails: FC<UserBankDetailsProps> = (props) => {
  const { bankAccounts } = useBankAccount(props.user?.id);
  const { dataLastAt, status, reportUrl, setDataLastAt } = useBankData(props.user?.id);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const primaryBankAccount = useMemo(() => {
    const userBankAccountId = props.user?.bankAccountId;
    const bankAccount = bankAccounts.find((account) => userBankAccountId && account.id === userBankAccountId);
    return {
      bankAccount,
      text: bankAccount ? formatBankAccount(bankAccount) : 'N/A',
    };
  }, [bankAccounts, props.user]);
  const handleRequestBankData = () => {
    setLoading(true);
    async function requestBankData() {
      try {
        await bankApi.postBankData(props.user.id);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    void requestBankData();
  };

  const handleCancelRequestBankData = () => {
    setShowConfirmDialog(false);
  };
  const handleConfirmRequestBankData = () => {
    handleRequestBankData();
    setShowConfirmDialog(false);
  };
  const handleClickRequestBankDataButton = () => {
    setShowConfirmDialog(true);
  };

  return (
    <Card {...props}>
      <CardHeader title="Bank Details" />
      <Divider />
      <CardContent>
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
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={() => setShowAllTransactions(true)} disabled={!reportUrl}>
          View bank statements
        </Button>
        <IconButton href={reportUrl} target="_blank" disabled={!reportUrl} sx={{ ml: 1 }}>
          <OpenInNewIcon />
        </IconButton>
        <Button
          variant="text"
          color="primary"
          disabled={status === 'loading' || loading}
          onClick={handleClickRequestBankDataButton}
        >
          Request bank statements
        </Button>
      </CardActions>
      <TransactionDialog
        openDialog={showAllTransactions}
        setShowAllTransactions={setShowAllTransactions}
        reportUrl={reportUrl}
        dataLastAt={dataLastAt}
        setDataLastAt={setDataLastAt}
        userId={props.user.id}
      />
      <ConfirmDialog
        show={showConfirmDialog}
        onCancelClick={handleCancelRequestBankData}
        onConfirmClick={handleConfirmRequestBankData}
        title=""
        body="Would you like to notify the user to resubmit their bank statements?"
        confirmLabel="Yes"
        cancelLabel="No"
      />
    </Card>
  );
};

export default UserBankDetails;
