export const TransactionPaymentType = ['credit', 'debit'] as const;

export const TransactionStatus = [
  'pending_submission',
  'submitting',
  'submitted',
  'confirmed',
  'failed',
  'cancelled',
] as const;

export interface ITransactionAttributes {
  amount: number;
  amountFee: number;
  description: string;
  destination: string;
  destinationId: string;
  paymentId?: string;
  paymentType: typeof TransactionPaymentType[number];
  source: string;
  sourceId: string;
  status: typeof TransactionStatus[number];
  statusReason: string;
  submitAt: string;
  userId: string;
}
