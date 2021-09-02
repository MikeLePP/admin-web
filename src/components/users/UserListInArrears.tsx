import {
  Avatar,
  Backdrop,
  Box,
  BoxProps,
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
import { ChangeEvent, FC, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import INCOME_FREQUENCY from '../../constants/incomeFrequencies';
import ArrowRightIcon from '../../icons/ArrowRight';
import DownloadIcon from '../../icons/Download';
import { getFullName } from '../../lib/userHelpers';
import { exportUserCSV, filterMoreUsers, getUsersInArrears } from '../../slices/user';
import { useDispatch, useSelector } from '../../store';
import type { User } from '../../types/users';
import getInitials from '../../utils/getInitials';
import Scrollbar from '../Scrollbar';

const comparerOptions: { value: string; label: string }[] = [
  {
    label: 'Equal to',
    value: 'e',
  },
  {
    label: 'Greater than or equal to',
    value: 'gtoet',
  },
  {
    label: 'Less than or equal to',
    value: 'ltoet',
  },
];

const applyPagination = (users: User[], page: number, limit: number): User[] =>
  users.slice(page * limit, page * limit + limit);

const UserListTable: FC<BoxProps> = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const arrearsComparer = useMemo(() => searchParams.get('ac') || 'e', [searchParams]);
  const arrearsFrequency = useMemo(() => +searchParams.get('af') || 1, [searchParams]);

  const userSelector = useSelector((state) => state.user);
  const userLoading = useMemo(() => userSelector.status === 'loading', [userSelector]);
  const pageKey = useMemo(() => userSelector.pageKey, [userSelector]);

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [comparer, setComparer] = useState<string | null>(arrearsComparer);
  const [frequencyCount, setFrequencyCount] = useState<number | null>(arrearsFrequency);
  const dispatch = useDispatch();

  const users = useMemo(() => {
    const {
      users: { allIds, byId },
    } = userSelector;
    return allIds.map((id) => byId[id]);
  }, [userSelector]);

  useEffect(() => {
    setComparer(arrearsComparer);
    setFrequencyCount(arrearsFrequency);
    dispatch(getUsersInArrears(arrearsComparer, arrearsFrequency));
  }, [dispatch, arrearsComparer, arrearsFrequency]);

  useEffect(() => {
    setComparer(arrearsComparer);
    setFrequencyCount(arrearsFrequency);
  }, [arrearsComparer, arrearsFrequency]);

  const handleFrequencyCountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value, 10);
    setFrequencyCount(value || 1);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleFilter = () => {
    searchParams.set('ac', comparer);
    searchParams.set('af', frequencyCount.toString());
    setSearchParams(searchParams);
  };

  const handleLoadMore = useCallback(() => {
    dispatch(filterMoreUsers(arrearsComparer, arrearsFrequency));
  }, [dispatch, arrearsComparer, arrearsFrequency]);

  const handleExport = useCallback(() => {
    dispatch(exportUserCSV());
  }, [dispatch]);

  const paginatedUsers = applyPagination(users, page, limit);

  return (
    <Box {...props}>
      <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} p={2}>
        <TextField
          label="Compare"
          name="comparer"
          onChange={(e) => setComparer(e.target.value)}
          select
          SelectProps={{ native: true }}
          value={comparer}
          variant="outlined"
        >
          {comparerOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          inputProps={{ min: 1, step: 1 }}
          label="Pay cycles"
          onChange={handleFrequencyCountChange}
          type="number"
          value={frequencyCount}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleFilter}>
          Filter
        </Button>
        <Box flexGrow={1} />
        <Button
          startIcon={<DownloadIcon fontSize="small" />}
          variant="outlined"
          color="primary"
          onClick={handleExport}
          disabled={users.length === 0 || userLoading}
        >
          Export
        </Button>
      </Box>
      <Backdrop open={userLoading} invisible sx={{ position: 'absolute', zIndex: 1 }}>
        <CircularProgress />
      </Backdrop>
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
                                to={`/management/users/${user.id}/collections`}
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
                          <IconButton component={RouterLink} to={`/management/users/${user.id}/collections`}>
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
          <Button className="absolute bottom-2 left-2" onClick={handleLoadMore}>
            more...
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UserListTable;
