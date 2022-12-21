import { useState, forwardRef } from 'react';
import { AppBar, Button, TextField, Grid, Typography, FormControl, Dialog, DialogActions, DialogContent, Slide } from '@mui/material';
import { useSnackbar } from 'notistack';
import { connectWallet, web3 } from '../../services/connectWallet';
import campaign from '../../contracts/Campaign.json';
import crowdnft from '../../contracts/CrowdNFT.json';


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDeliveryForm = ({ address, title, open, setOpenDialog }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [sendingAddress, setSendingAddress] = useState("");

    const formErrorVerification = () => {
        let noError = true;
        noError &= name !== "";
        noError &= email !== "";
        noError &= sendingAddress !== "";
        return noError;
    };

    const handleConfirm = async () => {
        // if (!formErrorVerification()) {
        //     enqueueSnackbar('Please fix incorrect inputs before ordering!', { variant: "error" });
        //     return;
        // }

        // // Send data to mongo DB
        // const data = { name, email, sendingAddress };

        // const orderProductResult = await fetch(`http://localhost:8000/campaigns/${address}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // });

        // const orderProductResultJSON = await orderProductResult.json();

        // console.log(orderProductResultJSON)

        await connectWallet(); // TESTING

        // Check available NFTs
        const nftResult = await fetch(`http://localhost:8000/images/nft/${address}`);
        const nftResultJSON = await nftResult.json();

        console.log(nftResultJSON);

        if (nftResultJSON.status) { // If available NFT
            const tokenURI = `https://gateway.pinata.cloud/ipfs/${nftResultJSON.IpfsHash}`;

            console.log(tokenURI)

            const { ethereum } = window;

            // const campaignContract = new web3.eth.Contract(campaign.abi, address);
            // const tx = await campaignContract.methods.buyProduct(tokenURI).send({ from: ethereum.selectedAddress });
            
            const crowdNFTContract = new web3.eth.Contract(crowdnft.abi, "0x0E1b5E0a9e6619eBe68A156fCBD823a1E3f720Db");
            const tx = await crowdNFTContract.methods.mintNFT("0x42275AcDF307648FA35E436867eB75D966f4A5f7", tokenURI).send({ from: ethereum.selectedAddress });

            // REMOVE ONLYOWNER

            console.log(tx);
        } else {

        }

        // If not send tokenURI as empty string as it won't matter
        // Buy product function Solidity

        // Check update info

        enqueueSnackbar('Successfully submitted an order!', { variant: "success" });
        setOpenDialog(false);
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpenDialog(false)}
            aria-describedby="alert-dialog-slide-description"
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
    );
};

export default ProductDeliveryForm;