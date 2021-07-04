import { Box, Button, Container, Grid } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Payment, Tier } from '../../../api/service';
import { CLIENT_ROLE } from '../../../constants';
import AuthContext from '../../../store/auth-context';
import TierCard from './TierCard';

const Tiers = () => {
    const [tiers, setTiers] = useState(null);
    const [showAll, setShowAll] = useState(null);
    const history = useHistory();
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        Tier.getTiers().then((data) => {
            setTiers(data);
        });
    }, []);

    const joinHandler = (id) => {
        if (authCtx.isLoggedIn) {
            Payment.createCheckoutSession(id).then((url) => {
                window.location.href = url;
            });
        } else {
            history.push('/login');
        }
    };

    return (
        tiers &&
        (!authCtx.isLoggedIn || authCtx.hasPermission(CLIENT_ROLE)) && (
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    {tiers.map(
                        (tier, index) =>
                            (showAll || index < 3) && (
                                <Grid item key={tier.id} xs={12} sm={6} md={4}>
                                    <TierCard
                                        {...tier}
                                        joinHandler={joinHandler}
                                    />
                                </Grid>
                            )
                    )}
                </Grid>
                {tiers.length > 3 && !showAll && (
                    <Box mt={2} display="flex" justifyContent="center">
                        <Button
                            size="medium"
                            variant="outlined"
                            color="primary"
                            endIcon={<KeyboardArrowDown />}
                            onClick={() => setShowAll(true)}
                        >
                            See all tiers
                        </Button>
                    </Box>
                )}
            </Container>
        )
    );
};

export default Tiers;
