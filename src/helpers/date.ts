import { differenceInYears } from 'date-fns';

export const toLocalDateString = (date: string): string | '' =>
  date && new Date(date).toLocaleDateString('en-AU');

export const yearOldString = (date: string): number | '' =>
  date && differenceInYears(new Date(), new Date(date));
