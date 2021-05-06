import { ListButton, ShowButton, TopToolbar, Record } from 'react-admin';
import { Box } from '@material-ui/core';
import { ArrowBack as BackIcon } from '@material-ui/icons';

interface EditToolbarProps {
  basePath?: string;
  data?: Record;
}

const EditToolbar = ({ basePath, data }: EditToolbarProps): JSX.Element => {
  let path = basePath;
  if (data && data.userId) {
    path += `?userId=${String(data.userId)}`;
  }
  return (
    <TopToolbar>
      <ListButton basePath={path} record={data} icon={<BackIcon />} />
      <Box display="flex" flexGrow={1} />
      <ShowButton basePath={basePath} record={data} />
    </TopToolbar>
  );
};

export default EditToolbar;
