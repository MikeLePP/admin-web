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
  currentRiskModel?: RiskModel;
};

const EditSaveToolbar = ({ currentRiskModel, ...rest }: SaveToolbarProps): JSX.Element => {
  const history = useHistory();
  const notify = useNotify();
  const { identity } = useGetIdentity();
  const handleCancelClick = () => {
    history.goBack();
  };
  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Call PUT API
    async function saveRiskModel() {
      try {
        if (currentRiskModel) {
          await callApi(`/risk-models`, 'post', {
            ...currentRiskModel,
            createdBy: identity?.id,
          });
          history.goBack();
        }
      } catch (err) {
        notify('Cannot create risk model', 'error');
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
      <SimpleForm toolbar={<EditSaveToolbar currentRiskModel={riskModel} />}>
        <Grid container className="w-full pb-4">
          <Grid item xs={6}>
            <TextField
              className="pr-2"
              value={riskModel.name}
              label="Title"
              fullWidth
              variant="outlined"
              onChange={(e) => setRiskModel({ ...riskModel, name: e.target.value })}
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
                {approvedLimits?.map((approvedLimit) => (
                  <StyledTableCell align="right">$</StyledTableCell>
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
