import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    Typography,
} from '@material-ui/core';
import { Add, Delete, Edit } from '@material-ui/icons';
import { useState } from 'react';
import styled from 'styled-components';
import { Benefit } from '../../../api/service';
import ConfirmDialog from '../../common/ConfirmDialog';

const BenefitCheckboxWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding: 0 8px;
    border-radius: 4px;
    height: 50px;
    background: rgba(0, 77, 255, 0.1);

    label {
        flex-grow: 1;
    }
`;

const BenefitDialog = ({
    benefits,
    isOpen,
    onClose,
    onConfirm,
    onAddNew,
    onEdit,
    onDelete,
}) => {
    const [benefitsToAdd, setBenefitsToAdd] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [benefitToDelete, setBenefitToDelete] = useState(null);

    const handleCheckboxChange = (benefit, checked) => {
        const benefitsToAddCopy = [...benefitsToAdd];

        if (checked) {
            benefitsToAddCopy.push(benefit);
            setBenefitsToAdd(benefitsToAddCopy);
        } else {
            const index = benefitsToAddCopy.findIndex(
                (b) => b.id === benefit.id
            );
            benefitsToAddCopy.splice(index, 1);
            setBenefitsToAdd(benefitsToAddCopy);
        }
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDelete = () => {
        Benefit.delete(benefitToDelete.id).then(() => {
            onDelete(benefitToDelete.id);
            handleDeleteDialogClose();
        });
    };

    const handleClose = () => {
        setBenefitsToAdd([]);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <Typography variant="h4" style={{ flexGrow: 1 }}>
                        Add benefits to tier
                    </Typography>
                    <Button
                        color="primary"
                        variant="outlined"
                        size="medium"
                        startIcon={<Add />}
                        onClick={onAddNew}
                    >
                        Add new
                    </Button>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column">
                    {benefits.map((benefit) => (
                        <BenefitCheckboxWrapper key={benefit.id}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(event) =>
                                            handleCheckboxChange(
                                                benefit,
                                                event.target.checked
                                            )
                                        }
                                        name={
                                            benefit.title +
                                            benefit.id.toString()
                                        }
                                        checked={benefitsToAdd.some(
                                            (b) => b.id === benefit.id
                                        )}
                                        color="primary"
                                    />
                                }
                                label={benefit.title}
                            />

                            <IconButton onClick={() => onEdit(benefit)}>
                                <Edit />
                            </IconButton>

                            <IconButton
                                color="secondary"
                                onClick={() => {
                                    setBenefitToDelete(benefit);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                <Delete />
                            </IconButton>
                        </BenefitCheckboxWrapper>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    onClick={onClose}
                    color="primary"
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => onConfirm(benefitsToAdd)}
                >
                    Add Benefits
                </Button>
            </DialogActions>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                onConfirm={handleDelete}
                content="Are you sure you want to delete this benefit?"
                confirmButtonText="Delete"
            />
        </Dialog>
    );
};

export default BenefitDialog;
