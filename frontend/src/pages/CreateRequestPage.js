import { useState, Fragment, useEffect } from 'react';
import { Container, Typography, TextField, InputAdornment, FormControl, Grid, Select, Button, MenuItem } from '@mui/material';
import LoadingSpinner from '../components/progress/LoadingSpinner';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { campaignFactoryContract, web3, connectWallet } from '../services/connectWallet';
import campaign from "../contracts/Campaign.json";

const contract = require("../contracts/Campaign.json");

const CreateRequestPage = () => {
    
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignAddr, setSelectedCampaignAddr] = useState(null);
    const [values, setValues] = useState({
        requestDescription: "",
        requestValue: 1,
        campaignId: "",
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const formErrorVerification = () => {
        let noError = true;
        noError &= values.requestDescription !== "";
        return noError;
    };

    const fetchCampaignsByCreator = async (pageNumber) => {
        await connectWallet(); // testing
    
        let numCampaigns = await campaignFactoryContract.methods.getCampaignsCount().call();
        let campaignPromises = [];
    
        for (let i = 0; i < numCampaigns; i++)
            campaignPromises.push(campaignFactoryContract.methods.campaigns(i).call());
    
        const campaignAddresses = await Promise.all(campaignPromises);
    
        console.log(campaignAddresses);

        const { ethereum } = window;
    
        let campaignObjs = [];
        let campaignContracts = campaignAddresses.map(addr => new web3.eth.Contract(campaign.abi, addr));
    
        const methodNames = ["campaignCreator"];
    
        let campaignStrDataPromises = [];
    
        for (let i = 0; i < numCampaigns; i++) {
            // Fetch data from Campaign contract
            const campaignDataPromises = methodNames.map(name => campaignContracts[i].methods[name]().call());
            campaignDataPromises.push(web3.eth.getBalance(campaignAddresses[i])); // Get Balance
            const campaignData = await Promise.all(campaignDataPromises);
    
            // Fetch title and description from MongoDB
            const data = { id: campaignAddresses[i] };
            const queryParams = Object.keys(data)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
                .join('&');
    
            // Do this in parallel
            campaignStrDataPromises.push(fetch(`http://localhost:8000/campaigns/${campaignAddresses[i]}?` + queryParams));
    
            if(campaignData[0].toLowerCase() === ethereum.selectedAddress.toLowerCase()) {
                campaignObjs.push(
                    {
                        address: campaignAddresses[i]
                    }
                );
            }
        }
    
        const campaignStrData = await Promise.all(campaignStrDataPromises);
        const campaignStrDataJSONPromises = await Promise.all(campaignStrData.map(data => data.json()));
    
        for (let i = 0; i < campaignObjs.length; i++) {
            campaignObjs[i].title = campaignStrDataJSONPromises[i].campaignTitle;
        }
    
        console.log(campaignObjs);
    
        return {
            campaigns: campaignObjs
        };
    };

    const createRequest = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        if (!web3) {
            enqueueSnackbar('Please connect MetaMask!', { variant: "error" });
            setIsLoading(false);
            return;
        }
    
        if (!formErrorVerification()) {
            enqueueSnackbar('Please fix incorrect inputs before submitting!', { variant: "error" });
            setIsLoading(false);
            return;
        }

        let status = true, tx;
        const { ethereum } = window;

        const abi = contract.abi;
        const contractAddress = selectedCampaignAddr;

        // Create a contract instance
        let campaignContract = new web3.eth.Contract(abi, contractAddress);

        try {
            tx = await campaignContract.methods.createRequest(
                web3.utils.toWei(String(values.requestValue)))
                .send({ from: ethereum.selectedAddress });

            status &= Boolean(tx.status);
        } catch (err) {
            status = false;
        }

        if (status) {
            const data = { description: values.requestDescription };

            const storeRequestDetailsResult = await fetch(`http://localhost:8000/requests/${selectedCampaignAddr}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const storeRequestDetailsResultJSON = await storeRequestDetailsResult.json();

            status &= storeRequestDetailsResultJSON.status;
        }

        if(status) {
            enqueueSnackbar('Request created successfully', { variant: "success" });
        } else {
            enqueueSnackbar('Error creating request', { variant: "error" });
        }

        console.log(status);

        setIsLoading(false);
        return navigate('/request/new');
    }

    const updateSelectedCampaign = (campaignAddress) => {
        setSelectedCampaignAddr(campaignAddress);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const campaignData = await fetchCampaignsByCreator();
            setCampaigns(prevCampaigns => [...prevCampaigns, ...campaignData.campaigns]);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    return (
        <Fragment>
            {isLoading && <LoadingSpinner />}
            <Container sx={{ mt: 2, mb: 1, py: 1 }}>
                <Typography variant="h3" textAlign="center" gutterBottom >
                    New Request
                </Typography>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                    <Typography variant="body1" fontWeight="bold" marginTop="1em">
                        Description
                    </Typography>
                    <TextField
                        id="description"
                        value={values.requestDescription}
                        onChange={handleChange("requestDescription")}
                        multiline
                        rows={4}
                    />
                    <Grid container
                        alignItems="center"
                        justify="center" columnSpacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" marginTop="1em">
                                Value
                            </Typography>
                            <TextField
                                sx={{ width: "100%" }}
                                id="minimum-contribution"
                                type="number"
                                value={values.requestValue}
                                onChange={handleChange("requestValue")}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                                    inputProps: { min: 0 }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" fontWeight="bold" marginTop="1em">
                                Campaign
                            </Typography>
                            <Select
                                id="campaign-select"
                                sx={{ width: "100%" }}
                                value={values.campaignId}
                                onChange={handleChange("campaignId")}>
                                {
                                    campaigns.map(campaign => <MenuItem key={campaign.address} value={campaign.address} onClick={updateSelectedCampaign.bind(null, campaign.address)}>{campaign.title}</MenuItem>)
                                }
                                {/* <MenuItem value={1}>Campaign 1</MenuItem>
                                <MenuItem value={2}>Campaign 2</MenuItem>
                                <MenuItem value={3}>Campaign 3</MenuItem> */}
                            </Select>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Button sx={{ fontWeight: "bold", mt: "1.5em", width: "10em" }} variant="contained" onClick={createRequest}>
                                Confirm
                            </Button>
                        </Grid>
                    </Grid>
                </FormControl>
            </Container>
        </Fragment>
    );
};

export default CreateRequestPage;