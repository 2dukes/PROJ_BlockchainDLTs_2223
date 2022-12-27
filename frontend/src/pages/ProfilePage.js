import { Fragment, useState, useEffect, useContext } from 'react';
import { Container, Grid, Typography, Pagination, useMediaQuery, ImageList, ImageListItem, Card } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { useTheme } from '@mui/material/styles';
import CampaignCard from '../components/campaign/CampaignCard';
import CampaignDetails from '../components/campaign/CampaignDetails';
import { Context } from "../services/context";
import LoadingSpinner from '../components/progress/LoadingSpinner';

const data = [
    {
        id: 1,
        title: "Cyplus MOTOR Drive Smart Trainer ",
        description: "Thinking on cycling enthusiasts, we have designed a bike trainer that best suits you and your goals, environment, and most importantly, your budget.",
        imageURL: "https://c0.iggcdn.com/indiegogo-media-prod-cld/image/upload/c_fill,w_695,g_auto,q_auto,dpr_1.0,f_auto,h_460/kht8woep0znoe8kqfqih",
    },
    {
        id: 2,
        title: "Weapon X - Full Suspension Carbon",
        description: "The Weapon X features a hand laid carbon fiber frame which beautifully integrates a lot ot features.",
        imageURL: "https://c0.iggcdn.com/indiegogo-media-prod-cld/image/upload/c_fit,w_auto,g_center,q_auto:best,dpr_1.0,f_auto/osxajnnbuhc7tuoijdn8",
    },
    {
        id: 3,
        title: "SHARGEEK: Charger With Power Display",
        description: "Combines vintage with modern technology for a unique charging style suitable for any device.",
        imageURL: "https://c3.iggcdn.com/indiegogo-media-prod-cld/image/upload/c_fit,w_auto,g_center,q_auto:best,dpr_1.0,f_auto/jebsikl4osnj9sgcexqs",
    },
    {
        id: 4,
        title: "Peanut Butter Gallery Short Film",
        description: "A dark comedy short film about four puppet friends who make the deadly decision to test their allergy anaphylactic.",
        imageURL: "https://c2.iggcdn.com/indiegogo-media-prod-cld/image/upload/c_fit,w_auto,g_center,q_auto:best,dpr_1.0,f_auto/u34plfxzuwtijg7f6g61",
    }
];

const NFTImageURLs = [
    {
        id: 1,
        imageURL: "https://emirateswoman.com/wp-content/uploads/2022/07/Bored-Ape-Club-NFT-1.png",
    },
    {
        id: 2,
        imageURL: "https://www.infomoney.com.br/wp-content/uploads/2022/01/FJkLjuCXMAYC1MO.jpg?resize=916%2C515&quality=50&strip=all"
    },
    {
        id: 3,
        imageURL: "https://miro.medium.com/max/670/0*iXFSD9fZ-AD73K3P.jpg"
    },
    {
        id: 4,
        imageURL: "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/43YAWLITTZJLZIQTCP2JSS4KSM.jpg"
    }
];

const CAMPAIGNS_PER_PAGE = 4;

const fetchMyCampaigns = async (pageNumber) => {
    const { ethereum } = window;

    const data = { pageNumber, campaignsPerPage: CAMPAIGNS_PER_PAGE };
    const queryParams = Object.keys(data)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
        .join('&');

    const campaignResult = await fetch(`http://localhost:8000/campaigns/personal/${ethereum.selectedAddress}?` + queryParams);

    const campaignResultJSON = await campaignResult.json();

    return {
        campaigns: campaignResultJSON.campaigns,
        numCampaigns: campaignResultJSON.numCampaigns
    };
};

const ProfilePage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [highestPageNumber, setHighestPageNumber] = useState(1);
    const [isNextPage, setIsNextPage] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const [selectedCampaignAddr, setSelectedCampaignAddr] = useState(null);
    const [myCampaigns, setMyCampaigns] = useState([]);

    const { connectedWallet } = useContext(Context);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const imageListProp = isSmall ? {} : { rowHeight: 200 };

    useEffect(() => {
        const fetchMyData = async () => {
            if (isNextPage && connectedWallet) {
                setIsLoading(true);
                const myCampaignData = await fetchMyCampaigns(page);
                setMyCampaigns(prevCampaigns => [...prevCampaigns, ...myCampaignData.campaigns]);
                setTotalCampaigns(myCampaignData.numCampaigns);
                setIsLoading(false);
            }
        };

        fetchMyData();
    }, [page, isNextPage, connectedWallet]);

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
                <Container sx={{ mt: 2, mb: 1, py: 1 }}>
                    {selectedCampaignAddr && <CampaignDetails {...myCampaigns.find(campaign => campaign.address === selectedCampaignAddr)} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
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
                                <Grid item xs={12} display="flex" justifyContent="center"><Pagination count={Math.ceil(totalCampaigns / CAMPAIGNS_PER_PAGE)} page={page} onChange={changePage} color="primary" /></Grid>
                            </Grid>
                        )}
                    </Container>
                    <Container sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "15px", p: 3, mt: "2em" }}>
                        <Typography variant="h5" marginLeft="7.5px" fontWeight="bold" align={isSmall ? "center" : "left"} gutterBottom >
                            Contributed Campaigns
                        </Typography>
                        <Grid container
                            alignItems="center"
                            justify="center" spacing={3}>
                            {data.map(item => <Grid item xs={12} md={6} key={item.id}><CampaignCard {...item} setModalOpen={setModalOpen} /></Grid>)}
                            <Grid item xs={12} display="flex" justifyContent="center"><Pagination count={3} color="primary" /></Grid>
                        </Grid>
                    </Container>
                    <Container sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "15px", p: 3, mt: "2em" }}>
                        <Typography variant="h5" marginLeft="7.5px" fontWeight="bold" align={isSmall ? "center" : "left"} gutterBottom >
                            Awarded NFTs
                        </Typography>
                        <ImageList cols={isSmall ? 1 : 3} {...imageListProp}>
                            {NFTImageURLs.map((img) => {
                                if (!isSmall)
                                    return (
                                        <Card variant="outlined" key={img.id}>
                                            <AspectRatio objectFit="cover">
                                                <ImageListItem key={img.id} >
                                                    <img
                                                        src={img.imageURL}
                                                        alt={img.imageURL}
                                                        loading="lazy"
                                                    />
                                                </ImageListItem>
                                            </AspectRatio>
                                        </Card>);
                                else
                                    return (<Card variant="outlined" sx={{ px: "10%", border: 0 }} key={img.id}>
                                        <ImageListItem key={img.id}>
                                            <img
                                                src={img.imageURL}
                                                alt={img.imageURL}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                    </Card>);
                            })}
                        </ImageList>
                    </Container>
                </Container>)}
        </Fragment>
    );
};

export default ProfilePage;