import { Button, Card, CardActions, CardContent, CardHeader, CardTypeMap, Divider, TextField } from '@material-ui/core';
import { DefaultComponentProps } from '@material-ui/core/OverridableComponent';
import moment from 'moment';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { User } from '../../types/users';

interface CollectionEmailProps extends DefaultComponentProps<CardTypeMap> {
  user: User;
  onUpdateCollectionEmailPausedUntil: (value: string | null) => void;
}

const CollectionEmail: FC<CollectionEmailProps> = (props) => {
  const { user, onUpdateCollectionEmailPausedUntil, ...other } = props;
  const [collectionEmailPausedUntil, setCollectionEmailPausedUntil] = useState(user.collectionEmailPausedUntil || '');
  const userCollectionEmailPausedUntil = useMemo(
    () => user.collectionEmailPausedUntil && moment(user.collectionEmailPausedUntil).format('YYYY-MM-DD'),
    [user],
  );
  useEffect(() => {
    if (userCollectionEmailPausedUntil) {
      setCollectionEmailPausedUntil(userCollectionEmailPausedUntil);
    }
  }, [userCollectionEmailPausedUntil]);
  const handleChange = (event) => {
    const { value } = event.target;
    setCollectionEmailPausedUntil(value);
  };

  const handleUpdate = () => {
    onUpdateCollectionEmailPausedUntil(collectionEmailPausedUntil);
  };

  const handleClear = () => {
    setCollectionEmailPausedUntil('');
    onUpdateCollectionEmailPausedUntil(null);
  };

  return (
    <Card {...other}>
      <CardHeader title="Collection Email" />
      <Divider />
      <CardContent>
        <TextField
          type="date"
          fullWidth
          label="Pause collection email until"
          name="incomeNextDate"
          onChange={handleChange}
          value={collectionEmailPausedUntil}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={userCollectionEmailPausedUntil === collectionEmailPausedUntil || !collectionEmailPausedUntil}
        >
          Update
        </Button>
        <Button variant="outlined" color="primary" disabled={!user.collectionEmailPausedUntil} onClick={handleClear}>
          Clear
        </Button>
      </CardActions>
    </Card>
  );
};

export default CollectionEmail;
