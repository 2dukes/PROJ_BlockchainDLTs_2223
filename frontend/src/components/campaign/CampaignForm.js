import { Typography, TextField, InputAdornment, FormControl, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const CampaignForm = ({ handleChange, values }) => {
    return (
        <FormControl variant="outlined" sx={{ width: "100%" }}>
            <Typography variant="body1" fontWeight="bold">
                Title
            </Typography>
            <TextField
                id="title"
                value={values.campaignTitle}
                onChange={handleChange("campaignTitle")}
            />
            <Typography variant="body1" fontWeight="bold" marginTop="1em">
                Description
            </Typography>
            <TextField
                id="description"
                value={values.campaignDescription}
                onChange={handleChange("campaignDescription")}
                multiline
                rows={4}
            />
            <Grid container
                alignItems="center"
                justify="center" columnSpacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" fontWeight="bold" marginTop="1em">
                        Minimum Contribution
                    </Typography>
                    <TextField
                        sx={{ width: "100%" }}
                        id="minimum-contribution"
                        type="number"
                        value={values.minimumContribution}
                        onChange={handleChange("minimumContribution")}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" fontWeight="bold" marginTop="1em">
                        Open Until
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            inputFormat="MM/DD/YYYY"
                            value={values.closeDate}
                            onChange={handleChange("closeDate")}
                            renderInput={(params) => <TextField {...params} fullWidth />}

                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </FormControl>
    );
};

export default CampaignForm;