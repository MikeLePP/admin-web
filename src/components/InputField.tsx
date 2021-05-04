import { TextField, TextFieldProps } from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';

type InputFieldProps = TextFieldProps & {
  name: string;
  formik: {
    values: Record<string, unknown>;
    touched: FormikTouched<Record<string, unknown>>;
    errors: FormikErrors<Record<string, unknown>>;
    handleChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  };
};

export default ({ name, formik, helperText, onChange, ...rest }: InputFieldProps): JSX.Element => (
  <TextField
    variant="outlined"
    color="secondary"
    fullWidth
    {...rest}
    name={name}
    value={formik.values[name]}
    onChange={onChange || formik.handleChange}
    error={formik.touched[name] && Boolean(formik.errors[name])}
    helperText={(formik.touched[name] && formik.errors[name]) || helperText}
  />
);
