import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
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
import Assignment from '@material-ui/icons/Assignment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import { startCase, upperFirst } from 'lodash';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getFullName } from '../../lib/userHelpers';
import ArrowRightIcon from '../../icons/ArrowRight';
import PencilAltIcon from '../../icons/PencilAlt';
import SearchIcon from '../../icons/Search';
import { User } from '../../types/users';
import getInitials from '../../utils/getInitials';
import Scrollbar from '../Scrollbar';

interface UserListProps {
  users: User[];
  loading: boolean;
  initialQuery: string;
  onFilter: (filter: Record<string, string>) => void;
}

type Sort = 'createdAt|desc' | 'createdAt|asc';

interface SortOption {
  value: Sort;
  label: string;
}

const sortOptions: SortOption[] = [
  {
    label: 'Last create (newest)',
    value: 'createdAt|desc',
  },
  {
    label: 'Last create (oldest)',
    value: 'createdAt|asc',
  },
];

const applyFilters = (users: User[], query: string, filters: any): User[] =>
  users.filter((user) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'firstName', 'lastName', 'middleName', 'mobileNumber'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (user[property]?.toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && user[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });

const applyPagination = (users: User[], page: number, limit: number): User[] =>
  users.slice(page * limit, page * limit + limit);

const descendingComparator = (a: User, b: User, orderBy: string): number => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order: 'asc' | 'desc', orderBy: string) =>
  order === 'desc'
    ? (a: User, b: User) => descendingComparator(a, b, orderBy)
    : (a: User, b: User) => -descendingComparator(a, b, orderBy);

const applySort = (users: User[], sort: Sort): User[] => {
  const [orderBy, order] = sort.split('|') as [string, 'asc' | 'desc'];
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = users.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return a[1] - b[1];
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

const UserList: FC<UserListProps> = (props) => {
  const { loading, users, onFilter, initialQuery, ...other } = props;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>(initialQuery);
  const filteredUsers = applyFilters(users, query, {});
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);

  const useServerSideSearch = !filteredUsers.length;

  useEffect(() => {
    setQuery((current) => (initialQuery !== current ? initialQuery : current));
  }, [initialQuery]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setQuery(value);
    if (value === '') {
      onFilter({
        mobileNumber: '',
      });
    }
  };

  const handleClearFilter = () => {
    setQuery('');
    onFilter({
      mobileNumber: '',
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query && useServerSideSearch && initialQuery !== query) {
        onFilter({
          mobileNumber: query,
        });
      }
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [onFilter, query, useServerSideSearch, initialQuery]);

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value as Sort);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const sortedUser = applySort(filteredUsers, sort);
  const paginatedUsers = applyPagination(sortedUser, page, limit);

  return (
    <Box {...other}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2,
        }}
      >
        <Box sx={{ m: 1, maxWidth: '100%', width: 500 }}>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton onClick={handleClearFilter} disabled={!query}>
                  <BackspaceIcon fontSize="small" />
                </IconButton>
              ),
            }}
            onChange={handleQueryChange}
            placeholder="Search users"
            value={query}
            variant="outlined"
          />
        </Box>
        <Box sx={{ m: 1, width: 240 }}>
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
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
                    <TableCell>Mobile</TableCell>
                    <TableCell>Available Balance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow hover key={user.id}>
                      <TableCell>
                        <Box sx={{ alignItems: 'center', display: 'flex' }}>
                          <Box sx={{ alignItems: 'center', display: 'flex' }}>
                            <Avatar sx={{ height: 42, width: 42 }}>{getInitials(getFullName(user))}</Avatar>
                            <Box sx={{ ml: 1 }}>
                              <Link
                                color="inherit"
                                component={RouterLink}
                                to={`/management/users/${user.id}/details`}
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
                      <TableCell>{user.balanceLimit - user.balanceCurrent}</TableCell>
                      <TableCell>{upperFirst(startCase(user?.status).toLowerCase())}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Transaction">
                          <IconButton component={RouterLink} to={`/transactions/?userId=${user.id}`}>
                            <MonetizationOn fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Onboarding">
                          <IconButton component={RouterLink} to={`user-onboarding/create?userId=${user.id}`}>
                            <Assignment fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton component={RouterLink} to={`/management/users/${user.id}/edit`}>
                            <PencilAltIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Show">
                          <IconButton component={RouterLink} to={`/management/users/${user.id}/details`}>
                            <ArrowRightIcon fontSize="small" />
                          </IconButton>
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
            count={users.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      )}
    </Box>
  );
};

export default UserList;
