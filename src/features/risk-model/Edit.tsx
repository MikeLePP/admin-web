import {
  Box,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import {
  Add as CreateIcon,
  ArrowBack as BackIcon,
  SaveOutlined as SaveIcon,
} from '@material-ui/icons';
import { get, set } from 'lodash';
import { Fragment, MouseEvent, useEffect, useState } from 'react';
import {
  Edit,
  ListButton,
  ResourceComponentPropsWithId,
  SimpleForm,
  Toolbar,
  TopToolbar,
  useGetIdentity,
  useNotify,
} from 'react-admin';
import { useHistory } from 'react-router-dom';
import Dialog from '../../components/Dialog';
import { callApi } from '../../helpers/api';
import { notifyOnFailure } from '../../helpers/notify';
import { useRiskModel } from '../../hooks/risk-model-hook';
import { RiskModel } from '../../types/risk-model';
import { CellWithRightBorder, RowsData, StyledTableCell } from './common';

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
  const { identity } = useGetIdentity();
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
          await callApi(`/risk-models/${riskModelId}`, 'patch', {
            ...currentRiskModel,
            updatedBy: identity?.id,
          });
          history.push(`/risk-models/${riskModelId}/show`);
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

const CustomEditToolbar = (): JSX.Element => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const handleClickBack = () => {
    setOpenConfirmDialog(true);
  };
  const handleConfirmGoBack = () => {
    setOpenConfirmDialog(false);
    document.getElementById('back-button')?.click();
  };
  return (
    <Fragment>
      <TopToolbar>
        <Button startIcon={<BackIcon />} onClick={handleClickBack} color="primary">
          List
        </Button>
        <ListButton className="invisible" icon={<BackIcon />} id="back-button" />
        <Box display="flex" flexGrow={1} />
      </TopToolbar>
      <Dialog
        show={openConfirmDialog}
        confirmLabel="Confirm"
        title="Risk Model"
        body="Your change will not be saved. Are you sure?"
        onCancelClick={() => setOpenConfirmDialog(false)}
        onConfirmClick={handleConfirmGoBack}
      />
    </Fragment>
  );
};

const RiskModelEdit = (props: ResourceComponentPropsWithId): JSX.Element | null => {
  const riskModelId = get(props, 'id', '');
  const { riskModel } = useRiskModel(riskModelId);
  const [value, setValue] = useState<RiskModel | undefined>();
  const approvedLimits = riskModel?.ruleSets.map((ruleSet) => ruleSet.approveLimit);
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
      title={`Risk model ${riskModel?.name || ''}`}
      onFailure={notifyOnFailure(notify)}
      // transform={transform}
      mutationMode="pessimistic"
      actions={<CustomEditToolbar />}
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
        <TableContainer className="w-full	overflow-x-hidden	">
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Parameters</StyledTableCell>
                <StyledTableCell align="right">Code</StyledTableCell>
                {approvedLimits?.map((approvedLimit, index) => (
                  <StyledTableCell align="right">
                    <TextField
                      type="number"
                      InputProps={{
                        className: 'text-white',
                      }}
                      defaultValue={approvedLimit}
                      onChange={onRiskModelParameterChange(`ruleSets[${index}].approveLimit`)}
                    />
                  </StyledTableCell>
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
