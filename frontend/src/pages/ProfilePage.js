import { useState } from 'react';
import { Container, Grid, Typography, Pagination, useMediaQuery, ImageList, ImageListItem, Card } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { useTheme } from '@mui/material/styles';
import CampaignCard from '../components/campaign/CampaignCard';
import CampaignDetails from '../components/campaign/CampaignDetails';

const data = [
    {
        id: 1,
        title: "Lizard 1",
        description: "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
        imageURL: "https://img.capital.com/imgs/articles/662x308x1/shutterstock_1958528764.jpg",
    },
    {
        id: 2,
        title: "Lizard 2",
        description: "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
        imageURL: "https://img.capital.com/imgs/articles/662x308x1/shutterstock_1958528764.jpg",
    },
    {
        id: 3,
        title: "Lizard 3",
        description: "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
        imageURL: "https://img.capital.com/imgs/articles/662x308x1/shutterstock_1958528764.jpg",
    },
    {
        id: 4,
        title: "Lizard 4",
        description: "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica",
        imageURL: "https://img.capital.com/imgs/articles/662x308x1/shutterstock_1958528764.jpg",
    }
];

const NFTImageURLs = [
    {
        id: 1,
        imageURL: "https://img.capital.com/imgs/articles/662x308x1/shutterstock_1958528764.jpg",
    },
    {
        id: 2,
        imageURL: "https://img.capital.com/imgs/articles/662x308x1/shutterstock_1958528764.jpg"
    },
    {
        id: 3,
        imageURL: "https://img.capital.com/imgs/articles/662x308x1/shutterstock_1958528764.jpg"
    },
    {
        id: 4,
        imageURL: "https://img.capital.com/imgs/articles/662x308x1/shutterstock_1958528764.jpg"
    }
];

const ProfilePage = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const imageListProp = isSmall ? {} : { rowHeight: 200 };

    return (
        <Container sx={{ mt: 2, mb: 1, py: 1 }}>
            <CampaignDetails modalOpen={modalOpen} setModalOpen={setModalOpen} />
            <Typography variant="h3" textAlign="center" gutterBottom >
                My Profile
            </Typography>
            <Container sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "15px", p: 3 }}>
                <Typography variant="h5" marginLeft="7.5px" fontWeight="bold" align={isSmall ? "center" : "left"} gutterBottom >
                    My Campaigns
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
        </Container>
    );
};

export default ProfilePage;