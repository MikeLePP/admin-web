export interface TransactionsAccount {
  type: string;
  id: string;
  meta: {
    dataUrl: string;
    dataExpiry: number;
  };
  attributes: {
    accountBsb: string;
    accountHolder: string;
    accountHolderType: string;
    accountName: string;
    accountNumber: string;
    accountRef: string;
    accountType: string;
    balanceAvailable: number;
    balanceCurrent: number;
    credentialId: string;
    createdAt: Date;
    dataLastAt: Date;
    dataLastId: string;
    institutionName: string;
    institutionSlug: string;
    referenceId: string;
    status: string;
    userId: string;
    updatedAt: Date;
  };
}

export interface UserIdentity {
  id: string;
  number: string;
  source: string;
  state: string;
  verified?: boolean;
  colour?: 'G' | 'Y' | 'B';
  expiryDate?: string;
  refNumber?: string;
}
