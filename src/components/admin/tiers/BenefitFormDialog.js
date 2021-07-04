import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Benefit } from '../../../api/service';

const BenefitFormDialog = ({ isOpen, onClose, onAddNew, onEdit, benefit }) => {
    const formik = useFormik({
        initialValues: {
            title: benefit?.title || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string().required('Title is Required'),
        }),
        onSubmit: (values) => {
            if (benefit) {
                Benefit.update(benefit.id, values).then((res) =>
                    onEdit({
                        ...benefit,
                        ...values,
                    })
                );
            } else {
                Benefit.add({ title: values.title }).then((id) =>
                    onAddNew({ id: id, title: values.title })
                );
            }
        },
    });

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{benefit ? 'Edit' : 'Add new '} benefit</DialogTitle>
            <form onSubmit={formik.handleSubmit} noValidate>
                <DialogContent>
                    <TextField
                        error={Boolean(
                            formik.touched.title && formik.errors.title
                        )}
                        fullWidth
                        helperText={formik.touched.title && formik.errors.title}
                        label="Title"
                        margin="normal"
                        name="title"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.title}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button color="primary" variant="contained" type="submit">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BenefitFormDialog;
