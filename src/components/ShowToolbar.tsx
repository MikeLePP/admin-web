import { Box } from '@material-ui/core';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@material-ui/icons';
import { Button, DeleteButton, ListButton, TopToolbar } from 'react-admin';
import { Link } from 'react-router-dom';

export default (props: any): JSX.Element => {
  if (!props.data) return null;
  const { basePath, data, resource } = props;
  let listBasePath = basePath;
  let editBasePath = `${basePath}/${data.id}`;
  if (data && data.userId) {
    listBasePath += `?userId=${data.userId}`;
    editBasePath += `?userId=${data.userId}`;
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
        redirect={`${basePath}/${data.id}/show`}
      />
    </TopToolbar>
  );
};
