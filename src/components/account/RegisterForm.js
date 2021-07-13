import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import { Account } from '../../api/service';
import { FormContainer } from '../common/styles';

const RegisterForm = ({ submitHandler, buttonText }) => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
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
            submitHandler(values);
        },
    });

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
            <Box py={3}>
                <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                >
                    {buttonText}
                </Button>
            </Box>
        </form>
    );
};

export default RegisterForm;
