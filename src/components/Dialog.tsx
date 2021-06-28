import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

interface DialogProps {
  show: boolean;
  onCancelClick: () => void;
  onConfirmClick: () => void;
  title: string;
  body?: string;
  cancelLabel?: string;
  confirmLabel: string;
}

const Dialog = ({
  show,
  onCancelClick,
  onConfirmClick,
  title,
  body,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
}: DialogProps): JSX.Element => (
  <MuiDialog onClose={onCancelClick} open={show}>
    <DialogTitle>{title}</DialogTitle>
    {body && (
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
    )}
    <DialogActions>
      <Button onClick={onCancelClick} color="primary">
        {cancelLabel}
      </Button>
      <Button onClick={onConfirmClick} color="primary" autoFocus>
        {confirmLabel}
      </Button>
    </DialogActions>
  </MuiDialog>
);

export default Dialog;
