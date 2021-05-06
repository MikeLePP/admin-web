import { SvgIconProps } from '@material-ui/core';
import { Button, EditButton, FunctionField, Record } from 'react-admin';
import { useHistory } from 'react-router-dom';

type RedirectButtonProps = {
  to: (record?: Record) => string;
  buttonLabel: string;
  icon?: React.ReactElement<SvgIconProps>;
};

const RedirectButton = (props: RedirectButtonProps): JSX.Element => {
  const { to, buttonLabel, icon, ...rest } = props;
  const history = useHistory();
  const handleButtonClick = (path: string) => () => history.push(path);
  const handleRedirectWrapper = (record?: Record) => to(record || { id: '' });

  if (buttonLabel === 'Edit')
    return (
      <FunctionField
        {...rest}
        render={(record?: Record) => (
          <EditButton label={buttonLabel} icon={icon} to={handleRedirectWrapper(record)} />
        )}
      />
    );
  return (
    <FunctionField
      {...rest}
      render={(record?: Record) => (
        <Button label={buttonLabel} onClick={handleButtonClick(handleRedirectWrapper(record))}>
          {icon}
        </Button>
      )}
    />
  );
};

export default RedirectButton;
