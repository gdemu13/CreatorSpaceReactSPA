import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Typography,
    Grid,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { Goal } from '../../../api/service';
import ConfirmDialog from '../../common/ConfirmDialog';
import GoalCard from './GoalCard';

const Goals = () => {
    const [isEarningBased, setIsEarningBased] = useState(true);
    const [goals, setGoals] = useState(null);
    const [amount, setAmount] = useState(null);
    const [monthlyIncomeAmount, setMonthlyIncomeAmount] = useState(null);
    const [numberOfActiveSubs, setnumberOfActiveSubs] = useState(null);

    const [goalToDelete, setGoalToDelete] = useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const match = useRouteMatch();
    const history = useHistory();

    const updateGoals = () => {
        Goal.getGoals().then((data) => {
            setIsEarningBased(data.isGoalEarningBased);
            setGoals(data.goals);
            setMonthlyIncomeAmount(data.monthlyIncomeAmount);
            setnumberOfActiveSubs(data.numberOfActiveSubs);
            setAmount(
                data.isGoalEarningBased
                    ? data.monthlyIncomeAmount
                    : data.numberOfActiveSubs
            );
        });
    };

    useEffect(() => {
        updateGoals();
    }, []);

    const handleGoalsTypeChange = (event) => {
        let currVal = event.target.value === 'true';
        Goal.updateGoalsConfig({
            isGoalEarningBased: currVal,
        }).then(() => {
            setIsEarningBased(currVal);
            setAmount(currVal ? monthlyIncomeAmount : numberOfActiveSubs);
        });
    };

    const deleteClickHandler = (id) => {
        setGoalToDelete(id);
        setIsConfirmDialogOpen(true);
    };

    const editClickHandler = (id) => {
        history.push(`${match.path}/edit/${id}`);
    };

    const closeConfirmDialog = () => {
        setIsConfirmDialogOpen(false);
        setGoalToDelete(null);
    };

    const onConfirmDeleteHandler = () => {
        Goal.delete(goalToDelete).then(() => {
            var goalsCopy = [...goals];
            var index = goalsCopy.findIndex((x) => x.id === goalToDelete);
            if (index !== -1) {
                goalsCopy.splice(index, 1);
                setGoals(goalsCopy);
            }
            closeConfirmDialog();
        });
    };

    return (
        goals && (
            <Container maxWidth="lg">
                <Typography variant="h2">Goals</Typography>

                <Box mt={2}>
                    <FormControl component="fieldset">
                        <Typography variant="h5">Choose goals type</Typography>
                        <RadioGroup
                            aria-label="goalsType"
                            name="goalsType"
                            value={isEarningBased.toString()}
                            onChange={handleGoalsTypeChange}
                        >
                            <FormControlLabel
                                value="true"
                                control={<Radio />}
                                label="Earnings-based goals"
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio />}
                                label="Subscribers-based goals"
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>

                <Box mt={2}>
                    <Grid container spacing={3}>
                        {goals.map((goal) => (
                            <Grid item xs={12} md={4} key={goal.id}>
                                <GoalCard
                                    {...goal}
                                    isGoalReached={amount > goal.amount}
                                    onDelete={deleteClickHandler}
                                    onEdit={editClickHandler}
                                    isEarningBased={isEarningBased}
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
                                Add Goal
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <ConfirmDialog
                    isOpen={isConfirmDialogOpen}
                    onClose={closeConfirmDialog}
                    onConfirm={onConfirmDeleteHandler}
                    content="Are you sure you want to delete this goal?"
                    confirmButtonText="Delete"
                />
            </Container>
        )
    );
};

export default Goals;
