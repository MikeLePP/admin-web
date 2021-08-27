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
  IconButton,
} from '@material-ui/core';
import { OpenInNewOutlined as OpenInNewIcon } from '@material-ui/icons';
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
  const arrearsSince = user.balanceOverdueAt ? moment(user.balanceOverdueAt).format('DD/MM/yyyy') : '--';
  const collectionEmailPausedUntil = user.collectionEmailPausedUntil
    ? moment(user.collectionEmailPausedUntil).format('DD/MM/yyyy')
    : '--';
  return (
    <>
      <Card {...other}>
        <CardHeader title="Collection Details" />
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
                  Arrears amount (excl. fees)
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {user.balanceBook.toPrecision(2)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  Income next date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {user.incomeNextDate ? moment(user.incomeNextDate).format('DD/MM/yyyy') : '--'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  Income frequency
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {user.incomeFrequency}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  Collection email paused until
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
          <Box className="pr-1.5 py-1.5">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowAllTransactions(true)}
              disabled={!reportUrl}
            >
              View bank statements
            </Button>
            <IconButton href={reportUrl} target="_blank" disabled={!reportUrl}>
              <OpenInNewIcon />
            </IconButton>
          </Box>
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
