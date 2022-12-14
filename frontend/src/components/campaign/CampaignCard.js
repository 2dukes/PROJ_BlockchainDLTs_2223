import * as React from 'react';
import { Stack, Box, Typography, Card, CardMedia, CardContent, CardActionArea, LinearProgress } from '@mui/material';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PropTypes from 'prop-types';

const LinearProgressWithLabel = (props) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
};

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

const CampaignCard = ({ title, description, imageURL, setModalOpen }) => {
    const progress = 25;

    return (
        <Card sx={{ maxWidth: 500, margin: "auto" }}>
            <CardActionArea onClick={() => setModalOpen(true)}>
                <CardMedia
                    component="img"
                    height="140"
                    image={imageURL}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: "1em" }}>
                        {description}
                    </Typography>
                    <Typography variant="body2" component="span" color="text.secondary">
                        <b>2 ETH</b> raised
                    </Typography>
                    <LinearProgressWithLabel value={progress} />
                    <Stack direction="row" alignItems="center" gap={1} marginTop="0.5em">
                        <WatchLaterIcon color="disabled"/> 3 days left
                        <Typography variant="body2" component="div" color="text.secondary">
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CampaignCard;