import * as React from 'react';
import { Fragment } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Container } from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase } from "./styles/Menu";
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CampaignCard from "./components/CampaignCard";
// import { connectWallet } from "./scripts/connectWallet";

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
  },
];

function App() {
  return (
    <Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Dapp: Crowdfunding Reinvented
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="lg">
        <Typography variant="h2" marginTop="0.5em" textAlign="center" gutterBottom >
          Campaigns
        </Typography>
        <Grid container
          alignItems="center"
          justify="center" spacing={3}>
          {data.map(item => <Grid item xs={6} key={item.id}><CampaignCard title={item.title} description={item.description} imageURL={item.imageURL} /></Grid>)}
        </Grid>
      </Container>
    </Fragment>
  );
}

export default App;
