import { differenceInYears } from 'date-fns';

export const toLocalDateString = (date: string): any =>
  date && new Date(date).toLocaleDateString('en-AU');

export const yearOldString = (date: string): any =>
  date && differenceInYears(new Date(), new Date(date));
