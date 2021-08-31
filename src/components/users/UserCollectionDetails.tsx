import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardTypeMap,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { DefaultComponentProps } from '@material-ui/core/OverridableComponent';
import { OpenInNewOutlined as OpenInNewIcon } from '@material-ui/icons';
import moment from 'moment';
import { FC, useState } from 'react';
import { useBankData } from '../../hooks/useBankData';
import { User } from '../../types/users';
import BankStatementDialog from '../bank-data/BankStatementDialog';

interface CollectionDetailsProps extends DefaultComponentProps<CardTypeMap> {
  user: User;
}

const CollectionDetails: FC<CollectionDetailsProps> = (props) => {
  const { user, ...other } = props;
  const { dataLastAt, reportUrl, setDataLastAt } = useBankData(props.user?.id);
  const [showBankStatements, setShowBankStatements] = useState(false);
  const arrearsSince = user.balanceOverdueAt ? moment(user.balanceOverdueAt).format('DD/MM/YYYY') : '--';
  const collectionEmailPausedUntil = user.collectionEmailPausedUntil
    ? moment(user.collectionEmailPausedUntil).format('DD/MM/YYYY')
    : '--';

  return (
    <Card {...other}>
      <CardHeader title="Collection Details" />
      <Divider />
      <CardContent>
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
                  {user.balanceBook.toFixed(2)}
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
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={() => setShowBankStatements(true)} disabled={!reportUrl}>
          View bank statements
        </Button>
        <IconButton href={reportUrl} target="_blank" disabled={!reportUrl} sx={{ ml: 1 }}>
          <OpenInNewIcon />
        </IconButton>
      </CardActions>
      <BankStatementDialog
        open={showBankStatements}
        setOpen={setShowBankStatements}
        reportUrl={reportUrl}
        dataLastAt={dataLastAt}
        setDataLastAt={setDataLastAt}
        userId={props.user.id}
      />
    </Card>
  );
};

export default CollectionDetails;
