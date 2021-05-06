import { SvgIconProps } from '@material-ui/core';
import { Button, EditButton, FunctionField } from 'react-admin';
import { useHistory } from 'react-router-dom';

type ToTypesProps = {
  id: string;
};

type RedirectButtonProps = {
  to: (v: ToTypesProps) => string;
  buttonLabel: string;
  icon?: React.ReactElement<SvgIconProps>;
};

type TFunctionField = {
  id: string;
};

const RedirectButton = (props: RedirectButtonProps): JSX.Element => {
  const { to, buttonLabel, icon, ...rest } = props;
  const history = useHistory();
  const handleButtonClick = (path: string) => () => history.push(path);
  const handleRedirectWrapper = (v: ToTypesProps | undefined) => to(v || { id: '' });

  if (buttonLabel === 'Edit')
    return (
      <FunctionField<TFunctionField>
        {...rest}
        render={(v: TFunctionField | undefined) => (
          <EditButton label={buttonLabel} icon={icon} to={handleRedirectWrapper(v)} />
        )}
      />
    );
  return (
    <FunctionField<TFunctionField>
      {...rest}
      render={(v: TFunctionField | undefined) => (
        <Button label={buttonLabel} onClick={handleButtonClick(handleRedirectWrapper(v))}>
          {icon}
        </Button>
      )}
    />
  );
};

export default RedirectButton;
