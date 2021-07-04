import {
    Button,
    Card,
    Box,
    CardActions,
    CardContent,
    Typography,
} from '@material-ui/core';
import { Benefit } from '../../common/styles';

const TierCard = ({
    id,
    title,
    price,
    benefits,
    onDelete,
    onEdit,
    isEarningBased,
}) => {
    return (
        <Card
            variant="outlined"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h2">
                    {title}
                </Typography>
                <Typography color="textSecondary">
                    ${price} per month
                </Typography>
                <Box mt={4}>
                    <Typography variant="h4">Benefits:</Typography>
                    {benefits.map((benefit) => (
                        <Benefit key={benefit.id}>{benefit.title}</Benefit>
                    ))}
                </Box>
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

export default TierCard;
