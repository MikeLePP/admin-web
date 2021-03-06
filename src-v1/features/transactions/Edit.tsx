import { Box, Button, FormControl, InputLabel, NativeSelect, Radio } from '@material-ui/core';
import { ArrowBack as BackIcon, Save as SaveIcon } from '@material-ui/icons';
import { useFormik } from 'formik';
import moment from 'moment';
import { get, lowerCase, omitBy, identity, merge } from 'lodash';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  ListButton,
  ResourceComponentPropsWithId,
  ShowButton,
  TopToolbar,
  useNotify,
} from 'react-admin';
import * as yup from 'yup';
import InputField from '../../components/InputField';
import TextLabel from '../../components/TextLabel';
import { callApi } from '../../helpers/api';
import { getFullName } from '../../helpers/string';
import { getId } from '../../helpers/url';
import { useTransaction } from '../../hooks/transaction-hook';
import { useBankAccount } from '../users/user-hooks';

interface TransactionRecord {
  amount?: number;
  amountFee?: number;
  bankAccountId?: string;
  description?: string;
  destinationId?: string;
  email?: string;
  id: string;
  lastName?: string;
  mobileNumber?: string;
  paymentType?: string;
  riskAssessmentId?: string;
  source?: string;
  sourceId?: string;
  status?: string;
  statusReason?: string;
  submitAt?: string;
  userId?: string;
  updatedBy?: string;
}

const validationSchema = yup.object({
  paymentType: yup.string().required(),
  amount: yup.number().required(),
  amountFee: yup.number().required(),
  description: yup.string().required(),
  source: yup.string().required(),
  submitAt: yup.date().min(new Date(), 'Please select a future date').required(),
  destination: yup.string().required(),
  destinationId: yup.string().required(),
});

const CustomEditToolbar = ({ basePath, id }: { basePath: string; id: string }): JSX.Element => {
  const showPath = `${basePath}/${id}/show`;
  return (
    <TopToolbar>
      <ListButton icon={<BackIcon />} />
      <Box display="flex" flexGrow={1} />
      <ShowButton basePath={basePath} to={showPath} />
    </TopToolbar>
  );
};

