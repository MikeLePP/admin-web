import { Record } from 'react-admin';

export const getFullName = (record?: Record): string =>
  record ? [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ') : '';

export const currencyFormat = (amount: number, defaultString = ''): string =>
  amount
    ? amount.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
      })
    : defaultString;
