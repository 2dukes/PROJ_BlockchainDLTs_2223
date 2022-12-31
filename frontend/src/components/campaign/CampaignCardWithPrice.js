import { useState, useEffect, Fragment } from 'react';
import { Box, Chip, Button, Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import ProductDeliveryForm from '../product/ProductDeliveryForm';
import LoadingSpinner from '../progress/LoadingSpinner';

const CampaignCardWithPrice = ({ address, title, description, remainingDays, productPrice, unitsSold, imageURL }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [ethPrice, setEthPrice] = useState(0);

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const coinGeckoData = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum");
                const coinGeckoDataJSON = await coinGeckoData.json();
                setEthPrice(coinGeckoDataJSON[0].current_price);
            } catch (err) {
                setEthPrice(1200); // Testing purposes because of free API plans
            }
            setIsLoading(false);
        };

        fetchEthPrice();
    }, []);

    return (
        <Fragment>
            {openDialog && <ProductDeliveryForm address={address} productPrice={productPrice} title={title} description={description} open={openDialog} setOpenDialog={setOpenDialog} />}
            {isLoading ? <LoadingSpinner borderRadius='20px' /> : (
                <Card sx={{ maxWidth: 550 }}>
                    <CardActionArea component="a">
                        <CardMedia
                            component="img"
                            height="140"
                            image={imageURL}
                            alt="green iguana"
                        />
                        <CardContent>
                            <Chip label="FEATURED" color="primary" size="small" sx={{ mb: "0.75em", borderRadius: 0 }} />
                            <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                                {`${title} x 1`}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div" mb="0" paddingBottom="0.5em">
                                <b>{productPrice}</b> ETH <span style={{ color: "red", fontSize: "15px" }}><del>{parseFloat(productPrice * 100 / 66).toFixed(3)} ETH</del>&nbsp;(33% OFF)</span>
                                <Typography variant="body2" component="div" color="gray">
                                    {"$ " + parseFloat(ethPrice * productPrice).toFixed(2)}
                                </Typography>
                            </Typography>
                            <Typography variant="body2" component="div" sx={{ my: 1.5 }}>
                                {description}
                            </Typography>
                            <Typography variant="body1" component="div" paddingBottom="0.75em">
                                <b>{unitsSold}</b> already claimed.
                            </Typography>
                            <Typography variant="body1" component="div">
                                Ships worldwide.
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button variant="outlined" onClick={handleClickOpenDialog} sx={{ width: "100%" }} disabled={remainingDays === "Campaign closed!"}>
                                    Buy Product
                                </Button>
                            </Box>
                        </CardContent>
                    </CardActionArea>
                </Card>
            )}
        </Fragment>
    );
};

export default CampaignCardWithPrice;