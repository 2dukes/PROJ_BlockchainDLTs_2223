import { Grid, Typography, TextField, FormControl } from '@mui/material';

const ProductDeliveryForm = () => {
    return (
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
                    // value={values.campaignTitle}
                    // onChange={() => {}}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" fontWeight="bold">
                        Email
                    </Typography>
                    <TextField
                        id="title"
                        sx={{ width: "100%" }}
                    // value={values.campaignTitle}
                    // onChange={() => {}}
                    />
                </Grid>
            </Grid>
            <Typography variant="body1" fontWeight="bold" marginTop="1em">
                Address
            </Typography>
            <TextField
                id="description"
            // value={values.campaignDescription}
            // onChange={handleChange("campaignDescription")}
            />
        </FormControl>);
};

export default ProductDeliveryForm;