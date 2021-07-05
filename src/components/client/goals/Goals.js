import {
    Container,
    Button,
    MobileStepper,
    Paper,
    Typography,
    Box,
    LinearProgress,
} from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Goal } from '../../../api/service';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
    border-radius: 4px;
    margin-top: 8px;
`;

const Goals = () => {
    const [goals, setGoals] = useState(null);
    const [isGoalEarningBased, setIsGoalEarningBased] = useState(null);
    const [amount, setAmount] = useState(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        Goal.getGoals().then((data) => {
            setGoals(data.goals);
            setIsGoalEarningBased(data.isGoalEarningBased);
            const tempAmount = data.isGoalEarningBased
                ? data.monthlyIncomeAmount
                : data.numberOfActiveSubs;
            setAmount(tempAmount);

            for (let i = 0; i < data.goals.length; i++) {
                if (
                    tempAmount < data.goals[i].amount ||
                    i === data.goals.length - 1
                ) {
                    setActiveStep(i);
                    break;
                }
            }
        });
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const isGoalReached = () => amount > goals[activeStep].amount;

    const getGoalText = () => {
        let text = '';
        if (isGoalEarningBased) {
            text = `$${
                isGoalReached() ? goals[activeStep].amount : amount
            } from $${goals[activeStep].amount}`;
        } else {
            text = `${
                isGoalReached() ? goals[activeStep].amount : amount
            } subscribers from ${goals[activeStep].amount}`;
        }

        return text;
    };

    return (
        goals && goals.length > 0 && (
            <Container maxWidth="xs" style={{ marginTop: '16px' }}>
                <Typography align="center" variant="h4">
                    Goals
                </Typography>
                <StyledPaper variant="outlined">
                    <MobileStepper
                        steps={goals.length}
                        position="static"
                        variant="text"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === goals.length - 1}
                            >
                                Next <KeyboardArrowRight />
                            </Button>
                        }
                        backButton={
                            <Button
                                size="small"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                            >
                                <KeyboardArrowLeft />
                                Back
                            </Button>
                        }
                    />
                    <Box padding={2}>
                        <Box
                            display="flex"
                            alignItems="baseline"
                            justifyContent="center"
                        >
                            <Typography variant="h4">
                                {getGoalText()}
                            </Typography>
                            {isGoalEarningBased && (
                                <Box ml={1}>
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                    >
                                        per month
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={
                                isGoalReached()
                                    ? 100
                                    : (amount * 100) / goals[activeStep].amount
                            }
                            style={{ marginTop: '8px' }}
                        />

                        <div
                            dangerouslySetInnerHTML={{
                                __html: goals[activeStep].description,
                            }}
                        ></div>
                    </Box>
                </StyledPaper>
            </Container>
        )
    );
};

export default Goals;
