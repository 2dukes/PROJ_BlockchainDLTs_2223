import { Fragment, useState, useEffect } from 'react';
import { Typography, Grid, Pagination, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CampaignCard from "../components/campaign/CampaignCard";
import CampaignDetails from '../components/campaign/CampaignDetails';
import LoadingSpinner from '../components/progress/LoadingSpinner';

const CAMPAIGNS_PER_PAGE = 4;

const fetchCampaigns = async (pageNumber) => {
    const data = { pageNumber, campaignsPerPage: CAMPAIGNS_PER_PAGE};
    const queryParams = Object.keys(data)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
        .join('&');

    const campaignResult = await fetch("http://localhost:8000/campaigns?" + queryParams);

    const campaignResultJSON = await campaignResult.json();

    return {
        campaigns: campaignResultJSON.campaigns,
        numCampaigns: campaignResultJSON.numCampaigns
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
                    {totalCampaigns === 0 ? <Typography variant="body1" marginTop="2em" textAlign="center" gutterBottom>
                        No data to show.
                    </Typography> : (
                        <Grid container
                            alignItems="center"
                            justify="center" spacing={3}>
                            {campaigns.slice(indexOfFirstResult, indexOfLastResult).map(campaign => <Grid item xs={12} md={6} key={campaign.address} onClick={updateSelectedCampaign.bind(null, campaign.address)}><CampaignCard {...campaign} setModalOpen={setModalOpen} /></Grid>)}
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Pagination size={isReallySmall ? "small" : "medium"} count={Math.ceil(totalCampaigns / CAMPAIGNS_PER_PAGE)} page={page} onChange={changePage} color="primary" />
                            </Grid>
                        </Grid>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default CampaignPage;