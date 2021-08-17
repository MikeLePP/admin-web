import {
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';
import { lowerCase, upperFirst } from 'lodash';
import moment from 'moment';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useState } from 'react';
import PencilAltIcon from '../../icons/PencilAlt';
import { ITransactionAttributes } from '../../types/transaction';
import { User } from '../../types/users';
import Scrollbar from '../Scrollbar';

interface SplitPaymentProps {
  user: User;
  transactions: ITransactionAttributes[];
}

const applyPagination = (
  transactions: ITransactionAttributes[],
  page: number,
  limit: number,
): ITransactionAttributes[] => transactions.slice(page * limit, page * limit + limit);

const SplitPayment: FC<SplitPaymentProps> = (props) => {
  const { user, transactions, ...other } = props;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const paginatedTransactions = applyPagination(transactions, page, limit);

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };
  return (
    <Card {...other}>
      <CardHeader title="Transactions" />
      <Divider />
      <Box position="relative">
        <Scrollbar>
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment type</TableCell>
                  <TableCell>Submit on</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow hover key={transaction.id}>
                    <TableCell>{transaction.paymentType}</TableCell>
                    <TableCell>
                      {transaction.submitAt ? moment(transaction.submitAt).format('MM/DD/YYYY, hh:mm:ss A') : ''}
                    </TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{upperFirst(lowerCase(transaction.status))}</TableCell>
                    <TableCell align="right" className="flex">
                      <Tooltip title="Edit">
                        <IconButton>
                          <PencilAltIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reconcile">
                        <Box>
                          <IconButton
                            disabled={
                              transaction.status === 'failed' ||
                              transaction.status === 'cancelled' ||
                              transaction.status === 'confirmed'
                            }
                          >
                            <UpdateIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={transactions.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10]}
        />
      </Box>
    </Card>
  );
};

export default SplitPayment;
