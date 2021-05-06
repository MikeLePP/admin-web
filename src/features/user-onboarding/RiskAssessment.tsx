import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import { useState } from 'react';
import { fetchEnd, fetchStart, NotificationType, UserIdentity } from 'react-admin';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import InputField from '../../components/InputField';
import TextLabel from '../../components/TextLabel';
import YesNoButtons from '../../components/YesNoButtons';
import INCOME_FREQUENCIES from '../../constants/incomeFrequencies';
import { callApi } from '../../helpers/api';
import { toLocalDateString } from '../../helpers/date';
import { User } from '../../types/user';
import ActionButtons from './ActionButtons';
import { DECLINE_REASONS, GOVERNMENT_SUPPORT, RISK_MODELS } from './constants';

const validationSchema = yup.object({
  approved: yup.boolean(),
  incomeAverage: yup.number(),
  incomeDay1Min: yup.string(),
  incomeFrequency: yup.string(),
  incomeLastDate: yup.date(),
  incomeSupport: yup.boolean(),
  incomeVariationMax: yup.string(),
  riskModelVersion: yup.string(),
  rejectedReasons: yup
    .array()
    .when('approved', (val: boolean, schema: yup.AnySchema) =>
      val ? (schema.required() as yup.AnySchema) : schema,
    ),
});

export interface RiskAssessmentProps {
  identity?: UserIdentity;
  labels: Record<string, string>;
  notify: (message: string, notificationType?: NotificationType) => void;
  onChange: (
    values: Record<string, unknown>,
    key?: string,
    completed?: boolean,
    stepValues?: Record<string, unknown>,
  ) => void;
  onCompleteStep: (completed: boolean) => void;
  onNextStep: (goToSummary?: boolean) => void;
  onPrevStep: () => void;
  riskAssessmentId?: string;
  userDetails: User;
  values: {
    approved?: boolean;
    incomeAverage: string;
    incomeDay1Min: string;
    incomeFrequency: string;
    incomeLastDate: string;
    incomeSupport?: boolean;
    incomeVariationMax: string;
    rejectedReasons: string[];
    riskModelVersion: string;
  };
}

export default ({
  identity,
  labels,
  notify,
  onChange,
  onNextStep,
  onPrevStep,
  riskAssessmentId,
  userDetails,
  values,
}: RiskAssessmentProps): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: values,
    validationSchema,
    onSubmit: async (_values) => {
      let thisRiskAssessmentId = riskAssessmentId;
      setLoading(true);
      try {
        dispatch(fetchStart());
        const { incomeSupport } = _values;
        // 1. create or update risk assessment
        if (thisRiskAssessmentId) {
          await callApi(`/risk-assessments/${thisRiskAssessmentId}`, 'patch', {
            ..._values,
            incomeSupport,
            updatedBy: identity?.id,
          });
        } else {
          const { json } = await callApi('/risk-assessments', 'post', {
            ..._values,
            incomeSupport,
            userId: userDetails.id,
            createdBy: identity?.id,
          });
          thisRiskAssessmentId = json.id;
        }

        // 2. call onboarding api to complete this step
        await callApi(`/onboarding/${userDetails.id}`, 'post', {
          step: 'risk-assessment',
          thisRiskAssessmentId,
          updatedBy: identity?.id,
        });

        onChange({ ..._values, incomeSupport }, undefined, _values.approved, {
          thisRiskAssessmentId,
        });
        onNextStep(!_values.approved);
      } catch (error) {
        notify(error, 'error');
      } finally {
        setLoading(false);
        dispatch(fetchEnd()); // stop the global loading indicator
      }
    },
  });

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    await formik.setFieldValue('rejectedReasons', event.target.value as string[]);
  };

  return (
    <div className="flex flex-col">
      {userDetails.income && (
        <div className="px-8 mb-8">
          <Typography variant="subtitle2" className="font-bold mb-4">
            User entries
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextLabel label="Wage frequency" value={userDetails.income.frequency} />
            </Grid>
            <Grid item xs={6}>
              <TextLabel
                label="Date of last pay"
                value={toLocalDateString(userDetails.income.lastDate)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextLabel label="Last wage amount" value={userDetails.income.lastAmount} />
            </Grid>
            <Grid item xs={6}>
              <TextLabel label="Wage type" value={userDetails.income.source} />
            </Grid>
          </Grid>
        </div>
      )}
      <form className="mt-8 flex flex-col" onSubmit={formik.handleSubmit}>
        <div className="px-8">
          <Typography variant="h6" className="mb-4">
            Risk assessment
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <InputField
                required
                autoFocus
                select
                name="incomeFrequency"
                label={labels.incomeFrequency}
                formik={formik}
              >
                {INCOME_FREQUENCIES.map(({ id, name }) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </InputField>
            </Grid>
            <Grid item xs={6}>
              <InputField
                required
                name="incomeLastDate"
                label={labels.incomeLastDate}
                type="date"
                formik={formik}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                required
                name="incomeAverage"
                label={labels.incomeAverage}
                type="number"
                formik={formik}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                required
                select
                name="incomeSupport"
                label={labels.incomeSupport}
                formik={formik}
              >
                {GOVERNMENT_SUPPORT.map(({ id, name }) => (
                  <MenuItem key={id.toString()} value={id.toString()}>
                    {name}
                  </MenuItem>
                ))}
              </InputField>
            </Grid>
            <Grid item xs={6}>
              <InputField
                name="incomeDay1Min"
                label={labels.incomeDay1Min}
                type="number"
                formik={formik}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                name="incomeVariationMax"
                label={labels.incomeVariationMax}
                type="number"
                formik={formik}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                required
                select
                name="riskModelVersion"
                label={labels.riskModelVersion}
                formik={formik}
              >
                {RISK_MODELS.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </InputField>
            </Grid>
          </Grid>
          <div className="mt-8">
            <YesNoButtons
              isYes={formik.values.approved}
              yesLabel={formik.values.approved === true ? 'Approved' : 'Approve'}
              noLabel={formik.values.approved === false ? 'Declined' : 'Decline'}
              onYesClick={() => formik.setFieldValue('approved', true)}
              onNoClick={() => formik.setFieldValue('approved', false)}
            />
          </div>
          {formik.values.approved === false && (
            <div className="mt-8 max-w-sm">
              <FormControl variant="outlined" className="w-full">
                <InputLabel required htmlFor="rejectedReasons-checkbox-label">
                  {labels.rejectedReasons}
                </InputLabel>
                <Select
                  required
                  multiple
                  name="rejectedReasons-checkbox-label"
                  label={labels.rejectedReasons}
                  value={formik.values.rejectedReasons}
                  onChange={handleChange}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  {DECLINE_REASONS.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      <Checkbox checked={formik.values.rejectedReasons.indexOf(value) > -1} />
                      <ListItemText primary={label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
        </div>
        <ActionButtons onBackButtonClick={onPrevStep} loading={loading}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || formik.values.approved === undefined}
          >
            {riskAssessmentId ? 'Update and continue' : 'Create and continue'}
          </Button>
        </ActionButtons>
      </form>
    </div>
  );
};
