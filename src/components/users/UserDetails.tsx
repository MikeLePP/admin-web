import {
  Card,
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
import { FileCopyOutlined as FileCopyIcon } from '@material-ui/icons';
import moment from 'moment';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { User } from '../../types/users';

interface UserDetailsProps extends DefaultComponentProps<CardTypeMap> {
  user: User;
}

const UserDetails: FC<UserDetailsProps> = (props) => {
  const { user, ...other } = props;

  const handleCopyId = () => {
    void navigator.clipboard.writeText(user?.id);
    toast.success('ID copied to clipboard');
  };

  const handleCopyMobileNumber = () => {
    void navigator.clipboard.writeText(user?.mobileNumber);
    toast.success('Mobile number copied to clipboard');
  };

  return (
    <Card {...other}>
      <CardHeader title="User Details" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                ID
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2" className="flex justify-between items-center">
                {user.id}
                <IconButton onClick={handleCopyId} size="small">
                  <FileCopyIcon />
                </IconButton>
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
              <Typography color="textSecondary" variant="body2" className="flex justify-between items-center">
                {user.mobileNumber}
                <IconButton onClick={handleCopyMobileNumber} size="small">
                  <FileCopyIcon />
                </IconButton>
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                Email
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {user.email}
              </Typography>
            </TableCell>
          </TableRow>
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
