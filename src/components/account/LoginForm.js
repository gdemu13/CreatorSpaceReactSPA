import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, TextField, FormHelperText } from '@material-ui/core';
import { useContext, useState } from 'react';
import AuthContext from '../../store/auth-context';
import { Account } from '../../api/service';

const LoginForm = () => {
    const [error, setError] = useState('');
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is Required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: (values) => {
            setError('');
            Account.login(values)
                .then((data) => {
                    authCtx.login(data.token, data.expirationTime);
                    history.replace('/');
                })
                .catch((error) => {
                    setError(error.response.data.detail);
                });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} noValidate>
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
            {!!error && <FormHelperText error>{error}</FormHelperText>}
            <Box py={3}>
                <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                >
                    Log In
                </Button>
            </Box>
        </form>
    );
};

export default LoginForm;
