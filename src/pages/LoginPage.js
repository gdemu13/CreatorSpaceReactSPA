import { Helmet } from 'react-helmet';
import { Box, Container, Link, Typography } from '@material-ui/core';
import LoginForm from '../components/account/LoginForm';
import { FormContainer } from '../components/common/styles';
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <Box mt={4}>
                <Container maxWidth="sm">
                    <FormContainer>
                        <Box sx={{ mb: 3 }}>
                            <Typography color="textPrimary" variant="h2">
                                Sign in
                            </Typography>
                        </Box>
                        <LoginForm />
                        <Box pb={2}>
                            <Link
                                component={RouterLink}
                                to="/forgot_password"
                                variant="h5"
                            >
                                Forgot your password?
                            </Link>
                        </Box>
                    </FormContainer>
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
                </Container>
            </Box>
        </>
    );
};

export default Login;
