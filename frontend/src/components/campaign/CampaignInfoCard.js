import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 150,
    },
});

const CampaignInfoCard = ({ header, meta, description, isSmall }) => {
    const isAddress = String(header).startsWith("0x");

    return (
        <Card style={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
                {isAddress ? (
                    <CustomWidthTooltip TransitionComponent={Zoom} title={header} placement="bottom" arrow>
                        <Typography noWrap variant={isSmall ? "h6" : "h5"} component="div">
                            {header}
                        </Typography>
                    </CustomWidthTooltip>) : (<Typography noWrap variant={isSmall ? "h6" : "h5"} component="div">
                        {header}
                    </Typography>)}
                <Typography sx={{ mb: isSmall ? 0 : 1.5 }} color="text.secondary">
                    {meta}
                </Typography>
                {!isSmall && (
                    <Typography variant="body2" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
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