import { Record } from 'react-admin';

export const getFullName = (record?: Record): string =>
  record ? [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ') : '';
