import { useState, forwardRef, Fragment, useContext } from 'react';
import { AppBar, Button, TextField, Grid, Typography, FormControl, Dialog, DialogActions, DialogContent, Slide } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { web3 } from '../../services/connectWallet';
import campaign from '../../contracts/Campaign.json';
import LoadingSpinner from '../progress/LoadingSpinner';
import { Context } from "../../services/context";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDeliveryForm = ({ address, productPrice, title, description, open, setOpenDialog }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { connectedWallet } = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [sendingAddress, setSendingAddress] = useState("");
    const navigate = useNavigate();

    const formErrorVerification = () => {
        let noError = true;
        noError &= name !== "";
        noError &= email !== "";
        noError &= sendingAddress !== "";
        return noError;
    };

    const handleConfirm = async () => {
        setIsLoading(true);

        if (!connectedWallet) {
            enqueueSnackbar('Please connect MetaMask!', { variant: "error" });
            setOpenDialog(false);
            setIsLoading(false);
            return;
        }
        if (!formErrorVerification()) {
            enqueueSnackbar('Please fix incorrect inputs before ordering!', { variant: "error" });
            setOpenDialog(false);
            setIsLoading(false);
            return;
        }

        // Send data to mongo DB
        const data = { name, email, sendingAddress };

        const orderProductResult = await fetch(`http://localhost:8000/campaigns/${address}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const orderProductResultJSON = await orderProductResult.json();

        console.log(orderProductResultJSON);

        // Check available NFTs
        const storeData = { nftTitle: title, nftDescription: description };
        const storeParams = Object.keys(storeData)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(storeData[k]))
            .join('&');

        const nftResult = await fetch(`http://localhost:8000/images/nft/${address}?${storeParams}`);
        const nftResultJSON = await nftResult.json();

        console.log(nftResultJSON);

        const availableNFT = nftResultJSON.status;
        const tokenURI = availableNFT ? `https://gateway.pinata.cloud/ipfs/${nftResultJSON.IpfsHash}` : "";

        console.log(tokenURI);

        const { ethereum } = window;

        try {
            const campaignContract = new web3.eth.Contract(campaign.abi, address);
            const contributedValue = await campaignContract.methods.approvers(ethereum.selectedAddress).call();
            const tx = await campaignContract.methods.buyProduct(tokenURI).send({ from: ethereum.selectedAddress, value: web3.utils.toWei(String(productPrice)) });

            if (availableNFT && contributedValue === "0") {
                const mintedTokenID = tx.events['NFTMinted'].returnValues.tokenID;
                console.log(mintedTokenID);

                const moveData = { tokenID: mintedTokenID };
                const moveParams = Object.keys(moveData)
                    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(moveData[k]))
                    .join('&');

                const moveNFT = await fetch(`http://localhost:8000/images/nft/${address}/${nftResultJSON.imageIndex}?${moveParams}`, {
                    method: 'POST'
                });
                await moveNFT.json();

                enqueueSnackbar('You were awarded an NFT!', { variant: "success" });
            }

            enqueueSnackbar('Successfully submitted an order!', { variant: "success" });
            return navigate(0);
        } catch (err) {
            console.log(err);
        }

        setIsLoading(false);
        setOpenDialog(false);
    };

    return (
        <Fragment>
            {isLoading ? <LoadingSpinner borderRadius='20px' /> : (
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenDialog(false)}
                    aria-describedby="alert-dialog-slide-description"
                    sx={{ zIndex: 5000 }}
                    PaperProps={{
                        style: { borderRadius: 10 }
                    }}
                >
                    <AppBar position="static" sx={{ p: 3, pl: 3, pb: 1 }}>
                        <Typography variant="h5" color="inherit" component="div">
                            Delivery Details
                        </Typography>
                    </AppBar>
                    <DialogContent sx={{ pb: 1 }}>
                        <FormControl variant="outlined" sx={{ width: "100%" }}>
                            <Grid container
                                alignItems="center"
                                justify="center" columnSpacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1" fontWeight="bold">
                                        Name
                                    </Typography>
                                    <TextField
                                        id="title"
                                        sx={{ width: "100%" }}
                                        value={name}
                                        onChange={(event) => { setName(event.target.value); }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1" fontWeight="bold">
                                        Email
                                    </Typography>
                                    <TextField
                                        id="title"
                                        sx={{ width: "100%" }}
                                        value={email}
                                        onChange={(event) => { setEmail(event.target.value); }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" fontWeight="bold" marginTop="1em">
                                Address
                            </Typography>
                            <TextField
                                id="description"
                                value={sendingAddress}
                                onChange={(event) => { setSendingAddress(event.target.value); }}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" sx={{ m: "auto", width: "15em", mb: 1 }} onClick={handleConfirm}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Fragment>
    );
};

export default ProductDeliveryForm;