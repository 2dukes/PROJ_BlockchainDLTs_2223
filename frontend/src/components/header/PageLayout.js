import { useState } from 'react';
import { Box, Container } from '@mui/material';
import SideBar from './SideBar';
import TopBar from './TopBar';

const PageLayout = ({ children }) => {
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <TopBar handleDrawerOpen={handleDrawerOpen} open={open} />
            <SideBar handleDrawerClose={handleDrawerClose} open={open} />
            <Container sx={{ marginTop: "5em" }} maxWidth="lg">
                {children}
            </Container>
        </Box>
    );
};

export default PageLayout;