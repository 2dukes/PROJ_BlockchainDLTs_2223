import * as React from 'react';
import { Box, Chip, Button, Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';

const CampaignCardWithPrice = ({ title, description, price, imageURL }) => {
    return (
        <Card sx={{ maxWidth: 550 }}>
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
                    <Typography variant="body2" component="div" sx={{ my: 1.5 }}>
                        {description}
                    </Typography>
                    <Typography variant="body1" component="div" paddingBottom="0.75em">
                        <b>23</b> already claimed.
                    </Typography>
                    <Typography variant="body1" component="div">
                        Ships worldwide.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" sx={{ width: "100%" }}>
                            Buy Product
                        </Button>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CampaignCardWithPrice;