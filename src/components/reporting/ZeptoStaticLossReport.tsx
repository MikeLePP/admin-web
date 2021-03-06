import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import { FC, useState } from 'react';
import CSVReader, { IFileInfo } from 'react-csv-reader';
import { v4 } from 'uuid';

interface ZeptoTransaction {
  amount: string;
  category: string;
  counter_party: string;
  created_date: string;
  credit_amount: null;
  debit_amount: string;
  description: string;
  funds_account: string;
  maturation_date: string;
  parent_reference: string;
  reference: string;
  status: string;
  their_bank_references: string;
  type: string;
  your_bank_references: string;
}

interface ReportSummary {
  arrearsPercent: number;
  arrearsValue: number;
  repaymentCount: number;
  repaymentValue: number;
  users: Record<string, { balance: number; date: string }>;
  withdrawCount: number;
  withdrawValue: number;
}

const papaParseOptions = {
  header: true,
  dynamicTyping: false,
  skipEmptyLines: true,
  transformHeader: (header) => header.toLowerCase().replace(/\W/g, '_'),
};

const emptySummary = () => ({
  arrearsPercent: 0,
  arrearsValue: 0,
  repaymentCount: 0,
  repaymentValue: 0,
  users: {},
  withdrawCount: 0,
  withdrawValue: 0,
});

const ZeptoStaticLossReport: FC = (props) => {
  const [summary, setSummary] = useState<ReportSummary>(emptySummary());
  const [inputKeys, setInputKeys] = useState<string[]>([v4(), v4()]);

  /**
   * Calculate the withdraws using Zepto payment transaction data
   * @param data The CSV data as an array
   * @param fileInfo The CSV file meta
   */
  const handlePaymentsLoaded = (data: ZeptoTransaction[], fileInfo: IFileInfo) => {
    const { users } = summary;
    let withdrawCount = 0;
    let withdrawValue = 0;

    for (const record of data) {
      const amount = Number.parseFloat(record.amount.replace(/(\s|\(|\))/g, ''));
      const matureDate = moment(record.maturation_date, 'YYYY-MM-DD HH:mm:ss Z');
      const userName = record.counter_party.trim();

      let userData = users[userName];
      if (!userData) {
        userData = { balance: 0, date: matureDate.toISOString() };
        users[userName] = userData;
      }

      userData.balance += amount;
      if (matureDate.isBefore(userData.date)) {
        userData.date = matureDate.toISOString();
      }

      withdrawCount += 1;
      withdrawValue += amount;
    }

    setSummary({ ...summary, users, withdrawCount, withdrawValue });
  };

  /**
   * Calculate the repayments using Zepto payment request transaction data
   * @param data The CSV data as an array
   * @param fileInfo The CSV file meta
   */
  const handlePaymentRequestLoaded = (data: ZeptoTransaction[], fileInfo: IFileInfo) => {
    const { users, withdrawValue } = summary;
    let repaymentCount = 0;
    let repaymentValue = 0;

    for (const record of data) {
      // Discount 5% fee from amount
      const amount = (Number.parseFloat(record.amount.replace(/(\s|\(|\))/g, '')) * 100) / 105;
      const userName = record.counter_party.trim();
      const userData = users[userName];

      if (userData && moment(record.maturation_date, 'YYYY-MM-DD HH:mm:ss Z').isAfter(userData.date)) {
        userData.balance -= amount;
        repaymentCount += 1;
        repaymentValue += amount;
      }
    }

    // Arrears is the total of all positive balance (i.e. withdraw but did not pay back)
    const arrearsValue = Object.entries(users).reduce(
      (total, [userName, userData]) => (userData.balance > 0 ? total + userData.balance : total),
      0,
    );
    const arrearsPercent = withdrawValue ? (arrearsValue / withdrawValue) * 100 : 0;

    setSummary({ ...summary, arrearsPercent, arrearsValue, users, repaymentCount, repaymentValue });
    console.log({ users });
  };

  const handleReset = () => {
    setInputKeys([v4(), v4()]);
    setSummary(emptySummary());
  };

  return (
    <Box {...props}>
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Data" />
        <Divider />
        <CardContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Payment CSV</FormLabel>
            <CSVReader key={inputKeys[0]} onFileLoaded={handlePaymentsLoaded} parserOptions={papaParseOptions} />
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">Payment Request CSV</FormLabel>
            <CSVReader key={inputKeys[1]} onFileLoaded={handlePaymentRequestLoaded} parserOptions={papaParseOptions} />
          </FormControl>
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={handleReset}>
            Reset
          </Button>
        </CardActions>
      </Card>
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Summary" />
        <Divider />
        <CardContent>
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default ZeptoStaticLossReport;
