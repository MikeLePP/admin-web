import { TableContainer, Table, TableHead, TableRow, TableBody, Box } from '@material-ui/core';
import { get } from 'lodash';
import { ResourceComponentPropsWithId, Show, SimpleShowLayout, TextField } from 'react-admin';

import { useRiskModel } from '../../hooks/risk-model-hook';
import ShowToolbar from '../../components/ShowToolbar';
import { RowsData, StyledTableCell, CellWithRightBorder } from './common';

const RiskModelShow = (props: ResourceComponentPropsWithId): JSX.Element => {
  const riskModelId = get(props, 'id', '');
  const { riskModel } = useRiskModel(riskModelId);
  const approvedLimits = riskModel?.ruleSets.map((ruleSet) =>
    ruleSet.approveLimit ? ruleSet.approveLimit : undefined,
  );

  return (
    <Show
      {...props}
      title={`Risk model ${riskModel?.name || ''}`}
      actions={
        <ShowToolbar
          deleteCustomLabel="Delete"
          deleteButtonRedirectToPage="list"
          deleteTemplate={`Delete risk model \${name}`}
        />
      }
    >
      <SimpleShowLayout>
        <Box className="flex my-4">
          <Box>
            Name: <TextField source="name" />
          </Box>
          <Box className="px-4">
            Type: <TextField source="modelType" />
          </Box>
        </Box>
        <TableContainer className="overflow-x-hidden w-full">
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
                <TableRow key={row.parameterPath || row.name}>
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
