import { Fragment, useState, useEffect } from 'react';
import { Typography, Grid, Pagination } from '@mui/material';
import CampaignCard from "../components/campaign/CampaignCard";
import CampaignDetails from '../components/campaign/CampaignDetails';
import dayjs from 'dayjs';
import LoadingSpinner from '../components/progress/LoadingSpinner';
import { campaignFactoryContract, connectWallet, web3 } from '../services/connectWallet';
import campaign from "../contracts/Campaign.json";

const fetchCampaigns = async () => {
    await connectWallet(); // testing

    let numCampaigns = await campaignFactoryContract.methods.getCampaignsCount().call();
    console.log("Number of Campaigns:" + numCampaigns);

    let campaignPromises = [];

    for (let i = 0; i < numCampaigns; i++)
        campaignPromises.push(campaignFactoryContract.methods.campaigns(i).call());

    const campaignAddresses = await Promise.all(campaignPromises);

    console.log(campaignAddresses);

    let campaignObjs = new Array(numCampaigns).fill({});
    let campaignContracts = campaignAddresses.map(addr => new web3.eth.Contract(campaign.abi, addr));

    const methodNames = ["campaignCreator", "minimumContribution", "maximumNFTContributors", "raisedValue", "targetValue", "approversCount", "endDate", "unitsSold", "productPrice"];

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

        campaignObjs[i] = {
            address: campaignAddresses[i],
            balance: web3.utils.fromWei(await web3.eth.getBalance(campaignAddresses[i])),
            campaignCreator: campaignData[0],
            minimumContribution: web3.utils.fromWei(campaignData.at(-1)),
            maximumNFTContributors: campaignData[2],
            raisedValue: web3.utils.fromWei(campaignData[3]),
            targetValue: web3.utils.fromWei(campaignData[4]),
            approversCount: campaignData[5],
            endDate: dayjs.unix(campaignData[6]).format('DD/MM/YYYY'),
            remainingDays: Math.round(dayjs.unix(campaignData[6]).diff(dayjs(), 'day', true)),
            unitsSold: campaignData[7],
            productPrice: web3.utils.fromWei(campaignData[8]),
            imageURL: `http://localhost:8000/${campaignAddresses[i]}/campaignImage.png`,
        };
    }

    const campaignStrData = await Promise.all(campaignStrDataPromises);
    const campaignStrDataJSONPromises = await Promise.all(campaignStrData.map(data => data.json()));

    for (let i = 0; i < numCampaigns; i++) {
        campaignObjs[i].title = campaignStrDataJSONPromises[i].campaignTitle;
        campaignObjs[i].description = campaignStrDataJSONPromises[i].campaignDescription;
    }

    console.log(campaignObjs);
    return campaignObjs;
};

const CampaignPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCampaignAddr, setSelectedCampaignAddr] = useState(null);
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setCampaigns(await fetchCampaigns());
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const updateSelectedCampaign = (campaignAddress) => {
        setSelectedCampaignAddr(campaignAddress);
    };

    return (
        <Fragment>
            {isLoading ? <LoadingSpinner /> : (
                <Fragment>
                    {selectedCampaignAddr && <CampaignDetails {...campaigns.find(campaign => campaign.address === selectedCampaignAddr)} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
                    <Typography variant="h3" marginTop="2em" textAlign="center" gutterBottom >
                        Campaigns
                    </Typography>
                    <Grid container
                        alignItems="center"
                        justify="center" spacing={3}>
                        {campaigns.map(campaign => <Grid item xs={12} md={6} key={campaign.address} onClick={updateSelectedCampaign.bind(null, campaign.address)}><CampaignCard {...campaign} setModalOpen={setModalOpen} /></Grid>)}
                        <Grid item xs={12} display="flex" justifyContent="center"><Pagination count={3} color="primary" /></Grid>
                    </Grid>
                </Fragment>
            )}
        </Fragment>
    );
};

export default CampaignPage;