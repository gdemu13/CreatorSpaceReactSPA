import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from '@material-ui/core';
import styled from 'styled-components';

const TierImage = styled.img`
    height: 150px;
    width: 150px;
    object-fit: cover;
`;

const TierCard = ({
    id,
    title,
    price,
    imageUrl,
    description,
    benefits,
    joinHandler,
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
                {imageUrl && 
                (<Box mt={4} display="flex" justifyContent="center">
                    <TierImage src={imageUrl} />
                </Box>)}
                <Box
                    mt={2}
                    dangerouslySetInnerHTML={{ __html: description }}
                ></Box>
                <Box mt={2}>
                    <ul style={{ paddingInlineStart: '20px' }}>
                        {benefits.map((benefit) => (
                            <li key={benefit.id}>{benefit.title}</li>
                        ))}
                    </ul>
                </Box>
            </CardContent>

            <CardActions
                style={{ justifyContent: 'center', paddingBottom: '16px' }}
            >
                <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => joinHandler(id)}
                >
                    Join
                </Button>
            </CardActions>
        </Card>
    );
};

export default TierCard;
