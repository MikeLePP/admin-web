import { Button } from '@material-ui/core';

type YesNoButtonsProps = {
  onNoClick: () => void;
  onYesClick: () => void;
  isYes: boolean | undefined;
  noLabel?: string;
  yesLabel?: string;
};

const YesNoButtons = ({
  onNoClick,
  onYesClick,
  isYes,
  noLabel = 'No',
  yesLabel = 'Yes',
}: YesNoButtonsProps): JSX.Element => (
  <div className="flex space-x-2">
    <Button
      variant={isYes === false ? 'contained' : 'outlined'}
      onClick={onNoClick}
      classes={{
        outlined: 'text-red-500 border-red-500',
        contained: 'bg-red-500 text-white',
      }}
    >
      {noLabel}
    </Button>
    <Button
      color="secondary"
      variant={isYes === true ? 'contained' : 'outlined'}
      onClick={onYesClick}
    >
      {yesLabel}
    </Button>
  </div>
);

export default YesNoButtons;
