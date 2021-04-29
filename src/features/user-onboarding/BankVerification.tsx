/* eslint-disable eqeqeq */
import { useEffect, useState } from 'react';
import { Typography, InputAdornment, Button } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import cn from 'classnames';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import { fetchStart, fetchEnd } from 'react-admin';
import { useDispatch } from 'react-redux';

import YesNoButtons from '../../components/YesNoButtons';
import InputField from '../../components/InputField';
import ActionButtons from './ActionButtons';
import { callApi } from '../../helpers/api';

const validationSchema = yup.object({
  bankDetailsAvailable: yup.boolean(),
  accountBsb: yup
    .string()
    .when('bankDetailsAvailable', (val: boolean, schema: yup.StringSchema) =>
      val ? schema.length(6, 'BSB number must be 6 digits') : schema,
    ),
  accountNumber: yup
    .string()
    .when('bankDetailsAvailable', (val: boolean, schema: yup.StringSchema) =>
      val
        ? schema
            .min(1, 'Account number must have at least 1 digit')
            .max(9, 'Account number cannot have more than 9 digits')
        : schema,
    ),
});

export default ({
  values,
  labels,
  userDetails,
  onChange,
  onNextStep,
  onCompleteStep,
  notify,
  identity,
}: any) => {
  const [verified, setVerified] = useState(false);
  const [notifyContinue, setNotifyContinue] = useState(false);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    validateOnBlur: true,
    enableReinitialize: true,
    initialValues: values,
    validationSchema,
    onSubmit: async (values) => {
      if (!formik.dirty) {
        // go to next step when nothing changes
        onCompleteStep(true);
        onNextStep(false);
      } else {
        try {
          setLoading(true);
          dispatch(fetchStart());
          // 1. call bank account api to set is verify
          await callApi(`/bank-accounts/${userDetails.bankAccount.id}`, 'patch', {
            verified,
            updatedBy: identity?.id,
          });
          // 2. call onboarding api to complete this step
          await callApi(`/onboarding/${userDetails.id}`, 'post', {
            step: 'bank-account',
            bankAccountId: userDetails.bankAccount.id,
            notifyUser: notifyContinue,
            updatedBy: identity?.id,
          });

          onChange(values, undefined, verified);
          onNextStep(!verified);
        } catch (error) {
          notify(error, 'error');
        } finally {
          setLoading(false);
          dispatch(fetchEnd()); // stop the global loading indicator
        }
      }
    },
  });

  useEffect(() => {
    if (
      formik.values.accountBsb == userDetails.bankAccount.accountBsb &&
      formik.values.accountNumber == userDetails.bankAccount.accountNumber
    ) {
      setVerified(formik.values.bankDetailsAvailable);
    }
  }, [
    formik.values.bankDetailsAvailable,
    formik.values.accountNumber,
    formik.values.accountBsb,
    userDetails.bankAccount.accountNumber,
    userDetails.bankAccount.accountBsb,
  ]);

  const valueMatched = (name: string) =>
    formik.values[name] ? formik.values[name] == userDetails.bankAccount[name] : true;

  const handleNotifyContinue = () => {
    setNotifyContinue(true);
  };

  return (
    <form className="flex flex-col" onSubmit={formik.handleSubmit}>
      <div className="flex-grow px-8">
        <Typography variant="h6" className="mb-4">
          Bank details available?
        </Typography>
        <YesNoButtons
          isYes={formik.values.bankDetailsAvailable}
          onYesClick={() => formik.setFieldValue('bankDetailsAvailable', true)}
          onNoClick={() => formik.setFieldValue('bankDetailsAvailable', false)}
        />
        {formik.values.bankDetailsAvailable && (
          <div className="mt-8 space-y-4 max-w-xs">
            <Typography variant="h6">Enter customer bank details</Typography>
            <InputField
              required
              autoFocus
              name="accountBsb"
              label={labels.accountBsb}
              type="tel"
              formik={formik}
              helperText={
                valueMatched('accountBsb') ? '' : 'BSB does not match with the one in the system.'
              }
              FormHelperTextProps={{
                className: cn({ 'text-black': !valueMatched('accountBsb') }),
              }}
              InputProps={{
                ...(formik.values.accountBsb && {
                  endAdornment: (
                    <InputAdornment position="end">
                      {valueMatched('accountBsb') ? (
                        <CheckCircleOutlinedIcon color="inherit" className="text-green-500" />
                      ) : (
                        <CancelOutlinedIcon color="error" />
                      )}
                    </InputAdornment>
                  ),
                }),
              }}
              inputProps={{
                min: 0,
              }}
            />
            <InputField
              required
              name="accountNumber"
              label={labels.accountNumber}
              type="tel"
              formik={formik}
              helperText={
                valueMatched('accountNumber')
                  ? ''
                  : 'Account number does not match with the one in the system.'
              }
              FormHelperTextProps={{
                className: cn({ 'text-black': !valueMatched('accountNumber') }),
              }}
              InputProps={{
                ...(formik.values.accountNumber && {
                  endAdornment: (
                    <InputAdornment position="end">
                      {valueMatched('accountNumber') ? (
                        <CheckCircleOutlinedIcon color="inherit" className="text-green-500" />
                      ) : (
                        <CancelOutlinedIcon color="error" />
                      )}
                    </InputAdornment>
                  ),
                }),
              }}
              inputProps={{
                min: 0,
              }}
            />
          </div>
        )}
      </div>
      <ActionButtons loading={loading}>
        <div className="space-x-2">
          <Button variant="contained" color="secondary" type="submit" disabled={loading}>
            Continue
          </Button>
          {!verified && (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              onClick={handleNotifyContinue}
            >
              Notify and continue
            </Button>
          )}
        </div>
      </ActionButtons>
    </form>
  );
};
