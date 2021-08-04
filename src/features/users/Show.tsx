import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import { OpenInNewOutlined as OpenInNewIcon } from '@material-ui/icons';
import UpdateIcon from '@material-ui/icons/Update';
import { get, isNil } from 'lodash';
import moment from 'moment';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { CardActions, Record, ResourceComponentPropsWithId, Title, useNotify } from 'react-admin';
import ConfirmDialog from '../../components/Dialog';
import ShowToolbar from '../../components/ShowToolbar';
import TextLabel from '../../components/TextLabel';
import TransactionDialog from '../../components/TransactionDialog';
import UpdateBalanceLimitDialog from '../../components/UpdateBalanceLimitDialog';
import incomeFrequencies from '../../constants/incomeFrequencies';
import { callApi } from '../../helpers/api';
import { useTransaction } from '../../hooks/transaction-hook';
import { User } from '../../types/user';
import { useBankAccount, useUser } from './user-hooks';

interface CustomEditToolbarProps {
  basePath: string;
  id: string;
  onClickUpdateLimit: () => void;
  user?: User;
}

const CustomEditToolbar = ({
  basePath,
  id,
  onClickUpdateLimit,
  user,
}: CustomEditToolbarProps): JSX.Element => {
  const data = {
    id,
  } as Record;
  const UpdateLimitButton: React.FC = () =>
    user ? (
      <Button
        startIcon={<UpdateIcon />}
        onClick={onClickUpdateLimit}
        className="p-1"
        color="primary"
      >
        UPDATE LIMIT
      </Button>
    ) : (
      <Fragment />
    );
  return <ShowToolbar basePath={basePath} data={data} actions={<UpdateLimitButton />} />;
};

const UserShow = (props: ResourceComponentPropsWithId): JSX.Element => {
  const userId = get(props, 'id', '');
  const [showAllTransactions, setShowAllTransactions] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [showUpdateBalanceLimit, setShowUpdateBalanceLimit] = React.useState(false);
  const notify = useNotify();
  const transactionData = useTransaction(userId);
  const [dataLastAt, setDataLastAt] = useState<string | undefined>();
  const { user, setUser } = useUser(userId);
  const { bankAccounts } = useBankAccount(userId);
  const [loading, setLoading] = useState(false);
  const incomeFrequency = user?.incomeFrequency;
  useEffect(() => {
    setDataLastAt(transactionData.dataLastAt);
  }, [transactionData.dataLastAt]);

  const payFrequency = useMemo(() => {
    const frequency = incomeFrequencies.find(
      (item) => incomeFrequency && item.id === incomeFrequency,
    );
    return frequency?.name;
  }, [incomeFrequency]);
  const primaryBankAccount = useMemo(() => {
    const useBankAccountId = user?.bankAccountId;
    const bankAccount = bankAccounts.find(
      (account) => useBankAccountId && account.bankAccountId === useBankAccountId,
    );
    return {
      bankAccount,
      text: `Name: ${bankAccount?.accountName || 'N/A'} | BSB: ${
        bankAccount?.accountBsb || 'N/A'
      } | ACC: ${bankAccount?.accountNumber || 'N/A'}`,
    };
  }, [bankAccounts, user]);
  const handleRequestBankData = () => {
    setLoading(true);
    async function requestBankData() {
      try {
        await callApi(`/messaging/bank-data`, 'post', {
          userId,
        });
        setLoading(false);
        notify('Request bank data success', 'success');
      } catch (err) {
        setLoading(false);
        notify('Cannot request bank data', 'error');
      }
    }
    void requestBankData();
  };

  const handleShowBankStatement = () => {
    setShowAllTransactions(true);
  };

  const handleCancelRequestBankData = () => {
    setShowConfirmDialog(false);
  };
  const handleConfirmRequestBankData = () => {
    handleRequestBankData();
    setShowConfirmDialog(false);
  };
  const handleClickRequestBankDataButton = () => {
    setShowConfirmDialog(true);
  };

  const handleUpdateLimitBalance = () => {
    setShowUpdateBalanceLimit(true);
  };

  const handleBalanceLimitChanged = (balanceLimit: number | null | undefined) => {
    if (!isNil(balanceLimit)) {
      setUser({ ...user, balanceLimit } as User);
    }
  };

  return (
    <>
      <Title title={`User ${user?.firstName || ''} ${user?.lastName || ''}`} />
      <CustomEditToolbar
        basePath={props.basePath || ''}
        id={userId}
        user={user}
        onClickUpdateLimit={handleUpdateLimitBalance}
      />
      <Card className="p-4">
        <div className="text-lg">User Details</div>
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="First name"
          value={user?.firstName}
        />
        {user?.middleName ? (
          <TextLabel
            containerClass="mt-2 mb-1"
            labelClass="text-xs"
            valueClass="text-sm pt-2 pb-1"
            label="Middle name"
            value={user.middleName}
          />
        ) : null}
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Last name"
          value={user?.lastName}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Email"
          value={user?.email}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Mobile number"
          value={user?.mobileNumber}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Date of birth"
          value={user?.dob ? moment(user.dob).format('YYYY-MM-DD') : undefined}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Identity verified"
          value={user?.identity?.verified ? 'true' : 'false'}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Pay frequency"
          value={payFrequency}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Next pay date"
          value={
            user?.incomeNextDate ? moment(user.incomeNextDate).format('YYYY-MM-DD') : undefined
          }
        />
      </Card>
      <Card className="p-4 my-4">
        <div className="flex justify-between items-center">
          <div className="text-lg">Bank Details</div>
        </div>
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Bank Name"
          value={user?.bankAccount?.bankName || '-'}
        />
        {primaryBankAccount?.bankAccount ? (
          <>
            <TextLabel
              containerClass="mt-2 mb-1"
              labelClass="text-xs"
              valueClass="text-sm pt-2 pb-1"
              label="Primary Bank Account"
              value={primaryBankAccount?.text}
            />
          </>
        ) : null}
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Current balance"
          value={user?.balanceCurrent}
        />
        <CardActions className="justify-start items-center">
          {transactionData.reportUrl && (
            <div className="pr-1.5 py-1.5">
              <Button variant="contained" color="secondary" onClick={handleShowBankStatement}>
                View bank statements
              </Button>
              <IconButton href={transactionData.reportUrl} target="_blank">
                <OpenInNewIcon />
              </IconButton>
            </div>
          )}
          <Button
            variant="text"
            color="primary"
            disabled={loading}
            onClick={handleClickRequestBankDataButton}
          >
            Request bank statements
          </Button>
        </CardActions>
      </Card>
      <TransactionDialog
        openDialog={showAllTransactions}
        setShowAllTransactions={setShowAllTransactions}
        reportUrl={transactionData.reportUrl}
        dataLastAt={dataLastAt}
        setDataLastAt={setDataLastAt}
        userId={userId}
      />
      <ConfirmDialog
        show={showConfirmDialog}
        onCancelClick={handleCancelRequestBankData}
        onConfirmClick={handleConfirmRequestBankData}
        title=""
        body="Would you like to notify the user to resubmit their bank statements?"
        confirmLabel="Yes"
        cancelLabel="No"
      />
      {user && showUpdateBalanceLimit && (
        <UpdateBalanceLimitDialog
          open
          setOpen={(value) => setShowUpdateBalanceLimit(value)}
          userId={userId}
          onBalanceLimitChanged={handleBalanceLimitChanged}
        />
      )}
    </>
  );
};

export default UserShow;
