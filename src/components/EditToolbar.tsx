import { ListButton, ShowButton, TopToolbar } from 'react-admin';
import { Box } from '@material-ui/core';
import { ArrowBack as BackIcon } from '@material-ui/icons';

export default ({ basePath, data }: any) => {
  let path = basePath;
  if (data && data.userId) {
    path += `?userId=${data.userId}`;
  }
  return (
    <TopToolbar>
      <ListButton basePath={path} record={data} icon={<BackIcon />} />
      <Box display="flex" flexGrow={1} />
      <ShowButton basePath={basePath} record={data} />
    </TopToolbar>
  );
};