import { Helmet } from 'react-helmet';
import {
    Box,
    Button,
    Container,
    FormHelperText,
    TextField,
    Typography,
} from '@material-ui/core';
import { FormContainer } from '../components/common/styles';
import useQuery from '../hooks/useQuery';
import { Account } from '../api/service';
import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
import { CheckCircle } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState('');
    const query = useQuery();

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
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
            Account.resetPassword({ ...values, token: query.get('token') })
                .then(() => {
                    setShowSuccessAlert(true);
                })
                .catch((error) => {
                    setError(error.response.data.detail);
                });
        },
    });

    return (
        <>
            <Helmet>
                <title>Reset password</title>
            </Helmet>
            <Box mt={4}>
                <Container maxWidth="sm">
                    <FormContainer>
                        {!showSuccessAlert && (
                            <>
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        color="textPrimary"
                                        variant="h2"
                                    >
                                        Set new password
                                    </Typography>
                                </Box>
                                <form onSubmit={formik.handleSubmit} noValidate>
                                    <TextField
                                        error={Boolean(
                                            formik.touched.password &&
                                                formik.errors.password
                                        )}
                                        fullWidth
                                        helperText={
                                            formik.touched.password &&
                                            formik.errors.password
                                        }
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
                                            Update password
                                        </Button>
                                    </Box>
                                </form>
                            </>
                        )}
                        {showSuccessAlert && (
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
                                    You've successfully changed password. Go to{' '}
                                    <RouterLink to="login">
                                        login page
                                    </RouterLink>
                                </Typography>
                            </Box>
                        )}
                    </FormContainer>
                </Container>
            </Box>
        </>
    );
};

export default ResetPasswordPage;
