import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
} from '@material-ui/core';
import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Payment, Subscription } from '../../../api/service';
import moment from 'moment';
import SubscriptionHistory from './SubscriptionsHistory';

const StyledPaper = styled(Paper)`
    border-radius: 4px;
    padding: 16px;
`;

const ManageSubscription = () => {
    const [subscriptions, setSubscriptions] = useState(null);

    const activeSubscription = useMemo(() => {
        const sub = subscriptions?.find((x) =>
            moment().isBetween(
                moment(x.currentPeriodStart),
                moment(x.currentPeriodEnd)
            )
        );
        if (sub) {
            const subCopy = { ...sub };
            subCopy.isCanceled = subCopy.dateEnded === subCopy.currentPeriodEnd;

            return subCopy;
        }

        return null;
    }, [subscriptions]);

    useEffect(() => {
        Subscription.getSusbcriptions().then((data) => setSubscriptions(data));
    }, []);

    const handleCancel = () => {
        Subscription.cancel(activeSubscription.id).then(() => {
            const subscriptionsCopy = [...subscriptions];
            const index = subscriptionsCopy.findIndex(
                (x) => (x.id = activeSubscription.id)
            );
            subscriptionsCopy[index].dateEnded =
                subscriptionsCopy[index].currentPeriodEnd;

            setSubscriptions(subscriptionsCopy);
        });
    };

    const handleUpdate = () => {
        Payment.createBillingPortalSession().then((url) => {
            window.location.href = url;
        });
    };

    return (
        subscriptions &&
        subscriptions.length > 0 && (
            <>
                <Container maxWidth="sm">
                    {activeSubscription && (
                        <>
                            <Box mb={2}>
                                <Typography variant="h3">
                                    Active subscription
                                </Typography>
                            </Box>
                            <StyledPaper variant="outlined">
                                <Grid container spacing={2}>
                                    <Grid container item xs={12}>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="h4">
                                                Your Current Tier:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <Typography
                                                variant="h4"
                                                color="textSecondary"
                                            >
                                                {activeSubscription.tierTitle}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container item xs={12}>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="h4">
                                                You currently pay:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <Typography
                                                variant="h4"
                                                color="textSecondary"
                                            >
                                                ${activeSubscription.tierPrice}{' '}
                                                per month
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container item xs={12}>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="h4">
                                                Active since:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <Typography
                                                variant="h4"
                                                color="textSecondary"
                                            >
                                                {moment(
                                                    activeSubscription.dateCreated
                                                ).format('DD/MM/YYYY')}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container item xs={12}>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="h4">
                                                {activeSubscription.isCanceled
                                                    ? 'Will end on'
                                                    : 'Next billing date:'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <Typography
                                                variant="h4"
                                                color="textSecondary"
                                            >
                                                {moment(
                                                    activeSubscription.currentPeriodEnd
                                                ).format('DD/MM/YYYY')}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    mt={2}
                                >
                                    {!activeSubscription.dateEnded && (
                                        <>
                                            <Button
                                                color="secondary"
                                                size="large"
                                                variant="contained"
                                                style={{
                                                    marginRight: '8px',
                                                }}
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                color="primary"
                                                size="large"
                                                variant="outlined"
                                                onClick={handleUpdate}
                                            >
                                                Update
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </StyledPaper>
                        </>
                    )}
                </Container>
                <Container maxWidth="md">
                    <SubscriptionHistory subscriptions={subscriptions} />
                </Container>
            </>
        )
    );
};

export default ManageSubscription;
