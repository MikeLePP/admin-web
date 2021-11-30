import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { Formik, FormikHelpers } from 'formik';
import { get, pickBy } from 'lodash';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { transactionApi } from '../../api/transaction';
import { ITransactionAttributes } from '../../types/transaction';

interface ReportInput {
  creditStartDate: string;
  creditEndDate: string;
  debitStartDate: string;
  debitEndDate: string;
}

interface ReportSummary {
  arrearsPercent: number;
  arrearsValue: number;
  repaymentCount: number;
  repaymentValue: number;
  users: Record<string, number>;
  withdrawCount: number;
  withdrawValue: number;
}

const emptySummary = () => ({
  arrearsPercent: 0,
  arrearsValue: 0,
  repaymentCount: 0,
  repaymentValue: 0,
  users: {},
  withdrawCount: 0,
  withdrawValue: 0,
});

const StaticLossReport: FC = (props) => {
  const [summary, setSummary] = useState<ReportSummary>(emptySummary());

  /**
   * Calculate the withdraws using Zepto payment transaction data
   * @param data The CSV data as an array
   * @param fileInfo The CSV file meta
   */
  const calculateCredits = (
    data: ITransactionAttributes[],
  ): {
    users: Record<string, number>;
    withdrawCount: number;
    withdrawValue: number;
  } => {
    let withdrawCount = 0;
    let withdrawValue = 0;
    const users: Record<string, number> = {};

    for (const record of data) {
      const balance = users[record.userId] || 0;
      users[record.userId] = balance + record.amount;
      withdrawCount += 1;
      withdrawValue += record.amount;
    }

    return { users, withdrawCount, withdrawValue };
  };

  /**
   * Calculate the repayments using Zepto payment request transaction data
   * @param data The CSV data as an array
   * @param fileInfo The CSV file meta
   */
  const calculateDebits = (
    data: ITransactionAttributes[],
    users: Record<string, number>,
    withdrawValue: number,
  ): {
    arrearsPercent: number;
    arrearsValue: number;
    repaymentCount: number;
    repaymentValue: number;
  } => {
    let repaymentCount = 0;
    let repaymentValue = 0;

    for (const record of data) {
      // Discount 5% fee from amount
      const balance = users[record.userId] || 0;
      users[record.userId] = balance - record.amount;
      repaymentCount += 1;
      repaymentValue += record.amount;
    }

    // Arrears is the total of all positive balance (i.e. withdraw but did not pay back)
    const arrearsValue = Object.entries(users).reduce(
      (total, [user, balance]) => (balance > 0 ? total + balance : total),
      0,
    );
    const arrearsPercent = withdrawValue ? (arrearsValue / withdrawValue) * 100 : 0;

    return { arrearsPercent, arrearsValue, repaymentCount, repaymentValue };
  };

  const handleReset = () => {
    setSummary(emptySummary());
  };

  const onSubmit = async (values: ReportInput, formikHelpers: FormikHelpers<ReportInput>): Promise<void> => {
    try {
      const [credits, debits] = await Promise.all([
        transactionApi.getTransactionsByPaymentType(
          'credit',
          'confirmed',
          values.creditStartDate,
          values.creditEndDate,
        ),
        transactionApi.getTransactionsByPaymentType('debit', 'confirmed', values.debitStartDate, values.debitEndDate),
      ]);
      const { users, withdrawCount, withdrawValue } = calculateCredits(credits);
      const { arrearsPercent, arrearsValue, repaymentCount, repaymentValue } = calculateDebits(
        debits,
        users,
        withdrawValue,
      );
      setSummary({ arrearsPercent, arrearsValue, repaymentCount, repaymentValue, users, withdrawCount, withdrawValue });
      console.log({ credits, debits, arrears: pickBy(users, (balance) => balance > 0) });
    } catch (err) {
      toast.error(get(err, 'body.errors[0].title', 'Cannot get transactions'));
    }
  };

  return (
    <Formik
      initialValues={{
        creditStartDate: '',
        creditEndDate: '',
        debitStartDate: '',
        debitEndDate: '',
      }}
      validationSchema={Yup.object().shape({
        creditStartDate: Yup.date().required(),
        creditEndDate: Yup.date().required(),
        debitStartDate: Yup.date().required(),
        debitEndDate: Yup.date().required(),
      })}
      onSubmit={onSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
        <Box {...props}>
          <form onSubmit={handleSubmit}>
            <Card sx={{ mt: 3 }}>
              <CardHeader title="Dates" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography>Credits</Typography>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      type="date"
                      error={Boolean(touched.creditStartDate && errors.creditStartDate)}
                      fullWidth
                      helperText={touched.creditStartDate && errors.creditStartDate}
                      InputLabelProps={{ shrink: true }}
                      label="Credit start date"
                      name="creditStartDate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.creditStartDate}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      type="date"
                      error={Boolean(touched.creditEndDate && errors.creditEndDate)}
                      fullWidth
                      helperText={touched.creditEndDate && errors.creditEndDate}
                      InputLabelProps={{ shrink: true }}
                      label="Credit end date"
                      name="creditEndDate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.creditEndDate}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Debits</Typography>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      type="date"
                      error={Boolean(touched.debitStartDate && errors.debitStartDate)}
                      fullWidth
                      helperText={touched.debitStartDate && errors.debitStartDate}
                      InputLabelProps={{ shrink: true }}
                      label="Debit start date"
                      name="debitStartDate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.debitStartDate}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      type="date"
                      error={Boolean(touched.debitEndDate && errors.debitEndDate)}
                      fullWidth
                      helperText={touched.debitEndDate && errors.debitEndDate}
                      InputLabelProps={{ shrink: true }}
                      label="Debit end date"
                      name="debitEndDate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.debitEndDate}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button color="primary" disabled={isSubmitting} type="submit" variant="contained">
                  Run
                </Button>
                <Button disabled={isSubmitting} onClick={handleReset}>
                  Reset
                </Button>
              </CardActions>
            </Card>
          </form>
          <Card sx={{ mt: 3 }}>
            <CardHeader title="Summary" />
            <Divider />
            <CardContent>
              {isSubmitting ? (
                <Box m={3} display="flex" alignItems="center" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography color="textPrimary" variant="subtitle2">
                          Withdraw count
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="body2" className="flex justify-between items-center">
                          {summary.withdrawCount}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography color="textPrimary" variant="subtitle2">
                          Withdraw Value ($)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="body2" className="flex justify-between items-center">
                          ${summary.withdrawValue.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography color="textPrimary" variant="subtitle2">
                          Repayment count
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="body2" className="flex justify-between items-center">
                          {summary.repaymentCount}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography color="textPrimary" variant="subtitle2">
                          Repayment Value ($)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="body2" className="flex justify-between items-center">
                          ${summary.repaymentValue.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography color="textPrimary" variant="subtitle2">
                          Arrears Value ($)
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="body2" className="flex justify-between items-center">
                          ${summary.arrearsValue.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography color="textPrimary" variant="subtitle2">
                          Arrears Percentage
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="body2" className="flex justify-between items-center">
                          {summary.arrearsPercent.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Formik>
  );
};

export default StaticLossReport;
