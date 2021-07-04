import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    Box,
    Button,
    FormHelperText,
    TextField,
    Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Helmet } from 'react-helmet';
import { Container } from '@material-ui/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { QuillConfig, QuillContainer } from '../../common/QuillConfig';
import { Goal } from '../../../api/service';
import { useHistory, useParams } from 'react-router-dom';
import ConfirmDialog from '../../common/ConfirmDialog';
import { FormContainer } from '../../common/styles';

const GoalForm = () => {
    const history = useHistory();
    const { id } = useParams();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(id ? true : false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const title = (id ? 'Edit' : 'Add') + ' Goal';

    const redirectToGoalsPage = () => {
        history.push('/settings/goals');
    };

    const formik = useFormik({
        initialValues: {
            amount: '',
            description: '',
        },
        validationSchema: Yup.object({
            amount: Yup.number().required('amount is required'),
        }),
        onSubmit: (values) => {
            if (id) {
                Goal.update(id, values).then((_) => {
                    redirectToGoalsPage();
                });
            } else {
                Goal.add(values).then((_) => {
                    redirectToGoalsPage();
                });
            }
        },
    });

    useEffect(() => {
        if (id) {
            Goal.get(id).then((data) => {
                formik.resetForm({ values: data });
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const handleDelete = () => {
        setDeleteDialogOpen(false);
        Goal.delete(id).then((_) => {
            redirectToGoalsPage();
        });
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    return (
        !loading && (
            <Box
                display="flex"
                flexDirection="column"
                height="100%"
                justifyContent="center"
                alignItems="center"
                width="100%"
            >
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <Container maxWidth="md">
                    <FormContainer variant="outlined">
                        <Box mb={3}>
                            <Typography color="textPrimary" variant="h2">
                                {title}
                            </Typography>
                        </Box>
                        <form onSubmit={formik.handleSubmit} noValidate>
                            <TextField
                                error={Boolean(
                                    formik.touched.amount &&
                                        formik.errors.amount
                                )}
                                fullWidth
                                helperText={
                                    formik.touched.amount &&
                                    formik.errors.amount
                                }
                                type="number"
                                label="Amount"
                                margin="normal"
                                name="amount"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.amount || ''}
                                variant="outlined"
                            />

                            <QuillContainer>
                                <ReactQuill
                                    theme="snow"
                                    name="description"
                                    id="description"
                                    modules={QuillConfig}
                                    placeholder="Enter description"
                                    value={formik.values.description || ''}
                                    onChange={(content) =>
                                        formik.handleChange('description')(
                                            content
                                        )
                                    }
                                />
                            </QuillContainer>

                            {showSuccessAlert && (
                                <Box component={Alert} mt={1}>
                                    Changes saved successfully!
                                </Box>
                            )}
                            {!!error && (
                                <FormHelperText error>{error}</FormHelperText>
                            )}

                            <Box py={3} display="flex">
                                {id && (
                                    <Button
                                        color="secondary"
                                        fullWidth
                                        size="large"
                                        type="button"
                                        variant="outlined"
                                        style={{ marginRight: '16px' }}
                                        onClick={() =>
                                            setDeleteDialogOpen(true)
                                        }
                                    >
                                        Delete Goal
                                    </Button>
                                )}

                                <Button
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    Save {id && 'Changes'}
                                </Button>
                            </Box>
                        </form>
                    </FormContainer>
                </Container>

                <ConfirmDialog
                    isOpen={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    onConfirm={handleDelete}
                    content="Are you sure you want to delete this goal?"
                    confirmButtonText="Delete"
                />
            </Box>
        )
    );
};

export default GoalForm;
