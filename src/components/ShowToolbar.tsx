import { Box } from '@material-ui/core';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@material-ui/icons';
import { Button, DeleteButton, ListButton, TopToolbar, Record } from 'react-admin';
import { Link } from 'react-router-dom';

type ShowToolbarProps = {
  basePath?: string;
  data?: Record | undefined;
  resource?: string;
};

const ShowToolbar = (props: ShowToolbarProps): JSX.Element | null => {
  if (!props.data) return null;

  const { basePath, data, resource } = props;
  let listBasePath = basePath;
  let editBasePath = `${String(basePath)}/${String(data.id)}`;
  if (data && data.userId) {
    listBasePath += `?userId=${String(data.userId)}`;
    editBasePath += `?userId=${String(data.userId)}`;
  }

  return (
    <TopToolbar>
      <ListButton basePath={listBasePath} record={data} icon={<BackIcon />} />
      <Box display="flex" flexGrow={1} />

      <Button {...props} component={Link} label="Edit" to={editBasePath}>
        <EditIcon />
      </Button>
      <DeleteButton
        basePath={basePath}
        record={data}
        resource={resource}
        mutationMode="pessimistic"
        redirect={`${String(basePath)}/${String(data.id)}/show`}
      />
    </TopToolbar>
  );
};

export default ShowToolbar;
