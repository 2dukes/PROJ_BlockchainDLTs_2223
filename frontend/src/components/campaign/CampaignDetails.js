import { Fragment } from 'react';
import { Box, Grid, Button, Typography, Modal, TextField, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CampaignInfoCard from './CampaignInfoCard';

const items = [
    {
        header: "0x12345678901123456782345678901234567890123456789012345678901234567890",
        meta: "Address of Manager",
        description:
            "The manager created this campaign and can create requests to withdraw money.",
        style: { wordWrap: "break-word" },
    },
    {
        header: "12/10/2022",
        meta: "Open Until",
        description:
            "The end date of the campaign.",
    },
    {
        header: 1,
        meta: "Minimum Contribution (ETH)",
        description:
            "You must contribute at least this much ETH to become and approver.",
    },
    {
        header: 10,
        meta: "Number of Requests",
        description:
            "A request tries to withdraw money from the contract. Requests must be approved by approvers.",
    },
    {
        header: 5,
        meta: "Number of Approvers",
        description:
            "Number of people who have already donated to this campaign.",
    },
    {
        header: 120,
        meta: "Campaign Balance (ETH)",
        description:
            "The balance is how much money this campaign has left to spend.",
    },
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    border: '2px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4
};

const CampaignDetails = ({ modalOpen, setModalOpen }) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Fragment>
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ pb: 2 }}>
                        Campaign Title
                    </Typography>
                    <Grid container>
                        <Grid item xs={12} md={8}> {/* When in small devices, spacing = 0*/}
                            <Grid container spacing={2}>
                                {items.map(item => (<Grid item={true} key={item.header} xs={6} md={5}><CampaignInfoCard {...item} isSmall={isSmall} /></Grid>))}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ mt: isSmall ? 2 : 0 }}>
                            <Typography variant="body1" fontWeight="bold" marginTop="1em" sx={{ mt: 0 }}>
                                Amount to Contribute
                            </Typography>
                            <TextField
                                sx={{ width: "100%" }}
                                id="minimum-contribution"
                                type="number"
                                // value={values.minimumContribution}
                                // onChange={handleChange("minimumContribution")}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                                    inputProps: { min: 0 }
                                }}
                            />
                            <Button sx={{ fontWeight: "bold", mt: 3 }} variant="contained" color="primary" component="span">
                                Contribute
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Fragment>
    );
};

export default CampaignDetails;