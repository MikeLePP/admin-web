import { ResourceComponentPropsWithId, Record } from 'react-admin';
import Card from '@material-ui/core/Card';
import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import ShowToolbar from '../../components/ShowToolbar';
import { useUser, useBankAccount } from './user-hooks';
import TextLabel from '../../components/TextLabel';
import incomeFrequencies from '../../constants/incomeFrequencies';

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
  const { user } = useUser(userId);
  const { bankAccounts } = useBankAccount(userId);
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
  return (
    <>
      <CustomEditToolbar basePath={props.basePath || ''} id={userId} />
      <Card className="p-4">
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
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Bank Name"
          value={user?.bankAccount?.bankName}
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
    </>
  );
};

export default UserShow;
