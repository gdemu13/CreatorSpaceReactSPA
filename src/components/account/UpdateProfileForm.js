import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, TextField, FormHelperText } from '@material-ui/core';
import { useState } from 'react';
import { Alert } from '@material-ui/lab';
import { Account } from '../../api/service';
import { useEffect } from 'react';

const UpdateProfileForm = ({ profileData }) => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState('');
    const [enableSubmitButton, setEnableSubmitButton] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .max(256, 'Must be 256 characters or less')
                .required('First name is required'),
            lastName: Yup.string()
                .max(256, 'Must be 256 characters or less')
                .required('Last name is Required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is Required'),
        }),
        onSubmit: (values) => {
            setError('');

            Account.updateProfile(values)
                .then(() => {
                    formik.resetForm({ values: values });
                    setShowSuccessAlert(true);
                })
                .catch((error) => {
                    setError(error.response.data.detail);
                });
        },
    });

    useEffect(() => {
        if (showSuccessAlert) {
            setShowSuccessAlert(false);
        }

        if (!!error) {
            setError('');
        }

        if (
            formik.values.firstName === formik.initialValues.firstName &&
            formik.values.lastName === formik.initialValues.lastName &&
            formik.values.email === formik.initialValues.email &&
            !enableSubmitButton
        ) {
            setEnableSubmitButton(true);
        } else {
            setEnableSubmitButton(false);
        }
    }, [
        formik.values.firstName,
        formik.values.lastName,
        formik.values.email,
        formik.initialValues,
    ]);

    return (
        <form onSubmit={formik.handleSubmit} noValidate>
            <TextField
                error={Boolean(
                    formik.touched.firstName && formik.errors.firstName
                )}
                fullWidth
                helperText={formik.touched.firstName && formik.errors.firstName}
                label="First name"
                margin="normal"
                name="firstName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.firstName}
                variant="outlined"
            />
            <TextField
                error={Boolean(
                    formik.touched.lastName && formik.errors.lastName
                )}
                fullWidth
                helperText={formik.touched.lastName && formik.errors.lastName}
                label="Last name"
                margin="normal"
                name="lastName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                variant="outlined"
            />
            <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email Address"
                margin="normal"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
                variant="outlined"
            />
            {showSuccessAlert && (
                <Box component={Alert} mt={1}>
                    Changes saved successfully!
                </Box>
            )}
            {!!error && <FormHelperText error>{error}</FormHelperText>}

            <Box py={3}>
                <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={enableSubmitButton}
                >
                    Update profile
                </Button>
            </Box>
        </form>
    );
};

export default UpdateProfileForm;
