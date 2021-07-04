import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from '@material-ui/core';

const GoalCard = ({
    id,
    amount,
    description,
    onDelete,
    onEdit,
    isEarningBased,
    isGoalReached,
}) => {
    return (
        <Card
            variant="outlined"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h2">
                    {`${isEarningBased ? '$' : ''}${amount}${
                        !isEarningBased ? ' Subs' : ''
                    }`}
                </Typography>
                <Typography color="textSecondary">
                    {isGoalReached ? 'Reached' : 'Not reached'}
                </Typography>
                <div dangerouslySetInnerHTML={{ __html: description }}></div>
            </CardContent>

            <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button
                    size="medium"
                    variant="outlined"
                    color="secondary"
                    onClick={() => onDelete(id)}
                >
                    Delete
                </Button>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    onClick={() => onEdit(id)}
                >
                    Edit
                </Button>
            </CardActions>
        </Card>
    );
};

export default GoalCard;
