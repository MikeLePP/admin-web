import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import Assignment from '@material-ui/icons/Assignment';
import { startCase, upperFirst } from 'lodash';
import PropTypes from 'prop-types';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import { User } from '../../../types/users';
import getInitials from '../../../utils/getInitials';
import Scrollbar from '../../Scrollbar';

interface UserListTableProps {
  users: User[];
}

type Sort = 'createdAt|desc' | 'createdAt|asc';

interface SortOption {
  value: Sort;
  label: string;
}

const tabs = [
  {
    label: 'All',
    value: 'all',
  },
  // {
  //   label: 'Collections',
  //   value: 'collections',
  // },
];

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

export const getFullName = (record?: User): string =>
  record ? [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ') : '';

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

const UserListTable: FC<UserListTableProps> = (props) => {
  const { users, ...other } = props;
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [filters, setFilters] = useState<any>({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null,
  });

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    const updatedFilters = {
      ...filters,
      hasAcceptedMarketing: null,
      isProspect: null,
      isReturning: null,
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setSelectedUser([]);
    setCurrentTab(value);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value as Sort);
  };

  const handleSelectAllUsers = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedUser(event.target.checked ? users.map((user) => user.id) : []);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const filteredUser = applyFilters(users, query, filters);
  const sortedUser = applySort(filteredUser, sort);
  const paginatedUsers = applyPagination(sortedUser, page, limit);
  const enableBulkActions = selectedUser.length > 0;
  const selectedSomeUsers = selectedUser.length > 0 && selectedUser.length < users.length;
  const selectedAllUsers = selectedUser.length === users.length;

  return (
    <Card {...other}>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="primary"
        value={currentTab}
        variant="scrollable"
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2,
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 500,
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            onChange={handleQueryChange}
            placeholder="Search users"
            value={query}
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            m: 1,
            width: 240,
          }}
        >
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
      {enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2,
            }}
          >
            <Checkbox
              checked={selectedAllUsers}
              color="primary"
              indeterminate={selectedSomeUsers}
              onChange={handleSelectAllUsers}
            />
            <Button color="primary" sx={{ ml: 2 }} variant="outlined">
              Delete
            </Button>
            <Button color="primary" sx={{ ml: 2 }} variant="outlined">
              Edit
            </Button>
          </Box>
        </Box>
      )}
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
              {paginatedUsers.map((user) => {
                const isUserSelected = selectedUser.includes(user.id);
                return (
                  <TableRow hover key={user.id} selected={isUserSelected}>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        <Avatar
                          sx={{
                            height: 42,
                            width: 42,
                          }}
                        >
                          {getInitials(getFullName(user))}
                        </Avatar>
                        <Box sx={{ ml: 1 }}>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/management/users/${user.id}`}
                            variant="subtitle2"
                          >
                            {getFullName(user)}
                          </Link>
                          <Typography color="textSecondary" variant="body2">
                            {user.email}
                          </Typography>
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
                        <IconButton component={RouterLink} to={`/management/users/${user.id}`}>
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
        count={filteredUser.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default UserListTable;
