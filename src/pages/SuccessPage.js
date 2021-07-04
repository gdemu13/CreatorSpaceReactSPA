import {
    Box,
    CircularProgress,
    Container,
    Typography,
} from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { Subscription } from '../api/service';
import { FormContainer } from '../components/common/styles';
import useQuery from '../hooks/useQuery';

const SuccessPage = () => {
    const [success, setSuccess] = useState(false);
    const query = useQuery();
    const history = useHistory();

    const pollForStatus = (sessionId) => {
        Subscription.pollForSubscriptionStatus(sessionId).then((status) => {
            if (status) {
                setSuccess(true);
                setTimeout(() => history.replace('/'), 5000);
            } else {
                setTimeout(() => pollForStatus(sessionId), 1000);
            }
        });
    };

    useEffect(() => {
        const sessionId = query.get('session_id');
        pollForStatus(sessionId);
    }, []);

    return (
        <>
            <Helmet>
                <title>Success</title>
            </Helmet>
            <Container maxWidth="md" style={{ marginTop: '16px' }}>
                <FormContainer>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        height="400px"
                    >
                        {success ? (
                            <CheckCircle
                                style={{ color: 'green', fontSize: 70 }}
                            />
                        ) : (
                            <CircularProgress size={40} />
                        )}
                        <Box mt={2}>
                            <Typography variant="h1">
                                {success
                                    ? 'Your payment was successful'
                                    : 'Please wait while we verify your payment'}
                            </Typography>
                            {success && (
                                <Typography
                                    variant="h5"
                                    color="textSecondary"
                                    align="center"
                                >
                                    You will be redirected to home page in a few
                                    seconds...
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </FormContainer>
            </Container>
        </>
    );
};

export default SuccessPage;
