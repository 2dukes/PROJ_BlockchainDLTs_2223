import { Fragment, useState, useEffect, useContext } from 'react';
import { Container, Grid, Typography, Pagination, useMediaQuery, ImageList, ImageListItem, Card, CardActionArea } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { useTheme } from '@mui/material/styles';
import CampaignCard from '../components/campaign/CampaignCard';
import CampaignDetails from '../components/campaign/CampaignDetails';
import { Context } from "../services/context";
import LoadingSpinner from '../components/progress/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CAMP_PER_PAGE = 2;

const fetchCampaigns = async (pageNumber, isContributed = false) => {
    const { ethereum } = window;

    const data = { pageNumber, campaignsPerPage: CAMP_PER_PAGE };
    const queryParams = Object.keys(data)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
        .join('&');

    let campaignResult = await fetch(`http://localhost:8000/campaigns/${isContributed ? "contribute" : "personal"}/${ethereum.selectedAddress}?` + queryParams);
    while(!(campaignResult.status === 200))
        campaignResult = await fetch(`http://localhost:8000/campaigns/${isContributed ? "contribute" : "personal"}/${ethereum.selectedAddress}?` + queryParams);

    const campaignResultJSON = await campaignResult.json();

    return {
        campaigns: campaignResultJSON.campaigns,
        numCampaigns: campaignResultJSON.numCampaigns
    };
};

const fetchOwnNFTs = async (setNFTImageURLs) => {
    const { ethereum } = window;

    const NFTResult = await fetch(`http://localhost:8000/nfts/${ethereum.selectedAddress}`);
    const NFTResultJSON = await NFTResult.json();

    setNFTImageURLs(NFTResultJSON.nfts);
};

