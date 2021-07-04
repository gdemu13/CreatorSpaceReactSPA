import { Helmet } from 'react-helmet';
import {
    Box,
    Button,
    Container,
    FormHelperText,
    Link,
    TextField,
    Typography,
} from '@material-ui/core';
import { FormContainer } from '../components/common/styles';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { Account } from '../api/service';
import { CheckCircle } from '@material-ui/icons';

const ForgotPasswordPage = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is Required'),
        }),
        onSubmit: (values) => {
            setError('');
            Account.sendPasswordRecoveryEmail(values)
                .then(() => {
                    setShowSuccess(true);
                })
                .catch((error) => {
                    setError(error.response.data.detail);
                });
        },
    });

    return (
        <>
            <Helmet>
                <title>Forgot password</title>
            </Helmet>
            <Box mt={4}>
                <Container maxWidth="sm">
                    <FormContainer>
                        {!showSuccess && (
                            <>
                                <Box mb={1}>
                                    <Typography
                                        color="textPrimary"
                                        variant="h2"
                                    >
                                        Reset your password
                                    </Typography>
                                </Box>
                                <Box mb={3}>
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                    >
                                        Enter the email address associated with
                                        your account and we'll send you a link
                                        to reset your password.
                                    </Typography>
                                </Box>
                                <form onSubmit={formik.handleSubmit} noValidate>
                                    <TextField
                                        error={Boolean(
                                            formik.touched.email &&
                                                formik.errors.email
                                        )}
                                        fullWidth
                                        helperText={
                                            formik.touched.email &&
                                            formik.errors.email
                                        }
                                        label="Email Address"
                                        margin="normal"
                                        name="email"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="email"
                                        value={formik.values.email}
                                        variant="outlined"
                                    />

                                    {!!error && (
                                        <FormHelperText error>
                                            {error}
                                        </FormHelperText>
                                    )}
                                    <Box py={3}>
                                        <Button
                                            color="primary"
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            Continue
                                        </Button>
                                    </Box>
                                </form>
                            </>
                        )}
                        {showSuccess && (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                height="300px"
                            >
                                <CheckCircle
                                    style={{ color: 'green', fontSize: 70 }}
                                />
                                <Typography variant="h3" align="center">
                                    We've sent you a link on your email to reset
                                    your password.
                                </Typography>
                            </Box>
                        )}
                    </FormContainer>
                    {!showSuccess && (
                        <Box mt={2}>
                            <Typography color="textSecondary" variant="body1">
                                Don&apos;t have an account?{' '}
                                <Link
                                    component={RouterLink}
                                    to="/register"
                                    variant="h6"
                                >
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default ForgotPasswordPage;
