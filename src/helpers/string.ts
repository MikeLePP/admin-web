interface RecordProps {
  firstName: string;
  middleName?: string;
  lastName: string;
}
export const getFullname = (record: RecordProps): string =>
  record && [record.firstName, record.middleName, record.lastName].filter(Boolean).join(' ');
