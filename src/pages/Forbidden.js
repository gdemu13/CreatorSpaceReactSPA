import { Helmet } from 'react-helmet';
import { Box, Container, Typography } from '@material-ui/core';

const Forbidden = () => (
    <>
        <Helmet>
            <title>403</title>
        </Helmet>
        <Box mt={4}>
            <Container maxWidth="md">
                <Typography align="center" color="textPrimary" variant="h1">
                    403: Forbidden
                </Typography>
                <Typography
                    align="center"
                    color="textPrimary"
                    variant="subtitle2"
                >
                    You don't have permission to access this page
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                    <img
                        alt="Under development"
                        src="/static/403.jpg"
                        style={{
                            marginTop: 50,
                            display: 'inline-block',
                            maxWidth: '100%',
                        }}
                    />
                </Box>
            </Container>
        </Box>
    </>
);

export default Forbidden;
