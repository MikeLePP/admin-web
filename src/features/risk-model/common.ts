import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TableCell } from '@material-ui/core';

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

const PARAMETER_NAMES = {
  I1: 'Number consecutive pay cycles assessed',
  I2: 'Average income per cycle',
  I3: 'Number income timing variations OR Balance on expected income day greater than',
  I6: 'Government income as % total',
  I7: 'Recent income',
  B2: 'Number times day 0 balance is allowed below minimum',
  B4: 'Number times day 1 income is allowed below minimum',
};

export const ruleSetDefault = [
  {
    approveLimit: 50,
    parameters: [
      {
        active: true,
        code: 'I1',
        name: PARAMETER_NAMES.I1,
        variables: {
          minCountWeekly: 0,
          minCountFortnightly: 0,
          minCountMonthly: 0,
        },
      },
      {
        active: true,
        code: 'I2',
        name: PARAMETER_NAMES.I2,
        variables: { minAmount: 0 },
      },
      {
        active: true,
        code: 'I3',
        name: PARAMETER_NAMES.I3,
        variables: { maxCount: 0, minBalance: 0 },
      },
      {
        active: true,
        code: 'I6',
        name: PARAMETER_NAMES.I6,
        variables: { maxPercent: 0 },
      },
      {
        active: true,
        code: 'I7',
        name: PARAMETER_NAMES.I7,
        variables: {
          maxCountWeekly: 0,
          maxCountFortnightly: 0,
          maxCountMonthly: 0,
        },
      },
      {
        active: true,
        code: 'B2',
        name: PARAMETER_NAMES.B2,
        variables: { maxCount: 0, minBalance: 0 },
      },
      {
        active: true,
        code: 'B4',
        name: PARAMETER_NAMES.B4,
        variables: { maxCount: 0, minBalance: 0 },
      },
    ],
  },
  {
    approveLimit: 75,
    parameters: [
      {
        active: true,
        code: 'I1',
        name: PARAMETER_NAMES.I1,
        variables: { minCountWeekly: 0, minCountFortnightly: 0, minCountMonthly: 0 },
      },
      {
        active: true,
        code: 'I2',
        name: PARAMETER_NAMES.I2,
        variables: { minAmount: 0 },
      },
      {
        active: true,
        code: 'I3',
        name: PARAMETER_NAMES.I3,
        variables: { maxCount: 0, minBalance: 0 },
      },
      {
        active: true,
        code: 'I6',
        name: PARAMETER_NAMES.I6,
        variables: { maxPercent: 0 },
      },
      {
        active: true,
        code: 'I7',
        name: PARAMETER_NAMES.I7,
        variables: { maxCountWeekly: 0, maxCountFortnightly: 0, maxCountMonthly: 0 },
      },
      {
        active: true,
        code: 'B2',
        name: PARAMETER_NAMES.B2,
        variables: { maxCount: 0, minBalance: 0 },
      },
      {
        active: true,
        code: 'B4',
        name: PARAMETER_NAMES.B4,
        variables: { maxCount: 0, minBalance: 0 },
      },
    ],
  },
  {
    approveLimit: 100,
    parameters: [
      {
        active: true,
        code: 'I1',
        name: PARAMETER_NAMES.I1,
        variables: { minCountWeekly: 0, minCountFortnightly: 0, minCountMonthly: 0 },
      },
      {
        active: true,
        code: 'I2',
        name: PARAMETER_NAMES.I2,
        variables: { minAmount: 0 },
      },
      {
        active: true,
        code: 'I3',
        name: PARAMETER_NAMES.I3,
        variables: { maxCount: 0, minBalance: 0 },
      },
      {
        active: true,
        code: 'I6',
        name: PARAMETER_NAMES.I6,
        variables: { maxPercent: 0 },
      },
      {
        active: true,
        code: 'I7',
        name: PARAMETER_NAMES.I7,
        variables: { maxCountWeekly: 0, maxCountFortnightly: 0, maxCountMonthly: 0 },
      },
      {
        active: true,
        code: 'B2',
        name: PARAMETER_NAMES.B2,
        variables: { maxCount: 0, minBalance: 0 },
      },
      {
        active: true,
        code: 'B4',
        name: PARAMETER_NAMES.B4,
        variables: { maxCount: 0, minBalance: 0 },
      },
    ],
  },
];
