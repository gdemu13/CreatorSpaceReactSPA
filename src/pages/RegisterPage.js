import { Helmet } from 'react-helmet';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Link } from '@material-ui/core';
import RegisterForm from '../components/account/RegisterForm';

const Register = () => {
    return (
        <>
            <Helmet>
                <title>Register</title>
            </Helmet>
            <Box mt={4}>
                <Container maxWidth="sm">
                    <RegisterForm />
                    <Box mt={2}>
                        <Typography color="textSecondary" variant="body1">
                            Have an account?{' '}
                            <Link
                                component={RouterLink}
                                to="/login"
                                variant="h6"
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Register;
