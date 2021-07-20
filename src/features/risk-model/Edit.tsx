import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TextField,
} from '@material-ui/core';
import { SaveOutlined as SaveIcon, Add as CreateIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { get, set } from 'lodash';
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
import { SaveButton, Toolbar } from 'react-admin';
import { Button } from '@material-ui/core';
import { notifyOnFailure } from '../../helpers/notify';
import { useRiskModel } from './risk-model-hooks';
import { useState, useEffect } from 'react';
import { RiskModel } from '../../types/risk-model';
type SaveToolbarProps = {
  saveButtonLabel?: string;
  pristine?: boolean;
  currentRiskModel?: RiskModel
};
const EditSaveToolbar = ({
  saveButtonLabel = 'Save',
  pristine,
  currentRiskModel,
  ...rest
}: SaveToolbarProps): JSX.Element => {
  const history = useHistory();
  let icon;
  switch (saveButtonLabel) {
    case 'Save':
      icon = <SaveIcon />;
      break;
    case 'Create':
      icon = <CreateIcon />;
      break;
    default:
  }
  const handleCancelClick = () => {
    history.goBack();
  };
  const handleSave = (): void => {
    // Call PUT API
  };
  return (
    <Toolbar {...rest}>
      <SaveButton
        onClick={handleSave}
        label={saveButtonLabel}
        icon={icon}
        disabled={false}
        className="mr-2"
      />
      <Button onClick={handleCancelClick}>Cancel</Button>
    </Toolbar>
  );
};
const RiskModelEdit = (props: ResourceComponentPropsWithId): JSX.Element | null => {
  const riskModelId = get(props, 'id', '');
  const { riskModel } = useRiskModel(riskModelId);
  const [value, setValue] = useState<RiskModel | undefined>();
  const approvedLimits = riskModel?.ruleSets.map((ruleSet) =>
    ruleSet.approvedLimit ? ruleSet.approvedLimit : undefined,
  );
  const notify = useNotify();
  useEffect(() => {
    if (riskModel) {
      setValue(riskModel);
    }
  }, [riskModel]);
  const onRiskModelParameterChange =
    (parameterPath: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentValue = e.target.value;
      console.log("---", parameterPath, currentValue)
      // Update the "value" state with parameterPath and currentValue inside here
    };
  return (
    <Edit
      {...props}
      title="Edit Transaction"
      onFailure={notifyOnFailure(notify)}
      // transform={transform}
      mutationMode="pessimistic"
      actions={<EditToolbar />}
    >
      <SimpleForm toolbar={<EditSaveToolbar pristine={false} currentRiskModel={value} />}>
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
                          defaultValue={
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