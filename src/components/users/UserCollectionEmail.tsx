import { Card, CardHeader, Divider } from '@material-ui/core';
import type { FC } from 'react';
import { User } from '../../types/users';

interface CollectionEmailProps {
  user: User;
}

const CollectionEmail: FC<CollectionEmailProps> = (props) => {
  const { user, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Collection email" />
      <Divider />
    </Card>
  );
};

export default CollectionEmail;
