import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import { FC, useState } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { User } from '../../types/users';
import TransactionDialog from '../commons/TransactionDialog';

interface CollectionDetailsProps {
  user: User;
}

const CollectionDetails: FC<CollectionDetailsProps> = (props) => {
  const { user, ...other } = props;
  const { dataLastAt, reportUrl, setDataLastAt } = useBankData(props.user?.id);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const arrearsSince = moment(user.balanceOverdueAt).format('DD/MM/yyyy');
  const collectionEmailPausedUntil = moment(user.collectionEmailPausedUntil).format('DD/MM/yyyy');
  return (
    <>
      <Card {...other}>
        <CardHeader title="Collection details" />
        <Divider />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  Arrears since
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {arrearsSince}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  Arrears amount
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {user.balanceBook}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  Collection email paused util
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {collectionEmailPausedUntil}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <CardActions>
          {reportUrl && (
            <Box className="pr-1.5 py-1.5">
              <Button variant="contained" color="secondary" onClick={() => setShowAllTransactions(true)}>
                View bank statements
              </Button>
            </Box>
          )}
        </CardActions>
      </Card>
      <TransactionDialog
        openDialog={showAllTransactions}
        setShowAllTransactions={setShowAllTransactions}
        reportUrl={reportUrl}
        dataLastAt={dataLastAt}
        setDataLastAt={setDataLastAt}
        userId={props.user.id}
      />
    </>
  );
};

export default CollectionDetails;
