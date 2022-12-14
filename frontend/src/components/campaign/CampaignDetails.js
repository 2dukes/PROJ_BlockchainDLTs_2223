import { Fragment, useState } from 'react';
import { Tab, Box, Grid, Button, Typography, Modal, TextField, InputAdornment, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CampaignInfoCard from './CampaignInfoCard';
import RequestTable from '../request/RequestTable';
import CampaignCardWithPrice from './CampaignCardWithPrice';
import { useSnackbar } from 'notistack';

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
    width: '55%',
    bgcolor: 'background.paper',
    border: '2px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4
};

const data = {
    id: 1,
    title: "CYPLUS Gadget x 1",
    description: "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
    price: 10,
    imageURL: "https://c0.iggcdn.com/indiegogo-media-prod-cld/image/upload/c_fill,w_695,g_auto,q_auto,dpr_1.0,f_auto,h_460/kht8woep0znoe8kqfqih",
};

const CampaignDetails = ({ modalOpen, setModalOpen }) => {
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const isReallySmall = useMediaQuery(theme.breakpoints.down('sm'));

    const [value, setValue] = useState('campaign-details');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList variant="scrollable" onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Details" value="campaign-details" />
                                <Tab label="Contribute" value="campaign-contribute" />
                                <Tab label="Requests" value="campaign-requests" />
                            </TabList>
                        </Box>
                        <TabPanel align="center" value="campaign-details" sx={{ p: 0, pt: 2, height: isReallySmall ? "35rem" : "30rem" }}>
                            <CampaignCardWithPrice {...data} />
                            {/* <Grid container> */}
                            {/* <Grid item xs={12} md={6}><CampaignCardWithPrice {...data} /></Grid> */}
                            {/* <Grid item xs={12} md={6}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        Delivery Information
                                    </Typography>
                                    <ProductDeliveryForm />
                                </Grid> */}
                            {/* </Grid> */}
                        </TabPanel>
                        <TabPanel value="campaign-contribute" sx={{ p: 0, pt: 2, height: isReallySmall ? "35rem" : "30rem" }}>
                            <Grid container>
                                <Grid item xs={12} md={9}> {/* When in small devices, spacing = 0*/}
                                    <Grid container spacing={1} pr={isSmall ? "0em" : "1em"}>
                                        {items.map(item => (<Grid item key={item.header} xs={6}><CampaignInfoCard {...item} isSmall={isSmall} /></Grid>))}
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={3} sx={{ mt: isSmall ? 2 : 0 }}>
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
                                    <Button sx={{ fontWeight: "bold", mt: 3 }} onClick={() => enqueueSnackbar('Successful contribution!', { variant: "success" })} variant="contained" color="primary" component="span">
                                        Contribute
                                    </Button>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value="campaign-requests" sx={{ p: 0, pt: 2, height: isReallySmall ? "35rem" : "30rem" }}>
                            <RequestTable />
                        </TabPanel>
                    </TabContext>
                </Box>
            </Modal>
        </Fragment >
    );
};

export default CampaignDetails;