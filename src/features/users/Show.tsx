import { ResourceComponentPropsWithId, Record } from 'react-admin';
import Card from '@material-ui/core/Card';
import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import ShowToolbar from '../../components/ShowToolbar';
import { useUser, useBankAccount } from './userHook';
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
  const payFrequency = React.useMemo(() => {
    const frequency = incomeFrequencies.find((item) => item.id === user.incomeFrequency);
    return frequency?.name;
  }, [user.incomeFrequency]);
  const primaryBankAccount = React.useMemo(() => {
    const { bankAccountId: useBankAccountId } = user;
    const bankAccount = bankAccounts.find((account) => account.bankAccountId === useBankAccountId);
    return {
      bankAccount,
      text: `${bankAccount?.accountName || ''} | BSB: ${
        bankAccount?.accountBsb || '-'
      } | Account number: ${bankAccount?.accountNumber || '-'}`,
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
          value={user.firstName}
        />
        {user.middleName ? (
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
          value={user.lastName}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Email"
          value={user.email}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Mobile number"
          value={user.mobileNumber}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Date of birth"
          value={moment(user.dob).format('YYYY-MM-DD')}
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
          value={moment(user.incomeNextDate).format('YYYY-MM-DD')}
        />
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Bank Name"
          value={get(user, 'bankAccount.bankName')}
        />
        {primaryBankAccount?.bankAccount ? (
          <>
            <TextLabel
              containerClass="mt-2 mb-1"
              labelClass="text-xs"
              valueClass="text-sm pt-2 pb-1"
              label="Primary Account"
              value={primaryBankAccount?.text}
            />
            {/* <TextLabel
              containerClass="mt-2 mb-1"
              labelClass="text-xs"
              valueClass="text-sm pt-2 pb-1"
              label="Account BSB"
              value={primaryBankAccount?.accountBsb}
            />
            <TextLabel
              containerClass="mt-2 mb-1"
              labelClass="text-xs"
              valueClass="text-sm pt-2 pb-1"
              label="Account number"
              value={primaryBankAccount?.accountNumber}
            /> */}
          </>
        ) : null}
        <TextLabel
          containerClass="mt-2 mb-1"
          labelClass="text-xs"
          valueClass="text-sm pt-2 pb-1"
          label="Current balance"
          value={user.balanceCurrent}
        />
      </Card>
    </>
  );
};

export default UserShow;
