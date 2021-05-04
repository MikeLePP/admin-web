import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

export const pastDate = (message = 'Please select an earlier date') => (
  date: string,
): string | null =>
  !date || differenceInCalendarDays(new Date(date), new Date()) <= 0 ? null : message;

export const futureDate = (message = 'Please select a future date') => (
  date: string,
): string | null =>
  !date || differenceInCalendarDays(new Date(date), new Date()) >= 0 ? null : message;

export const phone = (message = 'Please enter a valid phone number') => (
  phoneInput: string,
): string | null => (/^\+61[0-9]{9}$/.test(phoneInput.trim()) ? null : message);
