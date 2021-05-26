export const GOVERNMENT_SUPPORT = [
  { id: true, name: 'Yes' },
  { id: false, name: 'No' },
];
export const RISK_MODELS = ['COMB-A', 'COMB-B', 'COMB-C', 'COMB-D', 'COMB-E'];
export const DECLINE_REASONS = [
  { value: 'NI', label: 'No employer income' },
  { value: 'I1', label: 'Number consecutive pay cycles assessed' },
  { value: 'I2', label: 'Average weekly income minimum' },
  { value: 'I3', label: 'Number income timing variations' },
  { value: 'I4', label: 'Number days income is off by ' },
  { value: 'I5', label: 'Income variance percentage' },
  { value: 'I6', label: 'Government income as % total' },
  { value: 'B1', label: 'Min day 1 ending balance' },
  { value: 'B2', label: 'Number times day 1 income is allowed below minimum' },
];
export const APPROVED_AMOUNT_DEFAULT_VALUE = 100;
export const APPROVED_AMOUNT = [
  {value: 50, label: 50},
  {value: 100, label: 100},
  {value: 200, label: 200},
  {value: 300, label: 300}
];
