import { Record } from 'react-admin';

export const getFullname = (
  record?: Record | undefined,
  source?: string | undefined,
): string | undefined =>
  record && [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ');
