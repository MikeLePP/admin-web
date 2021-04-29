import { HttpError } from 'react-admin';

export const notifyOnFailure = (notify: any) => (error: HttpError) => {
  const errors = error.body.errors;
  if (errors && errors.length)
    notify(
      `Please check the following ${errors.map((e: { title: string }) => `* ${e.title},`)}`,
      'error',
      {},
      false,
      20000, // 20 seconds
    );
};
