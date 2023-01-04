import { useContext } from 'react';
import { IconButton, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { DrawerHeader, drawerWidth } from '../../styles/Menu';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateIcon from '@mui/icons-material/Create';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { connectWallet, disconnectWallet } from '../../services/connectWallet';
import { useSnackbar } from 'notistack';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../../services/context';

const SideBar = ({ handleDrawerClose, open }) => {
    const { connectedWallet, setConnectedWallet, setWalletConnectAttempt, setQuery } = useContext(Context);
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const theme = useTheme();

    const onClickConnectWallet = async () => {
        await connectWallet();
        setConnectedWallet(true);
        setWalletConnectAttempt(true);
        enqueueSnackbar('Wallet connected!', { variant: "success" });
    };

    const onClickDisconnectWallet = () => {
        disconnectWallet();
        setConnectedWallet(false);
        setWalletConnectAttempt(false);
        enqueueSnackbar('Wallet disconnected!', { variant: "success" });
    };

    const sideBarNames = ['All Campaigns', 'Create Campaign', 'Create Request', 'My Profile', connectedWallet ? 'Disconnect Wallet' : 'Connect Wallet'];
    const linkTo = ["/", "/campaign/new", "/request/new", "/profile", undefined];
    const sideBarIcons = [<CampaignIcon />, <AddCircleIcon />, <CreateIcon />, <AccountCircleIcon />, connectedWallet ? <LockOpenIcon /> : <LockIcon />];
    const onClickActions = [() => setQuery(""), () => setQuery(""), () => setQuery(""), () => setQuery(""), connectedWallet ? onClickDisconnectWallet : onClickConnectWallet];

    return (
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
                {sideBarNames.slice(0, 3).map((text, index) => {
                    if (linkTo[index])
                        return (
                            <Link to={linkTo[index]} key={text} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                <ListItem disablePadding style={{ backgroundColor: location.pathname === linkTo[index] ? 'lightgray' : 'white' }}>
                                    <ListItemButton onClick={onClickActions[index]}>
                                        <ListItemIcon>
                                            {sideBarIcons[index]}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        );
                    else
                        return (
                            <ListItem key={text} disablePadding>
                                <ListItemButton onClick={onClickActions[index]}>
                                    <ListItemIcon>
                                        {sideBarIcons[index]}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        );
                })}
            </List>
            <Divider />
            <List>
                {sideBarNames.slice(3, 5).map((text, index) => {
                    if (linkTo[index + 3])
                        return (
                            <Link to={linkTo[index + 3]} key={text} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={onClickActions[index + 3]} style={{ backgroundColor: location.pathname === linkTo[index + 3] ? 'lightgray' : 'white' }}>
                                        <ListItemIcon>
                                            {sideBarIcons[index + 3]}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        );
                    else
                        return (
                            <ListItem key={text} disablePadding>
                                <ListItemButton onClick={onClickActions[index + 3]}>
                                    <ListItemIcon>
                                        {sideBarIcons[index + 3]}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        );
                })}
            </List>
        </Drawer >
    );
};

export default SideBar;