export const getFullname = (record: any) =>
  record && [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ');
