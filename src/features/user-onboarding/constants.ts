export const GOVERNMENT_SUPPORT = [
  { id: true, name: 'Yes' },
  { id: false, name: 'No' },
];
export const RISK_MODELS = ['COMB-A', 'COMB-B', 'COMB-C', 'COMB-D', 'COMB-E'];
export const DECLINE_REASONS = [
  { value: 'NI', label: 'No income' },
  { value: 'I1', label: 'Number consecutive pay cycles assessed' },
  { value: 'I2', label: 'Average income per cycle' },
  {
    value: 'I3',
    label: 'Number income timing variations or balance on expected income day below requirement',
  },
  { value: 'I6', label: 'Government income as % total' },
  { value: 'B1', label: 'Min day 0 balance' },
  { value: 'B3', label: 'Min day 1 ending balance' },
];

export const APPROVED_AMOUNT_DEFAULT_VALUE = 100;
export const APPROVED_AMOUNT = [
  { value: 50, label: 50 },
  { value: 75, label: 75 },
  { value: 100, label: 100 },
  { value: 200, label: 200 },
  { value: 250, label: 250 },
  { value: 300, label: 300 },
  { value: 400, label: 400 },
  { value: 500, label: 500 },
  { value: 600, label: 600 },
  { value: 750, label: 750 },
];
