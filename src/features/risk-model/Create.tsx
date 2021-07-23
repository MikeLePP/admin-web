import {
  Button,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { Add as CreateIcon } from '@material-ui/icons';
import { get, set } from 'lodash';
import { ChangeEvent, MouseEvent, useState } from 'react';
import {
  Create,
  ResourceComponentProps,
  SimpleForm,
  Toolbar,
  useGetIdentity,
  useNotify,
} from 'react-admin';
import { useHistory } from 'react-router-dom';
import { riskModelTypes } from '../../constants/riskModelType';
import { callApi } from '../../helpers/api';
import { RiskModel } from '../../types/risk-model';
import { CellWithRightBorder, RowsData, ruleSetDefault, StyledTableCell } from './common';

type SaveToolbarProps = {
  riskModelName: string;
  currentRiskModel?: RiskModel;
};

const EditSaveToolbar = ({
  riskModelName,
  currentRiskModel,
  ...rest
}: SaveToolbarProps): JSX.Element => {
  const history = useHistory();
  const notify = useNotify();
  const { identity } = useGetIdentity();
  const handleCancelClick = () => {
    history.goBack();
  };
  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    if (!riskModelName) {
      notify("Risk model's name should not be empty", 'error');
      return;
    }
    if (!currentRiskModel?.modelType) {
      notify("Risk model's type should not be empty", 'error');
      return;
    }
    e.stopPropagation();
    // Call PUT API
    async function saveRiskModel() {
      try {
        if (currentRiskModel) {
          const riskModel = await callApi(`/risk-models`, 'post', {
            ...currentRiskModel,
            name: riskModelName,
            createdBy: identity?.id,
          });
          const riskModelId = get(riskModel, 'json.id') as string | undefined;
          if (riskModelId) {
            history.push(`/risk-models/${riskModelId}/show`);
          } else {
            history.push(`/risk-models/`);
          }
        }
      } catch (err) {
        const errTitle = get(err, 'body.errors[0].title', 'Cannot create risk assessment');
        notify(errTitle, 'error');
      }
    }
    void saveRiskModel();
  };
  return (
    <Toolbar {...rest}>
      <Button
        onClick={handleSave}
        startIcon={<CreateIcon />}
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

const RiskCreate = (props: ResourceComponentProps): JSX.Element => {
  const [riskModel, setRiskModel] = useState<RiskModel>({
    ruleSets: [...ruleSetDefault],
  } as unknown as RiskModel);
  const [name, setName] = useState<string>('');
  const handleSelectRiskModel = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = e.target;
    setRiskModel({
      ...riskModel,
      modelType: value as RiskModel['modelType'],
    });
  };
  const handleRiskModelParameterChange =
    (parameterPath: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: currentValue } = e.target;
      const newValue = set(riskModel || {}, parameterPath, parseFloat(currentValue));
      setRiskModel(newValue);
    };
  const approvedLimits = ruleSetDefault.map((ruleSet) => ruleSet.approveLimit);
  return (
    <Create {...props}>
      <SimpleForm toolbar={<EditSaveToolbar currentRiskModel={riskModel} riskModelName={name} />}>
        <Grid container className="w-full pb-4">
          <Grid item xs={6}>
            <TextField
              className="pr-2"
              value={riskModel.name}
              label="Title"
              fullWidth
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              className="pl-2"
              color="secondary"
              fullWidth
              required
              select
              label="Risk Model"
              value={riskModel.modelType}
              onChange={handleSelectRiskModel}
            >
              {riskModelTypes.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <TableContainer className="overflow-x-hidden" component={Paper} style={{ width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Parameters</StyledTableCell>
                <StyledTableCell align="right">Code</StyledTableCell>
                {approvedLimits?.map((approvedLimit, index) => (
                  <StyledTableCell align="right">
                    <TextField
                      InputProps={{
                        className: 'text-white',
                      }}
                      type="number"
                      defaultValue={approvedLimit}
                      onChange={handleRiskModelParameterChange(`ruleSets[${index}].approveLimit`)}
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
                          onChange={handleRiskModelParameterChange(
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
    </Create>
  );
};
export default RiskCreate;
