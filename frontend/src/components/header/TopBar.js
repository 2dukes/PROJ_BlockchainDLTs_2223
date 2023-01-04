import React from "react";
import { useContext } from 'react';
import { Toolbar, IconButton, Typography } from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase, AppBar } from '../../styles/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { Context } from "../../services/context";
import { useLocation } from "react-router-dom";

const TopBar = ({ handleDrawerOpen, open }) => {

    const { setQuery } = useContext(Context);
    const location = useLocation();
    const displaySearch = location.pathname === "/";

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setQuery(event.target.value);
        }
      };

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
                { displaySearch && (
                    <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        onKeyDown={handleKeyDown}
                    />
                </Search>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;