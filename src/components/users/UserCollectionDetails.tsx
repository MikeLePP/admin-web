import { Card, CardHeader, Divider } from '@material-ui/core';
import type { FC } from 'react';
import { User } from '../../types/users';

interface CollectionDetailsProps {
  user: User;
}

const CollectionDetails: FC<CollectionDetailsProps> = (props) => {
  const { user, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Collection details" />
      <Divider />
    </Card>
  );
};

export default CollectionDetails;
