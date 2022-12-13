import * as React from 'react';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

const CampaignCardWithPrice = ({ title, price, imageURL }) => {
    return (
        <Card sx={{ maxWidth: 400 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={imageURL}
                    alt="green iguana"
                />
                <CardContent>
                    <Chip label="FEATURED" color="primary" size="small" sx={{ mb: "0.75em", borderRadius: 0 }} />
                    <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                        {title}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" mb="0" paddingBottom="0.5em">
                        <b>{price}</b> ETH <span style={{ color: "red", fontSize: "15px" }}><del>15 ETH</del>&nbsp;(33% OFF)</span>
                        <Typography variant="body2" component="div" color="gray">
                            $10&nbsp;303,70
                        </Typography>
                    </Typography>
                    <Typography variant="body1" component="div" paddingBottom="0.75em">
                        <b>23</b> already claimed.
                    </Typography>
                    <Typography variant="body1" component="div">
                        Ships worldwide.
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CampaignCardWithPrice;