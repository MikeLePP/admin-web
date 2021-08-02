import { differenceInYears } from 'date-fns';

export const toLocalDateString = (date: string): string | '' =>
  date && new Date(date).toLocaleDateString('en-AU');

export const yearOldString = (date: string): number | '' =>
  date && differenceInYears(new Date(), new Date(date));

const leftPad =
  (nb = 2) =>
  (value: number) =>
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    ('0'.repeat(nb) + value).slice(-nb);
const leftPad4 = leftPad(4);
const leftPad2 = leftPad(2);

export const convertDateToString = (value: Date): string => {
  if (!(value instanceof Date) || isNaN(value.getDate())) return '';
  console.log(value);
  console.log(value.getHours());
  const yyyy = leftPad4(value.getFullYear());
  const MM = leftPad2(value.getMonth() + 1);
  const dd = leftPad2(value.getDate());
  const hh = leftPad2(value.getHours());
  const mm = leftPad2(value.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};
