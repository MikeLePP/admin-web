import { Person } from '@material-ui/icons';
import list from './List';
import create from './Create';
import edit from './Edit';
import show from './Show';

const users = {
  name: 'users',
  options: {
    label: 'Users',
  },
  icon: Person,

  list,
  create,
  edit,
  show,
};

export default users;
