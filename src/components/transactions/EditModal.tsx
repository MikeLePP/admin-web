import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import { Formik } from 'formik';
import moment from 'moment';
import { useMemo } from 'react';
import * as yup from 'yup';
import { formatBankAccount } from '../../helpers/bankAccount';
import { useBankAccount } from '../../hooks/useBankAccount';
import { ITransactionAttributes } from '../../types/transaction';

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  transaction: ITransactionAttributes;
  userId: string;
  onUpdateTransaction: (params: ITransactionAttributes, callback: (status: boolean) => void) => void;
}

export default function EditTransaction({
  open,
  setOpen,
  transaction,
  userId,
  onUpdateTransaction,
  ...other
}: IProps): JSX.Element {
  const { bankAccounts } = useBankAccount(userId);
  const handleClose = () => {
    setOpen(false);
  };

  const bankAccountOptions = useMemo(
    () =>
      bankAccounts?.map((account) => ({
        id: account.id,
        name: formatBankAccount(account),
        value: account.paymentAccountId,
      })),
    [bankAccounts],
  );

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
      <DialogTitle id="form-dialog-title">Edit transaction</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            paymentType: transaction.paymentType,
            amount: transaction.amount,
            amountFee: transaction.amountFee,
            description: transaction.description,
            source: transaction.source,
            sourceId: transaction.sourceId,
            destination: transaction.destination,
            submitAt: transaction.submitAt ? moment(transaction.submitAt).format('YYYY-MM-DDTHH:mm') : undefined,
            destinationId: transaction.destinationId,
          }}
          validationSchema={yup.object({
            paymentType: yup.string().required(),
            amount: yup.number().min(0).max(1000).required(),
            amountFee: yup.number().min(0).max(50).required(),
            description: yup.string().required(),
            source: yup.string().required(),
            sourceId: yup.string().required(),
            submitAt: yup.date().min(new Date(), 'Please select a future date').required(),
            destination: yup.string().required(),
            destinationId: yup.string().required(),
          })}
          onSubmit={(values, { setSubmitting }): void => {
            const payload = {
              ...transaction,
              ...values,
              sourceId: values.paymentType === 'debit' ? values.sourceId : transaction?.sourceId,
              submitAt: moment(values.submitAt).startOf('minute').toISOString(),
            } as ITransactionAttributes;
            setSubmitting(true);
            onUpdateTransaction(payload, (success) => {
              setSubmitting(false);
              if (success) {
                handleClose();
              }
            });
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
            <form onSubmit={handleSubmit} {...other}>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(touched.amount && errors.amount)}
                      fullWidth
                      label="Amount"
                      name="amount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.amount}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      error={Boolean(errors.amountFee && touched.amountFee)}
                      label="Fee"
                      name="amountFee"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.amountFee}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(errors.description)}
                      fullWidth
                      label="Description"
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.description}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(errors.source)}
                      fullWidth
                      label="Debit from "
                      name="source"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.source}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    {values.paymentType === 'debit' ? (
                      <TextField
                        error={Boolean(errors.source)}
                        fullWidth
                        label="Debit from "
                        name="sourceId"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        select
                        value={values.sourceId}
                        variant="outlined"
                      >
                        {bankAccountOptions.map(({ id, name, value }) => (
                          <option key={id} value={value}>
                            {name}
                          </option>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        className="w-64 my-2.5"
                        required
                        variant="standard"
                        label="Debit from"
                        name="sourceId"
                        disabled
                        InputLabelProps={{
                          shrink: !!values.sourceId,
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(errors.submitAt)}
                      fullWidth
                      label="Submit on"
                      name="submitAt"
                      type="datetime-local"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.submitAt}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(errors.destination)}
                      fullWidth
                      label="Send to"
                      name="destination"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.destination}
                      variant="outlined"
                      disabled
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(errors.destinationId)}
                      fullWidth
                      label="Send to id"
                      name="destinationId"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.destinationId}
                      variant="outlined"
                      disabled
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button color="primary" disabled={isSubmitting} type="submit" variant="contained">
                    Update
                  </Button>
                  <Button color="primary" disabled={isSubmitting} onClick={handleClose} variant="text">
                    Cancel
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
