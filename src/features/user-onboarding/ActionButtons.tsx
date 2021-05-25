import { Button } from '@material-ui/core';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Dialog from '../../components/Dialog';

export interface ActionButtonsProps {
  children: React.ReactNode;
  loading: boolean;
  onBackButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ActionButtons = ({
  onBackButtonClick,
  loading,
  children,
}: ActionButtonsProps): JSX.Element => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const handleCloseDialog = () => setShowExitConfirm(false);
  const handleExitClick = () => setShowExitConfirm(true);
  const history = useHistory();
  const handleExit = () => history.push('/users');
  return (
    <>
      <div
        className="flex justify-between px-8 py-6 border-t fixed bg-white z-10"
        style={{ width: 'calc(100% - 36.25rem)', bottom: '1.5rem' }}
      >
        <div>
          {onBackButtonClick ? (
            <Button
              variant="outlined"
              color="inherit"
              disabled={loading}
              onClick={onBackButtonClick}
              tabIndex="-1"
            >
              Back
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              disabled={loading}
              onClick={handleExitClick}
              tabIndex="-1"
            >
              Exit onboarding
            </Button>
          )}
        </div>
        {children}
      </div>
      <Dialog
        confirmLabel="Yes, Exit"
        onCancelClick={handleCloseDialog}
        onConfirmClick={handleExit}
        show={showExitConfirm}
        title="Are you sure you want to exit?"
      />
    </>
  );
};

export default ActionButtons;
