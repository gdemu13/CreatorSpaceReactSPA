import { Helmet } from 'react-helmet';
import { Box, Container, Typography } from '@material-ui/core';

const NotFound = () => (
    <>
        <Helmet>
            <title>404</title>
        </Helmet>
        <Box mt={4}>
            <Container maxWidth="md">
                <Typography align="center" color="textPrimary" variant="h1">
                    404: The page you are looking for isn’t here
                </Typography>
                <Typography
                    align="center"
                    color="textPrimary"
                    variant="subtitle2"
                >
                    You either tried some shady route or you came here by
                    mistake. Whichever it is, try using the navigation
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                    <img
                        alt="Under development"
                        src="/static/404.jpg"
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

export default NotFound;
