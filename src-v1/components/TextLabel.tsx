import { Grid, Typography } from '@material-ui/core';

export interface TextLabelProps {
  label: string;
  value: React.ReactNode;
  horizontal?: boolean;
  labelClass?: string;
  valueClass?: string;
  containerClass?: string;
}

const TextLabel = ({
  label,
  value,
  horizontal = false,
  labelClass = '',
  valueClass = '',
  containerClass = '',
}: TextLabelProps): JSX.Element => (
  <Grid container className={containerClass}>
    <Grid item xs={horizontal ? 3 : 12}>
      <Typography className={`text-gray-500 ${labelClass}`}>{label}</Typography>
    </Grid>
    <Grid item xs={horizontal ? 9 : 12}>
      <Typography className={valueClass}>{value}</Typography>
    </Grid>
  </Grid>
);

export default TextLabel;
