import { Button, EditButton, FunctionField } from 'react-admin';
import { useHistory } from 'react-router-dom';
import { SvgIconProps } from '@material-ui/core';

type RedirectButtonProps = {
  to: (id: string) => string;
  buttonLabel: string;
  icon?: React.ReactElement<SvgIconProps>;
};

const RedirectButton = (props: RedirectButtonProps): JSX.Element => {
  const { to, buttonLabel, icon, ...rest } = props;
  const history = useHistory();
  const handleButtonClick = (path: string) => () => history.push(path);

  if (buttonLabel === 'Edit')
    return (
      <FunctionField
        {...rest}
        render={(v: any) => <EditButton label={buttonLabel} icon={icon} to={to(v)} />}
      />
    );
  return (
    <FunctionField
      {...rest}
      render={(v: any) => (
        <Button label={buttonLabel} onClick={handleButtonClick(to(v))}>
          {icon}
        </Button>
      )}
    />
  );
};

export default RedirectButton;
