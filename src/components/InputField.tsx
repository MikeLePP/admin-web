import { TextField } from '@material-ui/core';

export default ({ name, formik, helperText, onChange, ...rest }: any) => (
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
