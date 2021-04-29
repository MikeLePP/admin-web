import { CheckCircleOutline } from '@material-ui/icons';
import list from './List';
import create from './Create';

export default {
  name: 'risk-assessments',
  options: {
    label: 'Risk Assessments',
  },
  icon: CheckCircleOutline,

  list,
  create,
};