const ProfilePage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCampaignAddr, setSelectedCampaignAddr] = useState(null);

    // My Campaigns
    const [highestPageNumber, setHighestPageNumber] = useState(1);
    const [isNextPage, setIsNextPage] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const [myCampaigns, setMyCampaigns] = useState([]);

    // Contributed Campaigns
    const [highestPageNumberCTB, setHighestPageNumberCTB] = useState(1);
    const [isNextPageCTB, setIsNextPageCTB] = useState(true);
    const [pageCTB, setPageCTB] = useState(1);
    const [totalCampaignsCTB, setTotalCampaignsCTB] = useState(0);
    const [contributedCampaigns, setContributedCampaigns] = useState([]);

    const [NFTImageURLs, setNFTImageURLs] = useState([]);

    const { connectedWallet, walletConnectAttempt } = useContext(Context);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const imageListProp = isSmall ? {} : { rowHeight: 200 };

    useEffect(() => {
        const fetchData = async (pageNumber, nextPage, setCampaigns, setTotal, isContributed = false) => {
            if (nextPage) {
                setIsLoading(true);
                const myCampaignData = await fetchCampaigns(pageNumber, isContributed);
                setCampaigns(prevCampaigns => [...prevCampaigns, ...myCampaignData.campaigns]);
                setTotal(myCampaignData.numCampaigns);
                setIsLoading(false);
            }
        };

        if (connectedWallet) {
            fetchData(page, isNextPage, setMyCampaigns, setTotalCampaigns);
            fetchData(pageCTB, isNextPageCTB, setContributedCampaigns, setTotalCampaignsCTB, true);
            fetchOwnNFTs(setNFTImageURLs);
        } else if (walletConnectAttempt && !connectedWallet) {
            enqueueSnackbar('Please connect MetaMask!', { variant: "error" });
            navigate("/");
        }
        
    }, [page, pageCTB, isNextPage, isNextPageCTB, connectedWallet, enqueueSnackbar, navigate, walletConnectAttempt]);

    const changePageCampaigns = (newPageNumber, highestPage, setNextPage, setOtherNextPage, setHighestPage, setPageNumber) => {
        if (newPageNumber > highestPage) {
            setNextPage(true);
            setOtherNextPage(false);
            setHighestPage(newPageNumber);
        } else
            setNextPage(false);
        setPageNumber(newPageNumber);
    };

    const updateSelectedCampaign = (campaignAddress) => {
        setSelectedCampaignAddr(campaignAddress);
    };

    let indexOfLastResult = page * CAMP_PER_PAGE;
    const indexOfFirstResult = indexOfLastResult - CAMP_PER_PAGE;
    indexOfLastResult = (indexOfLastResult + 1 > totalCampaigns) ? totalCampaigns : indexOfLastResult;

    let indexOfLastResultCTB = pageCTB * CAMP_PER_PAGE;
    const indexOfFirstResultCTB = indexOfLastResultCTB - CAMP_PER_PAGE;
    indexOfLastResultCTB = (indexOfLastResultCTB + 1 > totalCampaignsCTB) ? totalCampaignsCTB : indexOfLastResultCTB;

    return (
        <Fragment>
            {isLoading ? <LoadingSpinner /> : (
                <Container sx={{ mt: 2, mb: 1, py: 1 }}>
                    {selectedCampaignAddr && <CampaignDetails {...[...myCampaigns, ...contributedCampaigns].find(campaign => campaign.address === selectedCampaignAddr)} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
                    <Typography variant="h3" textAlign="center" gutterBottom >
                        My Profile
                    </Typography>
                    <Container sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "15px", p: 3 }}>
                        <Typography variant="h5" marginLeft="7.5px" fontWeight="bold" align={isSmall ? "center" : "left"} gutterBottom >
                            My Campaigns
                        </Typography>
                        {totalCampaigns === 0 ? <Typography variant="body1" marginTop="2em" textAlign="center" gutterBottom>
                            No data to show.
                        </Typography> : (
                            <Grid container
                                alignItems="center"
                                justify="center" spacing={3}>
                                {myCampaigns.slice(indexOfFirstResult, indexOfLastResult).map(campaign => <Grid item xs={12} md={6} key={campaign.address} onClick={updateSelectedCampaign.bind(null, campaign.address)}><CampaignCard {...campaign} setModalOpen={setModalOpen} /></Grid>)}
                                <Grid item xs={12} display="flex" justifyContent="center"><Pagination count={Math.ceil(totalCampaigns / CAMP_PER_PAGE)} page={page} onChange={(_, newPageNumber) => changePageCampaigns(newPageNumber, highestPageNumber, setIsNextPage, setIsNextPageCTB, setHighestPageNumber, setPage)} color="primary" /></Grid>
                            </Grid>
                        )}
                    </Container>
                    <Container sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "15px", p: 3, mt: "2em" }}>
                        <Typography variant="h5" marginLeft="7.5px" fontWeight="bold" align={isSmall ? "center" : "left"} gutterBottom >
                            Contributed Campaigns
                        </Typography>
                        {totalCampaignsCTB === 0 ? <Typography variant="body1" marginTop="2em" textAlign="center" gutterBottom>
                            No data to show.
                        </Typography> : (
                            <Grid container
                                alignItems="center"
                                justify="center" spacing={3}>
                                {contributedCampaigns.slice(indexOfFirstResultCTB, indexOfLastResultCTB).map(campaign => <Grid item xs={12} md={6} key={campaign.address} onClick={updateSelectedCampaign.bind(null, campaign.address)}><CampaignCard {...campaign} setModalOpen={setModalOpen} /></Grid>)}
                                <Grid item xs={12} display="flex" justifyContent="center"><Pagination count={Math.ceil(totalCampaignsCTB / CAMP_PER_PAGE)} page={pageCTB} onChange={(_, newPageNumber) => changePageCampaigns(newPageNumber, highestPageNumberCTB, setIsNextPageCTB, setIsNextPage, setHighestPageNumberCTB, setPageCTB)} color="primary" /></Grid>
                            </Grid>
                        )}
                    </Container>
                    <Container sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "15px", p: 3, mt: "2em" }}>
                        <Typography variant="h5" marginLeft="7.5px" fontWeight="bold" align={isSmall ? "center" : "left"} gutterBottom >
                            Awarded NFTs
                        </Typography>
                        {NFTImageURLs.length > 0 ? (<ImageList cols={isSmall ? 1 : 3} {...imageListProp}>
                            {NFTImageURLs.map((img) => {
                                if (!isSmall)
                                    return (
                                        <Card variant="outlined" key={img.id}>
                                            <CardActionArea href={img.NFTLink} target="_blank">
                                                <AspectRatio objectFit="cover">
                                                    <ImageListItem key={img.id} >
                                                        <img
                                                            src={img.imageURL}
                                                            alt={img.imageURL}
                                                            loading="lazy"
                                                        />
                                                    </ImageListItem>
                                                </AspectRatio>
                                            </CardActionArea>
                                        </Card>);
                                else
                                    return (
                                        <Card variant="outlined" sx={{ px: "10%", border: 0 }} key={img.id}>
                                            <CardActionArea href={img.NFTLink} target="_blank">
                                                <ImageListItem key={img.id}>
                                                    <img
                                                        src={img.imageURL}
                                                        alt={img.imageURL}
                                                        loading="lazy"
                                                    />
                                                </ImageListItem>
                                            </CardActionArea>
                                        </Card>
                                    );
                            })}
                        </ImageList>) : (<Typography variant="body1" marginTop="2em" textAlign="center" gutterBottom>
                            No data to show.
                        </Typography>)}
                    </Container>
                </Container>)}
        </Fragment>
    );
};

export default ProfilePage;