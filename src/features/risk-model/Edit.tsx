import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TextField,
} from '@material-ui/core';
import { get } from 'lodash';
import {
  Edit,
  Record,
  ResourceComponentPropsWithId,
  SimpleForm,
  useEditController,
  useGetIdentity,
  useNotify,
  TextInput,
  NumberInput,
  maxValue,
} from 'react-admin';
import { useFormik } from 'formik';

import { RowsData, StyledTableCell, CellWithRightBorder } from './common';

import EditToolbar from '../../components/EditToolbar';
import SaveToolbar from '../../components/SaveToolbar';
import { notifyOnFailure } from '../../helpers/notify';
import { getId } from '../../helpers/url';
import { useRiskModel } from './risk-model-hooks';

const RiskModelEdit = (props: ResourceComponentPropsWithId): JSX.Element | null => {
  const riskModelId = get(props, 'id', '');
  const { riskModel } = useRiskModel(riskModelId);
  const approvedLimits = riskModel?.ruleSets.map((ruleSet) =>
    ruleSet.approvedLimit ? ruleSet.approvedLimit : undefined,
  );
  const notify = useNotify();
  const { record } = useEditController(props);

  const onRiskModelParameterChange =
    (parameterPath: string) => (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <Edit
      {...props}
      title="Edit Transaction"
      onFailure={notifyOnFailure(notify)}
      // transform={transform}
      mutationMode="pessimistic"
      actions={<EditToolbar />}
    >
      <SimpleForm>
        <TextInput source="name" />
        <TableContainer component={Paper} style={{ width: '100%' }}>
          <Table>
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
                  {approvedLimits?.map((approvedLimit, index) => (
                    <CellWithRightBorder align="right">
                      {row.parameterPath && (
                        <TextField
                          id="filled-number"
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={
                            row.parameterPath &&
                            get(riskModel, `ruleSets[${index}].${row.parameterPath}`)
                          }
                          onChange={onRiskModelParameterChange(
                            `ruleSets[${index}].${row.parameterPath}`,
                          )}
                        />
                      )}
                    </CellWithRightBorder>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SimpleForm>
    </Edit>
  );
};

export default RiskModelEdit;
