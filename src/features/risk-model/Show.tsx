import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@material-ui/core';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import { get } from 'lodash';
import { ResourceComponentPropsWithId, Show, SimpleShowLayout, TextField } from 'react-admin';

import { useRiskModel } from './risk-model-hooks';
import ShowToolbar from '../../components/ShowToolbar';

interface RiskModelTableRow {
  name: string;
  code?: string;
  parameterPath?: string;
}
const rows: RiskModelTableRow[] = [
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

const StyledTableCell = withStyles((theme: Theme) =>
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

const CellWithRightBorder = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRightWidth: 1,
      borderRightColor: theme.palette.grey[300],
      borderRightStyle: 'solid',
    },
  }),
)(TableCell);

const RiskModelShow = (props: ResourceComponentPropsWithId): JSX.Element => {
  const riskModelId = get(props, 'id', '');
  const { riskModel } = useRiskModel(riskModelId);
  const approvedLimits = riskModel?.ruleSets.map((ruleSet) =>
    ruleSet.approvedLimit ? ruleSet.approvedLimit : undefined,
  );
  return (
    <Show {...props} actions={<ShowToolbar deleteCustomLabel="Cancel" />}>
      <SimpleShowLayout>
        <TextField source="name" />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Parameters</StyledTableCell>
                <StyledTableCell align="right">Code</StyledTableCell>
                {approvedLimits?.map((approvedLimit) => (
                  <StyledTableCell align="right">${approvedLimit}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <CellWithRightBorder
                    component="th"
                    scope="row"
                    align={row.code ? 'left' : 'right'}
                  >
                    {row.name}
                  </CellWithRightBorder>
                  <CellWithRightBorder align="right">{row.code}</CellWithRightBorder>
                  {approvedLimits?.map((approvedLimit, index) => (
                    <CellWithRightBorder align="right">
                      {row.parameterPath &&
                        get(riskModel, `ruleSets[${index}].${row.parameterPath}`)}
                    </CellWithRightBorder>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SimpleShowLayout>
    </Show>
  );
};

export default RiskModelShow;
