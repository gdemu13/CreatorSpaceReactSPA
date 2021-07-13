import { Helmet } from 'react-helmet';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Box, Container, Typography, Link } from '@material-ui/core';
import RegisterForm from '../components/account/RegisterForm';
import { FormContainer } from '../components/common/styles';
import { Account } from '../api/service';
import AuthContext from '../store/auth-context';
import { useContext } from 'react';

const Register = () => {
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    const handleSubmit = (data) => {
        Account.register(data).then(() => {
            Account.login({ email: data.email, password: data.password }).then(
                (resp) => {
                    authCtx.login(resp.token, resp.expirationTime);
                    history.replace('/');
                }
            );
        });
    };

    return (
        <>
            <Helmet>
                <title>Register</title>
            </Helmet>
            <Box mt={4}>
                <Container maxWidth="sm">
                    <FormContainer>
                        <Box sx={{ mb: 3 }}>
                            <Typography color="textPrimary" variant="h2">
                                Create new account
                            </Typography>
                            <Typography
                                color="textSecondary"
                                gutterBottom
                                variant="body2"
                            >
                                Use your email to create new account
                            </Typography>
                        </Box>
                        <RegisterForm
                            submitHandler={handleSubmit}
                            buttonText="sign up now"
                        />
                    </FormContainer>
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
