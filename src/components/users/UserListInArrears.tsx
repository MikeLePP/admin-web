import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getFullName } from '../../lib/userHelpers';
import INCOME_FREQUENCY from '../../constants/incomeFrequencies';
import ArrowRightIcon from '../../icons/ArrowRight';
import DownloadIcon from '../../icons/Download';
import type { User } from '../../types/users';
import getInitials from '../../utils/getInitials';
import Scrollbar from '../Scrollbar';

interface UserListTableProps {
  users: User[];
  onFilterUserInArrears: (frequencyCount: number) => void;
  initialFrequencyCount: number;
  loading: boolean;
  pageKey?: Record<string, unknown>;
  onLoadMore: () => void;
  onExport: () => void;
}

const applyPagination = (users: User[], page: number, limit: number): User[] =>
  users.slice(page * limit, page * limit + limit);

const UserListTable: FC<UserListTableProps> = (props) => {
  const { initialFrequencyCount, loading, onFilterUserInArrears, onLoadMore, pageKey, users, onExport, ...other } =
    props;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [frequencyCount, setFrequencyCount] = useState<number | null>(initialFrequencyCount);

  const handleFrequencyCountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const data = parseInt(event.target.value, 10);
    setFrequencyCount(isNaN(data) ? null : data);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleFilter = () => {
    onFilterUserInArrears(frequencyCount);
  };

  const paginatedUsers = applyPagination(users, page, limit);

  return (
    <Box {...other}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2,
          }}
        >
          <Box sx={{ m: 1, maxWidth: '100%', width: 100 }}>
            <Typography className="">Arrears in</Typography>
          </Box>
          <Box sx={{ m: 1, maxWidth: '100%', width: 300 }}>
            <TextField
              fullWidth
              onChange={handleFrequencyCountChange}
              placeholder=""
              value={frequencyCount}
              variant="outlined"
            />
          </Box>
          <Box sx={{ m: 1, width: 100 }}>
            <Typography>pay cycles</Typography>
          </Box>
          <Box sx={{ m: 1, width: 100 }}>
            <Button variant="contained" color="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2,
          }}
        >
          <Button
            startIcon={<DownloadIcon fontSize="small" />}
            sx={{ mt: 1 }}
            variant="outlined"
            color="primary"
            onClick={onExport}
            disabled={users.length === 0 || loading}
          >
            Export
          </Button>
        </Box>
      </Box>
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Box position="relative">
          <Scrollbar>
            <Box sx={{ minWidth: 700 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Mobile number</TableCell>
                    <TableCell>Pay frequency</TableCell>
                    <TableCell>Arrears since</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => {
                    const payFrequency = INCOME_FREQUENCY.find((frequency) => frequency.id === user.incomeFrequency);
                    const arrearsSince = moment(user.balanceOverdueAt).format('DD/MM/yyyy');
                    return (
                      <TableRow hover key={user.id}>
                        <TableCell>
                          <Box sx={{ alignItems: 'center', display: 'flex' }}>
                            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                              <Avatar sx={{ height: 42, width: 42 }}>{getInitials(getFullName(user))}</Avatar>
                              <Box sx={{ ml: 1 }}>
                                <Link
                                  color="inherit"
                                  component={RouterLink}
                                  to={`/management/users/${user.id}/payments`}
                                  variant="subtitle2"
                                >
                                  {getFullName(user)}
                                </Link>
                                <Typography color="textSecondary" variant="body2">
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.mobileNumber}</TableCell>
                        <TableCell>{payFrequency?.name}</TableCell>
                        <TableCell>{arrearsSince}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View">
                            <IconButton component={RouterLink} to={`/management/users/${user.id}/payments`}>
                              <ArrowRightIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
          <TablePagination
            component="div"
            count={users.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
          {pageKey && Object.keys(pageKey).length > 0 && (
            <Button className="absolute bottom-2 left-2" onClick={onLoadMore}>
              more...
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserListTable;
