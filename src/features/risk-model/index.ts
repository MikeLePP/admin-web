import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import list from './List';
import edit from './Edit';
import show from './Show';
import create from './Create';

const riskModel = {
  name: 'risk-models',
  options: {
    label: 'Risk models',
  },
  icon: VerifiedUserIcon,
  list,
  edit,
  show,
  create,
};

export default riskModel;
