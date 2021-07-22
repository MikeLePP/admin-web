import { Box } from '@material-ui/core';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@material-ui/icons';
import { Button, DeleteButton, ListButton, TopToolbar, Record } from 'react-admin';
import { Link } from 'react-router-dom';

type ShowToolbarProps = {
  basePath?: string;
  data?: Record | undefined;
  resource?: string;
  deleteCustomLabel?: string;
  deleteButtonRedirectToPage?: 'show' | 'list' | undefined;
};

const ShowToolbar = (props: ShowToolbarProps): JSX.Element | null => {
  if (!props.data) return null;

  const {
    basePath,
    data,
    resource,
    deleteCustomLabel = 'Delete',
    deleteButtonRedirectToPage = 'show',
  } = props;
  let listBasePath = basePath;
  let editBasePath = `${String(basePath)}/${String(data.id)}`;
  if (data && data.userId) {
    listBasePath += `?userId=${String(data.userId)}`;
    editBasePath += `?userId=${String(data.userId)}`;
  }

  const getDeleteButtonRedirectUrl = () => {
    if (deleteButtonRedirectToPage === 'show') {
      return `${String(basePath)}/${String(data.id)}/show`;
    }
    return `${String(basePath)}`;
  };

  return (
    <TopToolbar>
      <ListButton basePath={listBasePath} record={data} icon={<BackIcon />} />
      <Box display="flex" flexGrow={1} />

      <Button {...props} component={Link} label="Edit" to={editBasePath}>
        <EditIcon />
      </Button>
      <DeleteButton
        label={deleteCustomLabel}
        basePath={basePath}
        record={data}
        resource={resource}
        mutationMode="pessimistic"
        redirect={getDeleteButtonRedirectUrl()}
      />
    </TopToolbar>
  );
};

export default ShowToolbar;
