import React, { useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Divider,
  FormControlLabel,
  Radio,
  Button,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { filter, indexOf, map, xor } from 'lodash';
import {
  RadioButtonUncheckedOutlined as CheckboxOutlineIcon,
  CheckCircleOutlined as CheckboxIcon,
} from '@material-ui/icons';
import { useFormik } from 'formik';
import { fetchEnd, fetchStart } from 'react-admin';
import ActionButtons from './ActionButtons';
import { OnboardingComponentProps } from './OnboardingSteps';
import { currencyFormat } from '../../helpers/string';
import { callApi } from '../../helpers/api';

interface BankSelectionProps extends Record<string, unknown> {
  accounts: string[];
  noAccountSelected: boolean;
}

const BankSelection = ({
  identity,
  labels,
  notify,
  onChange,
  onCompleteStep,
  onNextStep,
  userDetails,
  values,
  bankAccounts,
}: OnboardingComponentProps<BankSelectionProps>): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [notifyUser, setNotifyUser] = useState(false);

  const dispatch = useDispatch();

  const formik = useFormik({
    validateOnBlur: true,
    enableReinitialize: true,
    initialValues: values,
    onSubmit: async (innerValues) => {
      if (!formik.dirty) {
        // go to next step when nothing changes
        onCompleteStep(true);
        onNextStep(false);
      } else {
        try {
          setLoading(true);
          dispatch(fetchStart());
          // get selected bank account details
          const selectedAccounts = filter(
            bankAccounts,
            (acc) => indexOf(innerValues.accounts, acc.id) !== -1,
          );
          if (selectedAccounts.length) {
            // call bank to create selected bank accounts
            await callApi(`/users/${userDetails.id}/bank-accounts`, 'put', {
              data: map(selectedAccounts, (account) => ({
                attributes: {
                  accountBsb: account.accountBsb,
                  accountName: account.accountName,
                  accountNumber: account.accountNumber,
                  accountType: account.accountType,
                  bankName: account.institutionName,
                  createdBy: identity?.id,
                },
              })),
            });
          }

          // call onboarding api to complete this step
          await callApi(`/onboarding/${userDetails.id}`, 'post', {
            step: 'bank-account',
            notifyUser,
            updatedBy: identity?.id,
          });

          onChange(innerValues, undefined, !!selectedAccounts.length);
          onNextStep(innerValues.noAccountSelected);
        } catch (error) {
          notify(error, 'error');
        } finally {
          setLoading(false);
          dispatch(fetchEnd()); // stop the global loading indicator
        }
      }
    },
  });

  const handleAccountSelect = (accountId: string) => () => {
    void formik.setFieldValue('noAccountSelected', false);
    void formik.setFieldValue('accounts', xor(formik.values.accounts, [accountId]));
  };

  const handleNoAccountChange = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    void formik.setFieldValue('noAccountSelected', checked);
    if (checked) {
      void formik.setFieldValue('accounts', []);
    }
  };

  const isAccountSelected = (accountId: string) =>
    indexOf(formik.values.accounts, accountId) !== -1;

  return (
    <form className="flex flex-col" onSubmit={formik.handleSubmit}>
      <div className="flex-grow px-8">
        <Typography variant="h6" className="mb-4">
          Choose transaction accounts
        </Typography>
        <List className="max-w-lg">
          {map(bankAccounts, (account) => (
            <React.Fragment key={account.id}>
              <ListItem>
                <ListItemIcon className="min-w-0">
                  <Checkbox
                    required={
                      !formik.values.noAccountSelected &&
                      !!bankAccounts.length &&
                      !formik.values.accounts?.length
                    }
                    name="accounts"
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    checked={isAccountSelected(account.id)}
                    icon={<CheckboxOutlineIcon />}
                    checkedIcon={<CheckboxIcon />}
                    onChange={handleAccountSelect(account.id)}
                    disabled={account.accountType === 'credit_card'}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={account.accountName}
                  secondary={`[BSB: ${account.accountBsb || '-'} ACC: ${account.accountNumber}]`}
                />
                <Typography variant="subtitle1">
                  {currencyFormat(account.balanceCurrent)}
                </Typography>
              </ListItem>
              {isAccountSelected(account.id) && account.accountType !== 'transaction' && (
                <Typography color="error" className="pl-12">
                  This does not seem like a transaction account.
                  <br />
                  Are you sure you want to continue?
                </Typography>
              )}
            </React.Fragment>
          ))}
          <Divider className="mt-4" />
          <div className="p-4">
            <FormControlLabel
              control={
                <Radio
                  required={bankAccounts && !bankAccounts.length}
                  name="noAccount"
                  checked={formik.values.noAccountSelected}
                  onChange={handleNoAccountChange}
                />
              }
              label="No Transactional account"
            />
          </div>
        </List>
      </div>
      <ActionButtons loading={loading}>
        <div className="space-x-2">
          <Button variant="contained" color="secondary" type="submit" disabled={loading}>
            Continue
          </Button>
          {formik.values.noAccountSelected && (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              onClick={() => setNotifyUser(true)}
            >
              Notify and continue
            </Button>
          )}
        </div>
      </ActionButtons>
    </form>
  );
};

export default BankSelection;
