import { HttpError } from 'react-admin';

interface NotifyDocument {
  (props1: string, props2: string, props3: any, props4: boolean, props5: number): void;
}

export const notifyOnFailure = (notify: NotifyDocument) => (error: HttpError): any => {
  const { errors }: { errors: { title: string }[] } = error.body;
  if (errors && errors.length)
    notify(
      `Please check the following ${errors
        .map((e: { title: string }) => `* ${e.title},`)
        .join('')}`,
      'error',
      {},
      false,
      20000, // 20 seconds
    );
};
