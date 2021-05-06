import { FormControl, FormControlLabel, Checkbox, FormHelperText } from '@material-ui/core';
import { useFormState, useField } from 'react-final-form';
import { ChangeEvent } from 'react';

interface CheckboxProps {
  source: string;
  label: string;
  handleChange?:
    | ((
        event: unknown,
      ) => ((event: ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined)
    | undefined;
  required?: boolean;
}

export default ({ source, label, handleChange, required = false }: CheckboxProps): JSX.Element => {
  const { values } = useFormState();
  const {
    input: { onChange },
    meta: { error },
  } = useField(source);

  return (
    <FormControl required={required} error={error}>
      <FormControlLabel
        control={
          <Checkbox
            indeterminate={values[source] === undefined}
            checked={values[source] || false}
            onChange={handleChange ? handleChange(onChange) : onChange}
          />
        }
        label={label}
      />
      {error && <FormHelperText>Required</FormHelperText>}
    </FormControl>
  );
};
