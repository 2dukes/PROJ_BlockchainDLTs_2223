import { useState } from 'react';
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

const SideBar = ({ handleDrawerClose, open }) => {
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    const onClickConnectWallet = () => {
        connectWallet();
        setIsWalletConnected(true);
        enqueueSnackbar('Wallet connected!', { variant: "success" });
    };

    const onClickDisconnectWallet = () => {
        disconnectWallet();
        setIsWalletConnected(false);
        enqueueSnackbar('Wallet disconnected!', { variant: "success" });
    };

    const sideBarNames = ['All Campaigns', 'Create Campaign', 'Create Request', 'My Profile', isWalletConnected ? 'Disconnect Wallet' : 'Connect Wallet'];
    const sideBarIcons = [<CampaignIcon />, <AddCircleIcon />, <CreateIcon />, <AccountCircleIcon />, isWalletConnected ? <LockOpenIcon /> : <LockIcon />];
    const onClickActions = [() => { }, () => { }, () => { }, () => { }, isWalletConnected ? onClickDisconnectWallet : onClickConnectWallet];

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
                {sideBarNames.slice(0, 3).map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={onClickActions[index]}>
                            <ListItemIcon>
                                {sideBarIcons[index]}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {sideBarNames.slice(3, 5).map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={onClickActions[index + 3]}>
                            <ListItemIcon>
                                {sideBarIcons[index + 3]}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default SideBar;