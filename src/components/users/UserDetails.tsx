import type { FC } from 'react';
import moment from 'moment';
import { Card, CardHeader, Divider, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { User } from '../../types/users';

interface UserDetailsProps {
  user: User;
}

const UserDetails: FC<UserDetailsProps> = (props) => {
  const { user, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="User Details" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                First name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {user.firstName}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Middle name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {user.middleName}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Last name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {user.lastName}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Mobile number
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {user.mobileNumber}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Date of birth
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {user.dob ? moment(user.dob).format('DD/MM/YYYY') : ''}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Pay frequency
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
                Next pay date
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {moment(user.incomeNextDate).format('DD/MM/YYYY h:mm A')}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Status
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {user.status}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserDetails;
