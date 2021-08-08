import { ListAltOutlined } from '@material-ui/icons';
import list from './List';
import create from './Create';
import edit from './Edit';
import show from './Show';

const transactions = {
  name: 'transactions',
  options: {
    label: 'Transactions',
  },
  icon: ListAltOutlined,

  list,
  create,
  edit,
  show,
};

export default transactions;
