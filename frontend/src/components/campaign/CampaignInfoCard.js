import { Card, CardContent, Typography } from '@mui/material';


const CampaignInfoCard = ({ header, meta, description }) => {
    return (
        <Card style={{ height: '100%' }}>
            <CardContent>
                <Typography noWrap variant="h5" component="div">
                    {header}
                </Typography>
                <Typography noWrap sx={{ mb: 1.5 }} color="text.secondary">
                    {meta}
                </Typography>
                <Typography variant="body2" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                }}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CampaignInfoCard;