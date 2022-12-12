import { Card, CardContent, Typography } from '@mui/material';


const CampaignInfoCard = ({ header, meta, description, isSmall }) => {
    return (
        <Card style={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
                <Typography noWrap variant={isSmall ? "h6" : "h5"} component="div">
                    {header}
                </Typography>
                <Typography sx={{ mb: isSmall ? 0 : 1.5 }} color="text.secondary">
                    {meta}
                </Typography>
                {!isSmall && (
                    <Typography variant="body2" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                    }}>
                        {description}
                    </Typography>
                )}
            </CardContent>
        </Card >
    );
};

export default CampaignInfoCard;