import { useState, Fragment } from 'react';

import { Box, Stepper, Step, StepButton, Button, Typography, Container, TextField, InputAdornment, FormControl, Grid } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const steps = ['Campaign Details', 'NFT Awards'];

const NewCampaign = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});
    const [values, setValues] = useState({
        minimumContribution: 1,
        campaignTitle: "",
        campaignDescription: "",
        closeDate: dayjs().add(5, 'day')
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    return (
        <Fragment>
            <Typography variant="h2" marginTop="0.5em" textAlign="center" gutterBottom >
                Create Campaign
            </Typography>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Container sx={{ mt: 2, mb: 1, py: 1 }}>
                            {/* Step {activeStep + 1} */}
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
                        </Container>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext} sx={{ mr: 1 }}>
                                Next
                            </Button>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                                        Step {activeStep + 1} already completed
                                    </Typography>
                                ) : (
                                    <Button onClick={handleComplete}>
                                        {completedSteps() === totalSteps() - 1
                                            ? 'Finish'
                                            : 'Complete Step'}
                                    </Button>
                                ))}
                        </Box>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
};

export default NewCampaign;