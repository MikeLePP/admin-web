import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardTypeMap,
  Checkbox,
  Divider,
  Grid,
  Radio,
  Typography,
} from '@material-ui/core';
import { DefaultComponentProps } from '@material-ui/core/OverridableComponent';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { User } from '../../types/users';
import { getUserBankAccounts } from '../../slices/user';
import { useDispatch, useSelector } from '../../store';
import { isEmpty, map, startCase } from 'lodash';
import { TransactionsAccount } from '../../types/transactionsAccount';
import Dialog from '../commons/Dialog';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user';
import classNames from 'classnames';

interface TransactionsAccountProps extends DefaultComponentProps<CardTypeMap> {
  user: User;
}
const accountTypes = {
  transaction: 'transaction',
  savings: 'savings',
  creditCard: 'credit_card',
};

const TransactionAccount: FC<TransactionsAccountProps> = (props) => {
  const { user, ...other } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [chosenAccounts, setChosenAccount] = useState<number[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [radioCheck, setRadioCheck] = useState(false);
  const [errorContent, setErrorContent] = useState('');
  const [showError, setShowError] = useState('none');
  const listBank = useSelector((state) => state.user.transactionAccountList);

  const getAccountDetails = ({ attributes }: TransactionsAccount) => {
    const accountBsb = `BSB: ${attributes.accountBsb || '-'}`;
    const accountName = startCase(attributes.accountName);
    const accountNumber = `ACC: ${attributes.accountNumber || '-'}`;

    return attributes.accountType === accountTypes.creditCard
      ? `[${accountNumber}] ${accountName}`
      : `[${accountBsb} ${accountNumber}] ${accountName}`;
  };

  const handleAddToTransactionsAccountList = (index: number, check: boolean) => {
    if (check) {
      setChosenAccount([...chosenAccounts, index]);
      setRadioCheck(false);
    } else {
      setChosenAccount(chosenAccounts.filter((accountNumber) => accountNumber !== index));
    }
  };

  const handleContinue = async () => {
    if (isEmpty(listBank)) {
      return;
    }
    const chosenTransactionsAccountList: TransactionsAccount[] = listBank.filter((item, index) =>
      chosenAccounts.includes(index),
    );

    const res = await userApi.createSelectedBankAccountsAndOnboardUser(
      chosenTransactionsAccountList,
      user.id,
      user.identity,
    );
    if (!res.success) {
      setErrorContent(res.errorMessage);
    } else {
      setShowError('none');
    }
  };

  const getUserBankAccountsCallBack = useCallback(() => {
    dispatch(getUserBankAccounts(user.id));
  }, [user.id, dispatch]);
  useEffect(() => {
    getUserBankAccountsCallBack();
  }, [getUserBankAccountsCallBack]);
  useEffect(() => {
    if (errorContent) {
      setShowError('block');
    } else {
      setShowError('none');
    }
  }, [errorContent]);
  function handleUncheck() {
    setRadioCheck(true);
    setChosenAccount([]);
  }

  return (
    <React.Fragment>
      <Box className={classNames('items-start', 'gap-4', 'grid', 'grid-cols-1', 'lg:grid-cols-1')}>
        <Box className={classNames('gap-4', 'flex', 'flex-col')}>
          <Dialog
            show={showExitDialog}
            onCancelClick={() => {
              setShowExitDialog(false);
            }}
            onConfirmClick={() => {
              navigate('/management/users/');
            }}
            title="Are you sure you want to exit?"
            confirmLabel="YES, EXIT"
          ></Dialog>
          <Card {...other}>
            <CardHeader title="Choose transaction accounts" />
            <Divider />
            <CardContent>
              <Grid container spacing={1}>
                {listBank && listBank.length !== 0 ? (
                  map(listBank, (bank, index) => (
                    <React.Fragment>
                      <Grid item xs={9}>
                        <Box className="flex">
                          <Box className="flex" alignItems="center">
                            <Checkbox
                              onChange={(e) => {
                                handleAddToTransactionsAccountList(index, e.target.checked);
                              }}
                              checked={chosenAccounts.includes(index)}
                            />
                          </Box>
                          <Box>
                            <Typography color="textPrimary" variant="subtitle2">
                              {startCase(bank.attributes.accountType)}
                            </Typography>
                            <Typography color="textPrimary" variant="subtitle2">
                              {getAccountDetails(bank)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={3} className="flex" alignItems="center">
                        <Typography color="textPrimary" variant="subtitle2">
                          {`$ ${bank.attributes.balanceCurrent}`}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  ))
                ) : (
                  <Typography color="textPrimary" variant="subtitle2">
                    ...loading
                  </Typography>
                )}
                <Box width="100%" height="20px"></Box>
                <Typography color="red" variant="subtitle2" fontWeight="bold" display={showError}>
                  {errorContent}
                </Typography>
                <Box width="100%" height="1px" style={{ backgroundColor: 'gray', opacity: '10%' }}></Box>
                <Box width="100%" height="20px"></Box>
                <Box className="flex" alignItems="center">
                  <Radio onClick={handleUncheck} checked={radioCheck} />
                  <Typography color="textPrimary" variant="subtitle2">
                    No Transactional account
                  </Typography>
                </Box>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowExitDialog(true);
                }}
              >
                Exit onboarding
              </Button>
              <Button variant="contained" onClick={handleContinue}>
                Continue
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default TransactionAccount;
