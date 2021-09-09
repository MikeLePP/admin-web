import { Button, Card, CardActions, CardContent, CardHeader, CardTypeMap, Divider, TextField } from '@material-ui/core';
import { DefaultComponentProps } from '@material-ui/core/OverridableComponent';
import moment from 'moment';
import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { User } from '../../types/users';

interface CollectionReminderProps extends DefaultComponentProps<CardTypeMap> {
  user: User;
  onUpdateCollectionReminderPausedUntil: (value: string | null) => void;
}

const CollectionReminder: FC<CollectionReminderProps> = (props) => {
  const { user, onUpdateCollectionReminderPausedUntil, ...other } = props;
  const [collectionReminderPausedUntil, setCollectionReminderPausedUntil] = useState(
    user.collectionReminderPausedUntil || '',
  );
  const userCollectionReminderPausedUntil = useMemo(
    () => user.collectionReminderPausedUntil && moment(user.collectionReminderPausedUntil).format('YYYY-MM-DD'),
    [user],
  );

  useEffect(() => {
    if (userCollectionReminderPausedUntil) {
      setCollectionReminderPausedUntil(userCollectionReminderPausedUntil);
    }
  }, [userCollectionReminderPausedUntil]);

  const handleChange = (event) => {
    const { value } = event.target;
    setCollectionReminderPausedUntil(value);
  };

  const handleUpdate = () => {
    onUpdateCollectionReminderPausedUntil(collectionReminderPausedUntil);
  };

  const handleClear = () => {
    setCollectionReminderPausedUntil('');
    onUpdateCollectionReminderPausedUntil(null);
  };

  return (
    <Card {...other}>
      <CardHeader title="Collection Reminder" />
      <Divider />
      <CardContent>
        <TextField
          type="date"
          fullWidth
          label="Pause collection reminder until"
          name="collectionReminderPausedUntil"
          onChange={handleChange}
          value={collectionReminderPausedUntil}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={
            userCollectionReminderPausedUntil === collectionReminderPausedUntil || !collectionReminderPausedUntil
          }
        >
          Update
        </Button>
        <Button variant="outlined" color="primary" disabled={!user.collectionReminderPausedUntil} onClick={handleClear}>
          Clear
        </Button>
      </CardActions>
    </Card>
  );
};

export default CollectionReminder;
