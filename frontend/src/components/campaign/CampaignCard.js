import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

const CampaignCard = ({ title, description, imageURL, setModalOpen }) => {
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
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CampaignCard;