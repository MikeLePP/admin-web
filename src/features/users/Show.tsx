import { ResourceComponentPropsWithId, Record, useNotify } from 'react-admin';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { OpenInNewOutlined as OpenInNewIcon } from '@material-ui/icons';
import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import ShowToolbar from '../../components/ShowToolbar';
import { useUser, useBankAccount } from './user-hooks';
import TextLabel from '../../components/TextLabel';
import incomeFrequencies from '../../constants/incomeFrequencies';
import { callApi } from '../../helpers/api';
import TransactionDialog from '../../components/TransactionDialog';
import ConfirmDialog from '../../components/Dialog';
import { useTransaction } from '../../hooks/transaction-hook';

interface CustomEditToolbarProps {
  basePath: string;
  id: string;
}

const CustomEditToolbar = ({ basePath, id }: CustomEditToolbarProps): JSX.Element => {
  const data = {
    id,
  } as Record;
  return <ShowToolbar basePath={basePath} data={data} />;
};

const UserShow = (props: ResourceComponentPropsWithId): JSX.Element => {
  const userId = get(props, 'id', '');
  const [showAllTransactions, setShowAllTransactions] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const notify = useNotify();
  const { reportUrl } = useTransaction(userId);
  const { user } = useUser(userId);
  const { bankAccounts } = useBankAccount(userId);
  const [loading, setLoading] = React.useState(false);
  const incomeFrequency = user?.incomeFrequency;
  const payFrequency = React.useMemo(() => {
    const frequency = incomeFrequencies.find(
      (item) => incomeFrequency && item.id === incomeFrequency,
    );
    return frequency?.name;
  }, [incomeFrequency]);
  const primaryBankAccount = React.useMemo(() => {
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

  return (
    <>
      <CustomEditToolbar basePath={props.basePath || ''} id={userId} />
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
          <div className="flex justify-end">
            {reportUrl && (
              <div>
                <IconButton href={reportUrl} target="_blank">
                  <OpenInNewIcon />
                </IconButton>
                <Button variant="outlined" color="secondary" onClick={handleShowBankStatement}>
                  View bank statements
                </Button>
              </div>
            )}
            <div className="p-1.5">
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handleClickRequestBankDataButton}
              >
                REQUEST BANK DATA
              </Button>
            </div>
          </div>
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
      </Card>
      <TransactionDialog
        openDialog={showAllTransactions}
        setShowAllTransactions={setShowAllTransactions}
        reportUrl={reportUrl}
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
    </>
  );
};

export default UserShow;
