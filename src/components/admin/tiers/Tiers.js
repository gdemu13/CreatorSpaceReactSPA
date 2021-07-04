import { Box, Button, Container, Typography, Grid } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { Tier } from '../../../api/service';
import ConfirmDialog from '../../common/ConfirmDialog';
import TierCard from './TierCard';

const Tiers = () => {
    const [tiers, setTiers] = useState(null);
    const [tierToDelete, setTierToDelete] = useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const match = useRouteMatch();
    const history = useHistory();

    useEffect(() => {
        Tier.getTiers().then((data) => {
            setTiers(data);
        });
    }, []);

    const deleteClickHandler = (id) => {
        setTierToDelete(id);
        setIsConfirmDialogOpen(true);
    };

    const editClickHandler = (id) => {
        history.push(`${match.path}/edit/${id}`);
    };

    const closeConfirmDialog = () => {
        setIsConfirmDialogOpen(false);
        setTierToDelete(null);
    };

    const onConfirmDeleteHandler = () => {
        Tier.delete(tierToDelete).then(() => {
            var tiersCopy = [...tiers];
            var index = tiersCopy.findIndex((x) => x.id === tierToDelete);
            if (index !== -1) {
                tiersCopy.splice(index, 1);
                setTiers(tiersCopy);
            }
            closeConfirmDialog();
        });
    };

    return (
        tiers && (
            <Container maxWidth="lg">
                <Helmet>
                    <title>Tiers</title>
                </Helmet>
                <Typography variant="h2">Tiers</Typography>

                <Box mt={2}>
                    <Grid container spacing={3}>
                        {tiers.map((tier) => (
                            <Grid item xs={12} md={4} key={tier.id}>
                                <TierCard
                                    {...tier}
                                    onDelete={deleteClickHandler}
                                    onEdit={editClickHandler}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12} md={4}>
                            <Button
                                color="primary"
                                variant="outlined"
                                size="large"
                                startIcon={<Add />}
                                component={Link}
                                to={`${match.url}/add`}
                            >
                                Add Tier
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <ConfirmDialog
                    isOpen={isConfirmDialogOpen}
                    onClose={closeConfirmDialog}
                    onConfirm={onConfirmDeleteHandler}
                    content="Deleting tier will result in cancelation of all associated subscriptions. Are you sure you want to delete this tier?"
                    confirmButtonText="Delete"
                />
            </Container>
        )
    );
};

export default Tiers;
