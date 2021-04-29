import NumberFormat from 'react-number-format';

export default (props: Record<string, unknown>): JSX.Element => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      // TODO: figure out how to support this with React Admin
      // prefix="$"
      // thousandSeparator
      decimalSeparator={false}
    />
  );
};
