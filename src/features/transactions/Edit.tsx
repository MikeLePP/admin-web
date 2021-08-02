import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Radio } from '@material-ui/core';
import moment from 'moment';
import { capitalize, lowerCase, get, upperCase } from 'lodash';
import { useFormik } from 'formik';
import {
  DateTimeInput,
  Edit,
  FunctionField,
  maxLength,
  maxValue,
  NumberInput,
  RadioButtonGroupInput,
  required,
  ResourceComponentPropsWithId,
  SimpleForm,
  TextInput,
  useEditController,
  useGetIdentity,
  useNotify,
  ListButton,
  ShowButton,
  TopToolbar,
} from 'react-admin';
import { ArrowBack as BackIcon, Save as SaveIcon } from '@material-ui/icons';
import InputField from '../../components/InputField';

import TextLabel from '../../components/TextLabel';
import SaveToolbar from '../../components/SaveToolbar';
import { notifyOnFailure } from '../../helpers/notify';
import { getFullName } from '../../helpers/string';
import { getId } from '../../helpers/url';
import { futureDate } from '../../helpers/validation';
import { useTransaction } from '../../hooks/transaction-hook';
import { callApi } from '../../helpers/api';

interface TransactionRecord extends Record<string, unknown> {
  amount?: Number;
  amountFee?: Number;
  bankAccountId?: string;
  description?: string;
  destinationId?: string;
  email?: string;
  firstName?: string;
  id: string;
  lastName?: string;
  mobileNumber?: string;
  paymentAccountId?: string;
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

interface CustomEditToolbarProps {
  basePath: string;
  id: string;
}

const CustomEditToolbar = ({ basePath, id }: CustomEditToolbarProps): JSX.Element => {
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
  const { identity } = useGetIdentity();
  const [transactionRecord, setTransactionRecord] = useState({} as TransactionRecord);
  const notify = useNotify();
  const [updating, setUpdating] = useState(false);
  const { record } = useEditController(props);

  if (!transactionId || !props.basePath) {
    props.history?.push(props.basePath!);
    return null;
  }
  const { attributes: transactionData } = useTransaction(transactionId);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: transactionRecord,
    onSubmit: async (_values) => {
      const transactionUpdated = {
        ...transactionData,
        ..._values,
      };
      try {
        await callApi(`/transactions/${transactionId}`, 'put', transactionUpdated);
        props.history?.push(`${props.basePath || ''}/${transactionId}/show`);
      } catch (err) {
        notify('Cannot update this transaction', 'error');
      }
    },
  });

  useEffect(() => {
    if (transactionData) {
      transactionData.submitAt = moment(transactionData.submitAt).format('YYYY-MM-DD');
      setTransactionRecord(transactionData as TransactionRecord);
    }
  }, [transactionData]);

  const handleChangeField =
    (type: string) => async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      await formik.setFieldValue(type, value);
      setUpdating(true);
    };
  const handleCancel = () => {
    props.history?.goBack();
  };

  const disabled = transactionData?.status !== 'pending_submission';

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
            name="amount"
            label="Amount"
            formik={formik}
            variant="standard"
            InputLabelProps={{
              shrink: !!formik.values.amount,
            }}
            onChange={handleChangeField('amount')}
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

  // return (
  //   <Edit
  //     {...props}
  //     title="Edit Transaction"
  //     onFailure={notifyOnFailure(notify)}
  //     transform={transform}
  //     mutationMode="pessimistic"
  //     actions={<EditToolbar />}
  //   >
  //     <SimpleForm redirect="show" toolbar={<SaveToolbar />}>
  //       <FunctionField label="Name" render={getFullName} />
  //       <TextField label="Email" source="email" />
  //       <TextField label="Mobile" source="mobileNumber" />
  //       <Divider />
  //       <FunctionField
  //         label="Status"
  //         render={(r?: Record) => capitalize(lowerCase(r ? r.status : ''))}
  //       />

  //       <RadioButtonGroupInput
  //         label="Payment type"
  //         source="paymentType"
  //         defaultValue="debit"
  //         disabled
  //         choices={[
  //           { id: 'credit', name: 'Credit' },
  //           { id: 'debit', name: 'Debit' },
  //         ]}
  //       />
  //       <NumberInput
  //         type="tel"
  //         label="Amount"
  //         source="amount"
  //         min={0}
  //         max={100}
  //         autoFocus
  //         validate={[required(), maxValue(100)]}
  //         disabled={disabled}
  //       />
  //       <NumberInput
  //         type="number"
  //         label="Fee"
  //         source="amountFee"
  //         min={0}
  //         max={100}
  //         autoFocus
  //         validate={[required(), maxValue(100)]}
  //         disabled={disabled}
  //       />
  //       <TextInput
  //         label="Description"
  //         source="description"
  //         helperText="What happened?"
  //         multiline
  //         rows={4}
  //         validate={[required(), maxLength(500)]}
  //         disabled={disabled}
  //       />
  //       <TextInput label="Debit from" source="source" validate={[required()]} disabled={disabled} />
  //       <TextInput label="Debit from ID" source="sourceId" validate={[required()]} disabled />
  //       <DateTimeInput
  //         label="Submit on"
  //         source="submitAt"
  //         validate={[required(), futureDate()]}
  //         disabled={disabled}
  //       />
  //       <Divider />

  //       <TextInput label="Send to" source="destination" disabled />
  //       <TextInput label="Send to ID" source="destinationId" disabled />
  //     </SimpleForm>
  //   </Edit>
  // );
};

export default TransactionEdit;
