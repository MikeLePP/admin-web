import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TableCell } from '@material-ui/core';

export interface RiskModelTableRow {
  name: string;
  code?: string;
  parameterPath?: string;
}

export const RowsData: RiskModelTableRow[] = [
  // I1
  {
    name: 'Number of recent consecutive pay cycles assessed',
    code: 'I1',
  },
  {
    name: 'Period Count Weekly',
    parameterPath: 'parameters[0].variables.periodCountWeekly',
  },
  {
    name: 'Period Count Fortnightly',
    parameterPath: 'parameters[0].variables.periodCountFortnightly',
  },
  {
    name: 'Period Count Monthly',
    parameterPath: 'parameters[0].variables.periodCountMonthly',
  },
  {
    name: 'Max Timing Variation Count',
    parameterPath: 'parameters[0].variables.maxTimingVariationCount',
  },
  {
    name: 'Max Timing Variation Days',
    parameterPath: 'parameters[0].variables.maxTimingVariationDays',
  },
  // I2
  {
    name: 'Average income per cycle',
    code: 'I2',
  },
  {
    name: 'Period Count Weekly',
    parameterPath: 'parameters[1].variables.periodCountWeekly',
  },
  {
    name: 'Period Count Fortnightly',
    parameterPath: 'parameters[1].variables.periodCountFortnightly',
  },
  {
    name: 'Period Count Monthly',
    parameterPath: 'parameters[1].variables.periodCountMonthly',
  },
  {
    name: 'Min Income Average',
    parameterPath: 'parameters[1].variables.minIncomeAverage',
  },
  // I6
  {
    name: 'Government income as % total recent income',
    code: 'I6',
  },
  {
    name: 'Period Count Weekly',
    parameterPath: 'parameters[2].variables.periodCountWeekly',
  },
  {
    name: 'Period Count Fortnightly',
    parameterPath: 'parameters[2].variables.periodCountFortnightly',
  },
  {
    name: 'Period Count Monthly',
    parameterPath: 'parameters[2].variables.periodCountMonthly',
  },
  {
    name: 'Min Income Percentage',
    parameterPath: 'parameters[2].variables.maxIncomePercentage',
  },
  // B1
  {
    name: 'Number of times day zero balance is allowed below minimum after income received',
    code: 'B1',
  },
  {
    name: 'Period Count Weekly',
    parameterPath: 'parameters[3].variables.periodCountWeekly',
  },
  {
    name: 'Period Count Fortnightly',
    parameterPath: 'parameters[3].variables.periodCountFortnightly',
  },
  {
    name: 'Period Count Monthly',
    parameterPath: 'parameters[3].variables.periodCountMonthly',
  },
  {
    name: 'Max Balance Count Weekly',
    parameterPath: 'parameters[3].variables.maxBalanceCountWeekly',
  },
  {
    name: 'Max Balance Count Fortnightly',
    parameterPath: 'parameters[3].variables.maxBalanceCountFortnightly',
  },
  {
    name: 'Max Balance Count Monthly',
    parameterPath: 'parameters[3].variables.maxBalanceCountMonthly',
  },
  {
    name: 'Min Balance Threshold',
    parameterPath: 'parameters[3].variables.minBalanceThreshold',
  },
  // B2
  {
    name: 'Number of times day zero balance is allowed negative after income received',
    code: 'B2',
  },
  {
    name: 'Period Count Weekly',
    parameterPath: 'parameters[4].variables.periodCountWeekly',
  },
  {
    name: 'Period Count Fortnightly',
    parameterPath: 'parameters[4].variables.periodCountFortnightly',
  },
  {
    name: 'Period Count Monthly',
    parameterPath: 'parameters[4].variables.periodCountMonthly',
  },
  {
    name: 'Max Negative Balance Count',
    parameterPath: 'parameters[4].variables.maxNegativeBalanceCount',
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
  I1: 'Number of recent consecutive pay cycles assessed',
  I2: 'Average income per cycle',
  I3: 'Number income timing variations OR Balance on expected income day greater than',
  I6: 'Government income as % total recent income',
  I7: 'Recent income',
  B1: 'Number of times day zero balance is allowed below minimum after income received',
  B2: 'Number of times day zero balance is allowed negative after income received',
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
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxTimingVariationCount: 1,
          maxTimingVariationDays: 2,
        },
      },
      {
        active: true,
        code: 'I2',
        name: PARAMETER_NAMES.I2,
        variables: {
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          minIncomeAverage: 300,
        },
      },
      {
        active: true,
        code: 'I6',
        name: PARAMETER_NAMES.I6,
        variables: {
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxIncomePercentage: 50,
        },
      },
      {
        active: true,
        code: 'B1',
        name: PARAMETER_NAMES.B1,
        variables: {
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxBalanceCountWeekly: 2,
          maxBalanceCountFortnightly: 1,
          maxBalanceCountMonthly: 0,
          minBalanceThreshold: 75,
        },
      },
      {
        active: true,
        code: 'B2',
        name: PARAMETER_NAMES.B2,
        variables: {
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxNegativeBalanceCount: 1,
        },
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
        variables: {
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxTimingVariationCount: 1,
          maxTimingVariationDays: 2,
        },
      },
      {
        active: true,
        code: 'I2',
        name: PARAMETER_NAMES.I2,
        variables: {
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          minIncomeAverage: 350,
        },
      },
      {
        active: true,
        code: 'I6',
        name: PARAMETER_NAMES.I6,
        variables: {
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxIncomePercentage: 50,
        },
      },
      {
        active: true,
        code: 'B1',
        name: 'Number of times day zero balance is allowed below minimum after income received',
        variables: {
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxBalanceCountWeekly: 2,
          maxBalanceCountFortnightly: 1,
          maxBalanceCountMonthly: 0,
          minBalanceThreshold: 90,
        },
      },
      {
        active: true,
        code: 'B2',
        name: PARAMETER_NAMES.B2,
        variables: {
          periodCountWeekly: 6,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxNegativeBalanceCount: 0,
        },
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
        variables: {
          periodCountWeekly: 8,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxTimingVariationCount: 1,
          maxTimingVariationDays: 2,
        },
      },
      {
        active: true,
        code: 'I2',
        name: PARAMETER_NAMES.I2,
        variables: {
          periodCountWeekly: 8,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          minIncomeAverage: 450,
        },
      },
      {
        active: true,
        code: 'I6',
        name: PARAMETER_NAMES.I6,
        variables: {
          periodCountWeekly: 8,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxIncomePercentage: 50,
        },
      },
      {
        active: true,
        code: 'B1',
        name: PARAMETER_NAMES.B1,
        variables: {
          periodCountWeekly: 8,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxBalanceCountWeekly: 2,
          maxBalanceCountFortnightly: 1,
          maxBalanceCountMonthly: 0,
          minBalanceThreshold: 120,
        },
      },
      {
        active: true,
        code: 'B2',
        name: PARAMETER_NAMES.B2,
        variables: {
          periodCountWeekly: 8,
          periodCountFortnightly: 4,
          periodCountMonthly: 2,
          maxNegativeBalanceCount: 0,
        },
      },
    ],
  },
];
