import { differenceInYears } from 'date-fns';

export const toLocalDateString = (date: string) =>
  date && new Date(date).toLocaleDateString('en-AU');

export const yearOldString = (date: string) =>
  date && differenceInYears(new Date(), new Date(date));
