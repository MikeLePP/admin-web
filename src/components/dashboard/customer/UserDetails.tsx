import type { FC } from 'react';
import { Card, CardHeader, Divider, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { User } from '../../../types/users';

interface CustomerContactDetailsProps {
  user: User;
}

const CustomerContactDetails: FC<CustomerContactDetailsProps> = (props) => {
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
                {user.dob}
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
                {user.incomeNextDate}
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

export default CustomerContactDetails;
