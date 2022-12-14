import { Container, Typography, TextField, InputAdornment, FormControl, Grid, Select, Button, MenuItem } from '@mui/material';

const CreateRequestPage = () => {
    return (
        <Container sx={{ mt: 2, mb: 1, py: 1 }}>
            <Typography variant="h3" textAlign="center" gutterBottom >
                New Request
            </Typography>
            <FormControl variant="outlined" sx={{ width: "100%" }}>
                <Typography variant="body1" fontWeight="bold" marginTop="1em">
                    Description
                </Typography>
                <TextField
                    id="description"
                    // value={values.campaignDescription}
                    // onChange={handleChange("campaignDescription")}
                    multiline
                    rows={4}
                />
                <Grid container
                    alignItems="center"
                    justify="center" columnSpacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1" fontWeight="bold" marginTop="1em">
                            Value
                        </Typography>
                        <TextField
                            sx={{ width: "100%" }}
                            id="minimum-contribution"
                            type="number"
                            // value={values.minimumContribution}
                            // onChange={handleChange("minimumContribution")}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                                inputProps: { min: 0 }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1" fontWeight="bold" marginTop="1em">
                            Campaign
                        </Typography>
                        <Select
                            id="campaign-select"
                            sx={{ width: "100%" }}
                        // value={campaign-id}
                        // onChange={handleChange}
                        >
                            <MenuItem value={1}>Campaign 1</MenuItem>
                            <MenuItem value={2}>Campaign 2</MenuItem>
                            <MenuItem value={3}>Campaign 3</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button sx={{ fontWeight: "bold", mt: "1.5em", width: "10em" }} variant="contained" onClick={() => { }}>
                            Confirm
                        </Button>
                    </Grid>
                </Grid>
            </FormControl>
        </Container>
    );
};

export default CreateRequestPage;