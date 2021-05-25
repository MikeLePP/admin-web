import { HttpError, NotificationType } from 'react-admin';

export const notifyOnFailure =
  (
    notify: (
      message: string,
      type: NotificationType | undefined,
      messageArgs: unknown,
      undoable?: boolean,
      autoHideDuration?: number | undefined,
    ) => void,
  ) =>
  (error: HttpError): void => {
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
