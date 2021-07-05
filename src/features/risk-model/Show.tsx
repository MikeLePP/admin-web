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
  approvedLimit50Address?: string;
  approvedLimit75Address?: string;
  approvedLimit100Address?: string;
}

const rows: RiskModelTableRow[] = [
  {
    name: 'Number consecutive pay...',
    code: 'I1',
  },
  {
    name: 'Weekly',
    approvedLimit50Address: 'ruleSets[0].parameters[0].variables.minCountWeekly',
    approvedLimit75Address: 'ruleSets[1].parameters[0].variables.minCountWeekly',
    approvedLimit100Address: 'ruleSets[2].parameters[0].variables.minCountWeekly',
  },
  {
    name: 'Fortnightly',
    approvedLimit50Address: 'ruleSets[0].parameters[0].variables.minCountFortnightly',
    approvedLimit75Address: 'ruleSets[1].parameters[0].variables.minCountFortnightly',
    approvedLimit100Address: 'ruleSets[2].parameters[0].variables.minCountFortnightly',
  },
  {
    name: 'Monthly',
    approvedLimit50Address: 'ruleSets[0].parameters[0].variables.minCountMonthly',
    approvedLimit75Address: 'ruleSets[1].parameters[0].variables.minCountMonthly',
    approvedLimit100Address: 'ruleSets[2].parameters[0].variables.minCountMonthly',
  },
  {
    name: 'Average income per cycle',
    code: 'I2',
    approvedLimit50Address: 'ruleSets[0].parameters[1].variables.minAmount',
    approvedLimit75Address: 'ruleSets[1].parameters[1].variables.minAmount',
    approvedLimit100Address: 'ruleSets[2].parameters[1].variables.minAmount',
  },
  { name: 'Number income timing...', code: 'I3' },
  {
    name: 'Max count',
    approvedLimit50Address: 'ruleSets[0].parameters[2].variables.maxCount',
    approvedLimit75Address: 'ruleSets[1].parameters[2].variables.maxCount',
    approvedLimit100Address: 'ruleSets[2].parameters[2].variables.maxCount',
  },
  {
    name: 'Min balance',
    approvedLimit50Address: 'ruleSets[0].parameters[2].variables.minBalance',
    approvedLimit75Address: 'ruleSets[1].parameters[2].variables.minBalance',
    approvedLimit100Address: 'ruleSets[2].parameters[2].variables.minBalance',
  },
  {
    name: 'Government income as %...',
    code: 'I6',
    approvedLimit50Address: 'ruleSets[0].parameters[3].variables.maxPercent',
    approvedLimit75Address: 'ruleSets[1].parameters[3].variables.maxPercent',
    approvedLimit100Address: 'ruleSets[2].parameters[3].variables.maxPercent',
  },
  { name: 'Recent income', code: 'I7' },
  {
    name: 'Weekly',
    approvedLimit50Address: 'ruleSets[0].parameters[4].variables.maxCountWeekly',
    approvedLimit75Address: 'ruleSets[1].parameters[4].variables.maxCountWeekly',
    approvedLimit100Address: 'ruleSets[2].parameters[4].variables.maxCountWeekly',
  },
  {
    name: 'Fortnightly',
    approvedLimit50Address: 'ruleSets[0].parameters[4].variables.maxCountFortnightly',
    approvedLimit75Address: 'ruleSets[1].parameters[4].variables.maxCountFortnightly',
    approvedLimit100Address: 'ruleSets[2].parameters[4].variables.maxCountFortnightly',
  },
  {
    name: 'Monthly',
    approvedLimit50Address: 'ruleSets[0].parameters[4].variables.maxCountMonthly',
    approvedLimit75Address: 'ruleSets[1].parameters[4].variables.maxCountMonthly',
    approvedLimit100Address: 'ruleSets[2].parameters[4].variables.maxCountMonthly',
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
  return (
    <Show {...props} actions={<ShowToolbar deleteCustomLabel="Cancel" />}>
      <SimpleShowLayout>
        <TextField label="Name" source="name" />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Parameters</StyledTableCell>
                <StyledTableCell align="right">Code</StyledTableCell>
                <StyledTableCell align="right">$50</StyledTableCell>
                <StyledTableCell align="right">$75</StyledTableCell>
                <StyledTableCell align="right">$100</StyledTableCell>
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
                  <CellWithRightBorder align="right">
                    {row.approvedLimit50Address && get(riskModel, row.approvedLimit50Address)}
                  </CellWithRightBorder>
                  <CellWithRightBorder align="right">
                    {row.approvedLimit75Address && get(riskModel, row.approvedLimit75Address)}
                  </CellWithRightBorder>
                  <CellWithRightBorder align="right">
                    {row.approvedLimit100Address && get(riskModel, row.approvedLimit100Address)}
                  </CellWithRightBorder>
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
