import React from "react";
import { useContext } from 'react';
import { Toolbar, IconButton, Typography } from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase, AppBar } from '../../styles/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { Context } from "../../services/context";

const TopBar = ({ handleDrawerOpen, open }) => {

    const { setQuery } = useContext(Context);

    return (
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
                <Link to="/" style={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, color: 'inherit', textDecoration: 'inherit' }}>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                    >
                        DApp: Crowdfunding Reinvented
                    </Typography>
                </Link>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </Search>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;