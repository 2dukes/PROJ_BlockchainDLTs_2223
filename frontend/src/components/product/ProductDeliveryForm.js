import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDeliveryForm = ({ open, handleClose }) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={handleClose}>Agree</Button>
            </DialogActions>
        </Dialog>
        // <FormControl variant="outlined" sx={{ width: "100%" }}>
        //     <Grid container
        //         alignItems="center"
        //         justify="center" columnSpacing={3}>
        //         <Grid item xs={12} md={6}>
        //             <Typography variant="body1" fontWeight="bold">
        //                 Name
        //             </Typography>
        //             <TextField
        //                 id="title"
        //                 sx={{ width: "100%" }}
        //             // value={values.campaignTitle}
        //             // onChange={() => {}}
        //             />
        //         </Grid>
        //         <Grid item xs={12} md={6}>
        //             <Typography variant="body1" fontWeight="bold">
        //                 Email
        //             </Typography>
        //             <TextField
        //                 id="title"
        //                 sx={{ width: "100%" }}
        //             // value={values.campaignTitle}
        //             // onChange={() => {}}
        //             />
        //         </Grid>
        //     </Grid>
        //     <Typography variant="body1" fontWeight="bold" marginTop="1em">
        //         Address
        //     </Typography>
        //     <TextField
        //         id="description"
        //     // value={values.campaignDescription}
        //     // onChange={handleChange("campaignDescription")}
        //     />
        // </FormControl>
    );
};

export default ProductDeliveryForm;