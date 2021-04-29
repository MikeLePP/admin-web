import { Grid, Typography } from '@material-ui/core';

export interface TextLabelProps {
  label: string;
  value: string;
  horizontal?: boolean;
}

export default ({ label, value, horizontal = false }: TextLabelProps) => (
  <Grid container>
    <Grid item xs={horizontal ? 3 : 12}>
      <Typography className="text-gray-500">{label}</Typography>
    </Grid>
    <Grid item xs={horizontal ? 9 : 12}>
      <Typography>{value}</Typography>
    </Grid>
  </Grid>
);
