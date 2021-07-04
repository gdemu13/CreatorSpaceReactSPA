import { Box } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import Tiers from '../components/client/tiers/Tiers';
import ManageSubscription from '../components/client/subscriptions/ManageSubscription';

const SubscriptionPage = () => {
    return (
        <>
            <Helmet>
                <title>Manage subscription</title>
            </Helmet>
            <Box mt={4}>
                <Tiers />
                <ManageSubscription />
            </Box>
        </>
    );
};

export default SubscriptionPage;
