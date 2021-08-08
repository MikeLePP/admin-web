import ReactNumberFormat from 'react-number-format';

type NumberFormatProps = {
  inputRef: () => void;
  onChange: (values: unknown) => void;
  name: string;
};

const NumberFormat = (props: NumberFormatProps): JSX.Element => {
  const { inputRef, onChange, ...other } = props;

  return (
    <ReactNumberFormat
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
    />
  );
};

export default NumberFormat;
