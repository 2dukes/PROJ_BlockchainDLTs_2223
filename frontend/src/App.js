import { useState, Fragment } from 'react';
import { Box, Toolbar, IconButton, Typography, Container, Drawer, Grid, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase, AppBar, DrawerHeader, drawerWidth } from "./styles/Menu";
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CampaignCard from "./components/CampaignCard";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
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
  }
];

function App() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
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

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Container sx={{ marginTop: "5em" }} maxWidth="lg">
          <Typography variant="h2" marginTop="0.5em" textAlign="center" gutterBottom >
            Campaigns
          </Typography>
          <Grid container
            alignItems="center"
            justify="center" spacing={3}>
            {data.map(item => <Grid item xs={12} md={6} key={item.id}><CampaignCard title={item.title} description={item.description} imageURL={item.imageURL} /></Grid>)}
          </Grid>
        </Container>
      </Box>
    </Fragment>
  );
}

export default App;
