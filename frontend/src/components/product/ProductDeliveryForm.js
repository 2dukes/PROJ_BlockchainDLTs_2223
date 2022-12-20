import { useState, forwardRef } from 'react';
import { AppBar, Button, TextField, Grid, Typography, FormControl, Dialog, DialogActions, DialogContent, Slide } from '@mui/material';
import { useSnackbar } from 'notistack';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDeliveryForm = ({ address, open, setOpenDialog }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [sendingAddress, setSendingAddress] = useState("");

    const handleConfirm = async () => {
        enqueueSnackbar('Successfully submitted an order!', { variant: "success" });

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

        console.log(orderProductResultJSON)

        // Buy product function Solidity
        // If available NFTs
        // Use PINATA to mint them and fetch JSON tokenURI
        // If not send tokenURI as empty string as it won't matter

        // Check update info

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