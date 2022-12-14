import { Fragment, useState } from 'react';
import { Typography, Grid, Pagination } from '@mui/material';
import CampaignCard from "../components/campaign/CampaignCard";
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

const CampaignPage = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Fragment>
            <CampaignDetails modalOpen={modalOpen} setModalOpen={setModalOpen} />
            <Typography variant="h3" marginTop="2em" textAlign="center" gutterBottom >
                Campaigns
            </Typography>
            <Grid container
                alignItems="center"
                justify="center" spacing={3}>
                {data.map(item => <Grid item xs={12} md={6} key={item.id}><CampaignCard {...item} setModalOpen={setModalOpen} /></Grid>)}
                <Grid item xs={12} display="flex" justifyContent="center"><Pagination count={10} color="primary" /></Grid>
            </Grid>
        </Fragment>
    );
};

export default CampaignPage;