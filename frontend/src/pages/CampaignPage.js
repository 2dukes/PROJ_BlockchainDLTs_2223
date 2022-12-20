import { Fragment, useState, useEffect } from 'react';
import { Typography, Grid, Pagination, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CampaignCard from "../components/campaign/CampaignCard";
import CampaignDetails from '../components/campaign/CampaignDetails';
import dayjs from 'dayjs';
import LoadingSpinner from '../components/progress/LoadingSpinner';
import { campaignFactoryContract, connectWallet, web3 } from '../services/connectWallet';
import campaign from "../contracts/Campaign.json";

const CAMPAIGNS_PER_PAGE = 4;

const fetchCampaigns = async (pageNumber) => {
    await connectWallet(); // testing

    let numCampaigns = await campaignFactoryContract.methods.getCampaignsCount().call();
    let campaignPromises = [];

    let indexOfLastResult = pageNumber * CAMPAIGNS_PER_PAGE;
    const indexOfFirstResult = indexOfLastResult - CAMPAIGNS_PER_PAGE;
    indexOfLastResult = (indexOfLastResult + 1 > numCampaigns) ? numCampaigns : indexOfLastResult;

    const numberCampaignsToDisplay = indexOfLastResult - indexOfFirstResult;

    for (let i = indexOfFirstResult; i < indexOfLastResult; i++)
        campaignPromises.push(campaignFactoryContract.methods.campaigns(i).call());

    const campaignAddresses = await Promise.all(campaignPromises);

    console.log(campaignAddresses);

    let campaignObjs = new Array(numCampaigns).fill({});
    let campaignContracts = campaignAddresses.map(addr => new web3.eth.Contract(campaign.abi, addr));

    const methodNames = ["campaignCreator", "minimumContribution", "maximumNFTContributors", "raisedValue", "targetValue", "approversCount", "endDate", "unitsSold", "productPrice"];

    let campaignStrDataPromises = [];

    for (let i = 0; i < numberCampaignsToDisplay; i++) {
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

    for (let i = 0; i < numberCampaignsToDisplay; i++) {
        campaignObjs[i].title = campaignStrDataJSONPromises[i].campaignTitle;
        campaignObjs[i].description = campaignStrDataJSONPromises[i].campaignDescription;
    }

    console.log(campaignObjs);

    return {
        campaigns: campaignObjs,
        numCampaigns
    };
};

const CampaignPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [highestPageNumber, setHighestPageNumber] = useState(1);
    const [isNextPage, setIsNextPage] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCampaigns, setTotalCampaigns] = useState(1);
    const [selectedCampaignAddr, setSelectedCampaignAddr] = useState(null);
    const [campaigns, setCampaigns] = useState([]);

    const theme = useTheme();
    const isReallySmall = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            if (isNextPage) {
                setIsLoading(true);
                const campaignData = await fetchCampaigns(page);
                setCampaigns(prevCampaigns => [...prevCampaigns, ...campaignData.campaigns]);
                setTotalCampaigns(campaignData.numCampaigns);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [page, isNextPage]);

    const changePage = (_, newPageNumber) => {
        if (newPageNumber > highestPageNumber) {
            setIsNextPage(true);
            setHighestPageNumber(newPageNumber);
        } else
            setIsNextPage(false);
        setPage(newPageNumber);
    };

    const updateSelectedCampaign = (campaignAddress) => {
        setSelectedCampaignAddr(campaignAddress);
    };

    let indexOfLastResult = page * CAMPAIGNS_PER_PAGE;
    const indexOfFirstResult = indexOfLastResult - CAMPAIGNS_PER_PAGE;
    indexOfLastResult = (indexOfLastResult + 1 > totalCampaigns) ? totalCampaigns : indexOfLastResult;

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
                        {campaigns.slice(indexOfFirstResult, indexOfLastResult).map(campaign => <Grid item xs={12} md={6} key={campaign.address} onClick={updateSelectedCampaign.bind(null, campaign.address)}><CampaignCard {...campaign} setModalOpen={setModalOpen} /></Grid>)}
                        <Grid item xs={12} display="flex" justifyContent="center">
                            <Pagination size={isReallySmall ? "small" : "medium"} count={Math.ceil(totalCampaigns / CAMPAIGNS_PER_PAGE)} page={page} onChange={changePage} color="primary" />
                        </Grid>
                    </Grid>
                </Fragment>
            )}
        </Fragment>
    );
};

export default CampaignPage;