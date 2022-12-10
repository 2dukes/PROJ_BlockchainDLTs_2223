import { Container, Card, Button, Typography, TextField, InputAdornment, FormControl, Grid, ImageList, ImageListItem } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const CampaignForm = ({ handleChange, values, setValues }) => {
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
                            inputProps: { min: 0 }
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
            <input
                type="file"
                id="campaign-image"
                style={{ display: "none" }}
                onChange={(e) => setValues(v => ({ ...v, campaignImage: e.target.files[0] }))}
            />
            <Container align="center" sx={{ marginTop: "2em" }}>
                <label htmlFor="campaign-image">
                    <Button variant="contained" color="primary" component="span">
                        Upload Image(s)
                    </Button>
                </label>
            </Container>
            {values.campaignImage !== null && values.campaignImageURL !== null && (
                <ImageList cols={1} rowHeight={200} sx={{ margin: "auto", marginTop: "1em", width: "22rem", border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px", padding: "0.5em" }}>
                    {values.campaignImageURL && (
                        <Card variant="outlined">
                            <AspectRatio objectFit="cover" >
                                <ImageListItem key={values.campaignImageURL} >
                                    <img
                                        src={values.campaignImageURL}
                                        alt={values.campaignImageURL}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            </AspectRatio>
                        </Card>
                    )}
                </ImageList>
            )}
        </FormControl>
    );
};

export default CampaignForm;