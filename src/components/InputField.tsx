import { TextField } from '@material-ui/core';

interface Props {
  name: any;
  formik: any;
  helperText: any;
  onChange: any;
}
export default ({ name, formik, helperText, onChange, ...rest }: Props): JSX.Element => (
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
