import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TableCell, Box } from '@material-ui/core';
import { ArrowBack as BackIcon } from '@material-ui/icons';
import {
  useNotify,
  ResourceComponentPropsWithId,
  ListButton,
  ShowButton,
  TopToolbar,
} from 'react-admin';

export interface RiskModelTableRow {
  name: string;
  code?: string;
  parameterPath?: string;
}

export const RowsData: RiskModelTableRow[] = [
  {
    name: 'Number consecutive pay...',
    code: 'I1',
  },
  {
    name: 'Weekly',
    parameterPath: 'parameters[0].variables.minCountWeekly',
  },
  {
    name: 'Fortnightly',
    parameterPath: 'parameters[0].variables.minCountFortnightly',
  },
  {
    name: 'Monthly',
    parameterPath: 'parameters[0].variables.minCountMonthly',
  },
  {
    name: 'Average income per cycle',
    code: 'I2',
    parameterPath: 'parameters[1].variables.minAmount',
  },
  { name: 'Number income timing...', code: 'I3' },
  {
    name: 'Max count',
    parameterPath: 'parameters[2].variables.maxCount',
  },
  {
    name: 'Min balance',
    parameterPath: 'parameters[2].variables.minBalance',
  },
  {
    name: 'Government income as %...',
    code: 'I6',
    parameterPath: 'parameters[3].variables.maxPercent',
  },
  { name: 'Recent income', code: 'I7' },
  {
    name: 'Weekly',
    parameterPath: 'parameters[4].variables.maxCountWeekly',
  },
  {
    name: 'Fortnightly',
    parameterPath: 'parameters[4].variables.maxCountFortnightly',
  },
  {
    name: 'Monthly',
    parameterPath: 'parameters[4].variables.maxCountMonthly',
  },
  { name: 'Number times day 0 balance is allowed below minimum', code: 'B2' },
  {
    name: 'Max count',
    parameterPath: 'parameters[5].variables.maxCount',
  },
  {
    name: 'Min balance',
    parameterPath: 'parameters[5].variables.minBalance',
  },
  { name: 'Number times day 1 income is allowed below minimum', code: 'B4' },
  {
    name: 'Max count',
    parameterPath: 'parameters[6].variables.maxCount',
  },
  {
    name: 'Min balance',
    parameterPath: 'parameters[6].variables.minBalance',
  },
];

export const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.grey[700],
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

export const CellWithRightBorder = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRightWidth: 1,
      borderRightColor: theme.palette.grey[300],
      borderRightStyle: 'solid',
    },
  }),
)(TableCell);
