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
import { ITransactionAttributes, TransactionStatus } from '../../types/transaction';
import { User } from '../../types/users';
import Scrollbar from '../Scrollbar';
import EditTransaction from '../transactions/EditModal';
import ReconcileTransaction from '../transactions/ReconcileModal';

type ITransactionStatus = typeof TransactionStatus[number];

interface SplitPaymentProps {
  user: User;
  transactions: ITransactionAttributes[];
  onReconcileTransaction: (
    params: {
      id: string;
      status: ITransactionStatus;
      statusReason?: string;
      updatedBy?: string;
    },
    callback: (status: boolean) => void,
  ) => void;
  onUpdateTransaction: (params: ITransactionAttributes, callback: (status: boolean) => void) => void;
}

const applyPagination = (
  transactions: ITransactionAttributes[],
  page: number,
  limit: number,
): ITransactionAttributes[] => transactions.slice(page * limit, page * limit + limit);

const UserTransactions: FC<SplitPaymentProps> = (props) => {
  const { user, transactions, onReconcileTransaction, onUpdateTransaction, ...other } = props;
  const [openReconcileModal, setOpenReconcileModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [targetTransaction, setTargetTransaction] = useState<ITransactionAttributes>();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const paginatedTransactions = applyPagination(transactions, page, limit);

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleReconcileTransaction = (transaction) => () => {
    setTargetTransaction(transaction);
    setOpenReconcileModal(true);
  };

  const handleEditTransaction = (transaction) => () => {
    setTargetTransaction(transaction);
    setOpenEditModal(true);
  };

  const handleSetOpenReconcile = () => {
    setTargetTransaction(undefined);
    setOpenReconcileModal(false);
  };

  const handleSetOpenEdit = () => {
    setTargetTransaction(undefined);
    setOpenEditModal(false);
  };

  return (
    <>
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
                        {transaction.submitAt ? moment(transaction.submitAt).format('DD/MM/YYYY') : ''}
                      </TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{upperFirst(lowerCase(transaction.status))}</TableCell>
                      <TableCell align="right" className="flex">
                        <Tooltip title="Edit">
                          <IconButton onClick={handleEditTransaction(transaction)}>
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
                              onClick={handleReconcileTransaction(transaction)}
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
      {openReconcileModal && targetTransaction && (
        <ReconcileTransaction
          open={openReconcileModal}
          setOpen={handleSetOpenReconcile}
          transaction={targetTransaction}
          onReconcileTransaction={onReconcileTransaction}
        />
      )}
      {openEditModal && targetTransaction && (
        <EditTransaction
          open={openEditModal}
          setOpen={handleSetOpenEdit}
          userId={user.id}
          transaction={targetTransaction}
          onUpdateTransaction={onUpdateTransaction}
        />
      )}
    </>
  );
};

export default UserTransactions;
