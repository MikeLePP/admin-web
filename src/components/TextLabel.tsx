import { Grid, Typography } from '@material-ui/core';

export interface TextLabelProps {
  label: string;
  value: React.ReactNode;
  horizontal?: boolean;
}

const TextLabel = ({ label, value, horizontal = false }: TextLabelProps): JSX.Element => (
  <Grid container>
    <Grid item xs={horizontal ? 3 : 12}>
      <Typography className="text-gray-500">{label}</Typography>
    </Grid>
    <Grid item xs={horizontal ? 9 : 12}>
      <Typography>{value}</Typography>
    </Grid>
  </Grid>
);

export default TextLabel;
