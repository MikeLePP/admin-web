import { TableContainer, Table, TableHead, TableRow, TableBody, Paper } from '@material-ui/core';
import { get } from 'lodash';
import { ResourceComponentPropsWithId, Show, SimpleShowLayout, TextField } from 'react-admin';

import { useRiskModel } from './risk-model-hooks';
import ShowToolbar from '../../components/ShowToolbar';
import { RowsData, StyledTableCell, CellWithRightBorder } from './common';

const RiskModelShow = (props: ResourceComponentPropsWithId): JSX.Element => {
  const riskModelId = get(props, 'id', '');
  const { riskModel } = useRiskModel(riskModelId);
  const approvedLimits = riskModel?.ruleSets.map((ruleSet) =>
    ruleSet.approveLimit ? ruleSet.approveLimit : undefined,
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
                {approvedLimits?.map((approveLimit) => (
                  <StyledTableCell align="right">${approveLimit}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {RowsData.map((row) => (
                <TableRow key={row.name}>
                  <CellWithRightBorder
                    component="th"
                    scope="row"
                    align={row.code ? 'left' : 'right'}
                  >
                    {row.name}
                  </CellWithRightBorder>
                  <CellWithRightBorder align="right">{row.code}</CellWithRightBorder>
                  {approvedLimits?.map((approveLimit, index) => (
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
