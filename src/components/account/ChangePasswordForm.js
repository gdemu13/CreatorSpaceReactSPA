import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, FormHelperText, TextField } from '@material-ui/core';
import { Account } from '../../api/service';
import { Alert } from '@material-ui/lab';
import { useState } from 'react';

const ChangePasswordForm = () => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required(
                'Current password is required'
            ),
            password: Yup.string()
                .min(8, 'Password must contain more than 8 characters')
                .matches(
                    '[a-z]',
                    'Password must contain at least 1 lower case character'
                )
                .matches(
                    '[A-Z]',
                    'Password must contain at least 1 upper case character'
                )
                .matches('[0-9]', 'Password must contain at least 1 digit')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
                .required('Confirm password is required'),
        }),
        onSubmit: (values) => {
            Account.changePassword(values)
                .then((res) => {
                    formik.resetForm();
                    setShowSuccessAlert(true);
                })
                .catch((error) => {
                    setError(error.response.data.detail);
                });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} noValidate>
            <TextField
                error={Boolean(
                    formik.touched.currentPassword &&
                        formik.errors.currentPassword
                )}
                fullWidth
                helperText={
                    formik.touched.currentPassword &&
                    formik.errors.currentPassword
                }
                label="Current password"
                margin="normal"
                name="currentPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.currentPassword}
                variant="outlined"
            />
            <TextField
                error={Boolean(
                    formik.touched.password && formik.errors.password
                )}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Password"
                margin="normal"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
                variant="outlined"
            />

            <TextField
                error={Boolean(
                    formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                )}
                fullWidth
                helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                }
                label="Confirm Password"
                margin="normal"
                name="confirmPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.confirmPassword}
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
                >
                    Update password
                </Button>
            </Box>
        </form>
    );
};

export default ChangePasswordForm;
