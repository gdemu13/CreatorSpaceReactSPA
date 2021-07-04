import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    content,
    confirmButtonText,
}) => (
    <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="confirm-dialog-title"
    >
        <DialogTitle id="confirm-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
            <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={onClose} color="primary">
                Cancel
            </Button>
            <Button color="secondary" variant="contained" onClick={onConfirm}>
                {confirmButtonText}
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;