const TransactionEdit = (props: ResourceComponentPropsWithId): JSX.Element | null => {
  const transactionId = get(props, 'id', '');
  const userId = getId(props.location?.search);
  const [transactionRecord, setTransactionRecord] = useState({} as TransactionRecord);
  const notify = useNotify();
  const { bankAccounts } = useBankAccount(userId);
  const [updating, setUpdating] = useState(false);
  const { attributes: transactionData } = useTransaction(transactionId);
  const bankAccountOptions = useMemo(
    () =>
      bankAccounts?.map((account) => ({
        id: account.bankAccountId,
        name: `${account.accountName}`,
        value: account.paymentAccountId,
      })),
    [bankAccounts],
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...transactionRecord,
      submitAt: moment.utc(transactionRecord.submitAt).format('YYYY-MM-DDThh:mm'),
    },
    validationSchema,
    onSubmit: async (_values) => {
      const transactionUpdated = merge(transactionData as Partial<TransactionRecord>, _values, {
        sourceId: _values.paymentType === 'debit' ? _values.sourceId : transactionData?.sourceId,
      } as Partial<TransactionRecord>);
      try {
        await callApi(`/transactions/${transactionId}`, 'put', transactionUpdated);
        props.history?.push(`${props.basePath || ''}/${transactionId}/show`);
      } catch (err) {
        const errTitle = get(err, 'body.errors[0].title', 'Cannot update this transaction');
        notify(errTitle, 'error');
      }
    },
  });

  useEffect(() => {
    if (transactionData) {
      setTransactionRecord(transactionData as TransactionRecord);
    }
  }, [transactionData]);

  const handleChangeField =
    (type: string) =>
    async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value } = e.target;
      await formik.setFieldValue(type, value);
      setUpdating(true);
    };
  const handleCancel = () => {
    props.history?.goBack();
  };

  const disabled = transactionData?.status !== 'pending_submission';
  if (!transactionId || !props.basePath) {
    props.history?.push(props.basePath!);
    return null;
  }
  return (
    <div>
      <CustomEditToolbar basePath={props.basePath} id={transactionId} />
      <form className="border border-gray-100 bg-white" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col bg-white p-4">
          <TextLabel
            containerClass="w-64 my-2.5"
            label={'Name'}
            value={getFullName(formik.values)}
          />
          <TextLabel containerClass="w-64 my-2.5" label={'Email'} value={formik.values.email} />
          <TextLabel
            containerClass="w-64 my-2.5"
            label={'Mobile'}
            value={formik.values.mobileNumber}
          />
          <TextLabel
            containerClass="w-64 my-2.5"
            label={'Status'}
            value={lowerCase(formik.values.status)}
          />
          <TextLabel
            containerClass="w-64 my-2.5"
            label={'Payment type'}
            value={
              <div>
                {['debit', 'credit'].map((paymentType) => (
                  <span>
                    <Radio
                      disabled
                      disableRipple
                      name="paymentType"
                      value={formik.values.paymentType}
                      checked={formik.values.paymentType === paymentType}
                    />
                    {paymentType}
                  </span>
                ))}
              </div>
            }
          />
          <InputField
            className="w-64 my-2.5"
            required
            disabled={disabled}
            name="amount"
            label="Amount"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.amount,
            }}
            onChange={handleChangeField('amount')}
          />
          <InputField
            className="w-64 my-2.5"
            required
            name="amountFee"
            label="Fee"
            disabled={disabled}
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.amountFee,
            }}
            onChange={handleChangeField('amountFee')}
          />
          <InputField
            className="w-64 my-2.5"
            required
            name="description"
            label="Description"
            disabled={disabled}
            formik={formik}
            multiline
            rows={4}
            variant="standard"
            helperText="What happened?"
            InputLabelProps={{
              shrink: !!formik.values.description,
            }}
            onChange={handleChangeField('description')}
          />
          <InputField
            className="w-64 my-2.5"
            required
            variant="standard"
            label="Debit from"
            name="source"
            formik={formik}
            disabled={disabled}
            InputLabelProps={{
              shrink: !!formik.values.source,
            }}
            onChange={handleChangeField('source')}
          />
          {formik.values.paymentType == 'debit' ? (
            <FormControl fullWidth={false} className="w-64 my-2.5">
              <InputLabel htmlFor="uncontrolled-native" shrink={!!formik.values.sourceId}>
                Debit from
              </InputLabel>
              <NativeSelect
                value={formik.values.sourceId}
                inputProps={{
                  name: 'name',
                  id: 'uncontrolled-native',
                }}
                onChange={handleChangeField('sourceId')}
              >
                {bankAccountOptions.map(({ id, name, value }) => (
                  <option key={id} value={value}>
                    {name}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          ) : (
            <InputField
              className="w-64 my-2.5"
              required
              variant="standard"
              label="Debit from"
              name="sourceId"
              formik={formik}
              disabled
              InputLabelProps={{
                shrink: !!formik.values.sourceId,
              }}
            />
          )}

          <InputField
            className="w-64 my-2.5"
            required
            type="datetime-local"
            name="submitAt"
            label="Submit on"
            disabled={disabled}
            formik={formik}
            variant="standard"
            onChange={handleChangeField('submitAt')}
            InputLabelProps={{
              shrink: !!formik.values.submitAt,
            }}
          />
          <InputField
            className="w-64 my-2.5"
            required
            disabled
            name="destination"
            label="Send to"
            formik={formik}
            variant="standard"
            onChange={handleChangeField('destination')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <InputField
            className="w-64 my-2.5"
            required
            disabled
            name="destinationId"
            label="Send to Id"
            formik={formik}
            variant="standard"
            onChange={handleChangeField('destinationId')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <Box className="p-4 bg-gray-100 flex relative items-center	">
          <Button
            color="primary"
            variant="contained"
            type="submit"
            startIcon={<SaveIcon />}
            disabled={!updating}
          >
            Save
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Box>
      </form>
    </div>
  );
};

export default TransactionEdit;
