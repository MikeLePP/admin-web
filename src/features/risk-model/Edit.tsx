import {
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { Add as CreateIcon, SaveOutlined as SaveIcon } from '@material-ui/icons';
import { get, set } from 'lodash';
import { MouseEvent, useEffect, useState } from 'react';
import { Edit, ResourceComponentPropsWithId, SimpleForm, Toolbar, useNotify } from 'react-admin';
import { useHistory } from 'react-router-dom';
import EditToolbar from '../../components/EditToolbar';
import { callApi } from '../../helpers/api';
import { notifyOnFailure } from '../../helpers/notify';
import { RiskModel } from '../../types/risk-model';
import { CellWithRightBorder, RowsData, StyledTableCell } from './common';
import { useRiskModel } from './risk-model-hooks';

type SaveToolbarProps = {
  saveButtonLabel?: string;
  pristine?: boolean;
  currentRiskModel?: RiskModel;
  riskModelId: string;
};
const EditSaveToolbar = ({
  saveButtonLabel = 'Save',
  pristine,
  currentRiskModel,
  riskModelId,
  ...rest
}: SaveToolbarProps): JSX.Element => {
  const history = useHistory();
  const notify = useNotify();
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
  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Call PUT API
    async function saveRiskModel() {
      try {
        if (riskModelId && currentRiskModel) {
          await callApi(`/risk-models/${riskModelId}`, 'put', {
            ...currentRiskModel,
          });
          history.goBack();
        }
      } catch (err) {
        notify('Cannot update risk model', 'error');
      }
    }
    void saveRiskModel();
  };
  return (
    <Toolbar {...rest}>
      <Button
        onClick={handleSave}
        startIcon={icon}
        disabled={false}
        className="mr-2"
        variant="contained"
        color="primary"
      >
        Save
      </Button>
      <Button onClick={handleCancelClick}>Cancel</Button>
    </Toolbar>
  );
};
const RiskModelEdit = (props: ResourceComponentPropsWithId): JSX.Element | null => {
  const riskModelId = get(props, 'id', '');
  const { riskModel } = useRiskModel(riskModelId);
  const [value, setValue] = useState<RiskModel | undefined>();
  const approvedLimits = riskModel?.ruleSets.map((ruleSet) =>
    ruleSet.approveLimit ? ruleSet.approveLimit : undefined,
  );
  const notify = useNotify();
  useEffect(() => {
    if (riskModel) {
      setValue(riskModel);
    }
  }, [riskModel]);
  const onRiskModelParameterChange =
    (parameterPath: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: currentValue } = e.target;
      const newValue = set(value || {}, parameterPath, parseFloat(currentValue)) as RiskModel;
      setValue(newValue);
    };
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value: nameValue } = e.target;
    const newValue = {
      ...value,
      name: nameValue,
    } as RiskModel;
    setValue(newValue);
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
      <SimpleForm
        toolbar={
          <EditSaveToolbar pristine={false} currentRiskModel={value} riskModelId={riskModelId} />
        }
      >
        <TextField
          variant="standard"
          value={value?.name}
          label="Name"
          onChange={handleChangeName}
          InputLabelProps={{
            shrink: !!value?.name,
          }}
          className="pb-4"
        />
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
