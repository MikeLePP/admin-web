import { SaveButton, Toolbar } from 'react-admin';
import { Button } from '@material-ui/core';
import { SaveOutlined as SaveIcon, Add as CreateIcon } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

export default ({ saveButtonLabel = 'Save', pristine, ...rest }: any): JSX.Element => {
  const history = useHistory();
  let icon;
  switch (saveButtonLabel) {
    case 'Save':
      icon = <SaveIcon />;
      break;
    case 'Create':
      icon = <CreateIcon />;
      break;
  }
  const handleCancelClick = () => {
    history.goBack();
  };
  return (
    <Toolbar {...rest}>
      <SaveButton label={saveButtonLabel} icon={icon} disabled={pristine} className="mr-2" />
      <Button onClick={handleCancelClick}>Cancel</Button>
    </Toolbar>
  );
};
