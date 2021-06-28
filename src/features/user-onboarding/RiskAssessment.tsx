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
  List,
  ListItem,
  Radio,
  Chip,
  IconButton,
} from '@material-ui/core';
import { OpenInNewOutlined as OpenInNewIcon } from '@material-ui/icons';
import { useFormik } from 'formik';
import { map, startCase } from 'lodash';
import { useEffect, useState } from 'react';
import { fetchEnd, fetchStart } from 'react-admin';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import InputField from '../../components/InputField';
import TextLabel from '../../components/TextLabel';
import YesNoButtons from '../../components/YesNoButtons';
import INCOME_FREQUENCIES from '../../constants/incomeFrequencies';
import { callApi } from '../../helpers/api';
import { parseBankAccount } from '../../helpers/bankAccount';
import { toLocalDateString } from '../../helpers/date';
import ActionButtons from './ActionButtons';
import { DECLINE_REASONS, GOVERNMENT_SUPPORT, RISK_MODELS, APPROVED_AMOUNT } from './constants';
import {
  BankAccountData,
  BankAccount,
  OnboardingComponentProps,
  RiskAssessmentValues,
} from './OnboardingSteps';
import { useTransaction } from '../../hooks/transaction-hook';
import TransactionDialog from '../../components/TransactionDialog';

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

const RiskAssessment = ({
  identity,
  labels,
  notify,
  onChange,
  onNextStep,
  onPrevStep,
  riskAssessmentId,
  userDetails,
  values,
}: OnboardingComponentProps<RiskAssessmentValues>): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [dataLastAt, setDataLastAt] = useState<string | undefined>();
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const transactionData = useTransaction(userDetails?.id);
  const [userBankAccounts, setUserBankAccounts] = useState<BankAccount[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setDataLastAt(transactionData.dataLastAt);
  }, [transactionData.dataLastAt]);

  useEffect(() => {
    // get user bank accounts
    const getBankAccounts = async () => {
      try {
        const { json } = await callApi<{ data: BankAccountData[] }>(
          `/users/${userDetails.id}/bank-accounts`,
        );
        setUserBankAccounts(parseBankAccount(json.data));
      } catch (error) {
        notify(error, 'error');
      }
    };
    void getBankAccounts();
  }, [notify, userDetails.id]);

  const formik = useFormik({
    initialValues: values,
    validationSchema,
    onSubmit: async (_values) => {
      try {
        let newRiskAssessmentId = riskAssessmentId;
        setLoading(true);
        dispatch(fetchStart());

        if (_values.primaryAccountId) {
          // set primary bank account
          await callApi(`/onboarding/${userDetails.id}`, 'post', {
            step: 'bank-account',
            bankAccountId: _values.primaryAccountId,
            updatedBy: identity?.id,
          });
        }

        // 1. create or update risk assessment
        const incomeSupport = _values.incomeSupport === 'true';
        if (riskAssessmentId) {
          await callApi(`/risk-assessments/${riskAssessmentId}`, 'patch', {
            ..._values,
            incomeSupport,
            updatedBy: identity?.id,
          });
        } else {
          const { json } = await callApi<{ id: string }>('/risk-assessments', 'post', {
            ..._values,
            incomeSupport,
            userId: userDetails.id,
            createdBy: identity?.id,
          });
          newRiskAssessmentId = json.id;
        }

        // 2. call onboarding api to complete this step
        await callApi(`/onboarding/${userDetails.id}`, 'post', {
          step: 'risk-assessment',
          riskAssessmentId: newRiskAssessmentId,
          updatedBy: identity?.id,
        });

        onChange({ ..._values, incomeSupport }, undefined, _values.approved, {
          riskAssessmentId: newRiskAssessmentId,
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

  const handleChange = (type: string) => async (event: React.ChangeEvent<{ value: unknown }>) => {
    await formik.setFieldValue(type, event.target.value as string[]);
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
      <form className="flex flex-col" onSubmit={formik.handleSubmit}>
        <div className="px-8">
          <Typography variant="h6" className="mb-4">
            Risk assessment
          </Typography>

          {userBankAccounts.length && (
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Typography variant="subtitle2" className="font-bold">
                  Verify transactions and set primary account
                </Typography>
                <div>
                  <IconButton href={transactionData.reportUrl} target="_blank">
                    <OpenInNewIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setShowAllTransactions(true)}
                  >
                    View bank statements
                  </Button>
                </div>
              </div>

              <List>
                {map(userBankAccounts, (account) => (
                  <>
                    <ListItem key={account.id}>
                      <Radio
                        required
                        name="primaryAccountId"
                        checked={formik.values.primaryAccountId === account.id}
                        onChange={() => formik.setFieldValue('primaryAccountId', account.id)}
                      />
                      <ListItemText
                        primary={
                          <div className="flex">
                            <Typography className="mr-2">
                              {startCase(account.accountType)}
                            </Typography>
                            {formik.values.primaryAccountId === account.id && (
                              <Chip
                                variant="outlined"
                                color="secondary"
                                size="small"
                                label="Primary account"
                              />
                            )}
                          </div>
                        }
                        secondary={`[BSB: ${account.accountBsb || '-'} ACC: ${
                          account.accountNumber || '-'
                        }] ${account.accountName}`}
                      />
                    </ListItem>
                    {formik.values.primaryAccountId === account.id &&
                      account.accountType !== 'transaction' && (
                        <Typography color="error" className="ml-4 pl-14">
                          Primary account is not a transaction account type.
                          <br />
                          Are you sure that direct debits may be made to this account?
                          <br />
                          WARNING THIS IS NOT COMMON, SEEK MANAGEMENT APPROVAL.
                        </Typography>
                      )}
                  </>
                ))}
              </List>
            </div>
          )}

          <Typography variant="subtitle2" className="mb-4 font-bold">
            Employment details
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <InputField
                required
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
                  onChange={handleChange('rejectedReasons')}
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
          {formik.values.approved === true && (
            <div className="mt-8 max-w-sm">
              <FormControl variant="outlined" className="w-full">
                <InputLabel required htmlFor="approvedAmount-checkbox-label">
                  {labels.approvedAmount}
                </InputLabel>
                <Select
                  required
                  name="approvedAmount-checkbox-label"
                  label={labels.approvedAmount}
                  value={formik.values.approvedAmount}
                  onChange={handleChange('approvedAmount')}
                >
                  {APPROVED_AMOUNT.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
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
      <TransactionDialog
        openDialog={showAllTransactions}
        setShowAllTransactions={setShowAllTransactions}
        reportUrl={transactionData.reportUrl}
        userId={userDetails?.id}
        dataLastAt={dataLastAt}
        setDataLastAt={setDataLastAt}
      />
    </div>
  );
};

export default RiskAssessment;
