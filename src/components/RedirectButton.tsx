import { Button, EditButton, FunctionField } from 'react-admin';
import { useHistory } from 'react-router-dom';

export default (props: any): JSX.Element => {
  const { to, buttonLabel, icon: Icon, ...rest } = props;
  const history = useHistory();
  const handleButtonClick = (path: string) => () => history.push(path);

  if (buttonLabel === 'Edit')
    return (
      <FunctionField
        {...rest}
        render={(v: any) => <EditButton label={buttonLabel} icon={Icon} to={to(v)} />}
      />
    );
  return (
    <FunctionField
      {...rest}
      render={(v: any) => (
        <Button label={buttonLabel} onClick={handleButtonClick(to(v))}>
          {Icon && <Icon />}
        </Button>
      )}
    />
  );
};
