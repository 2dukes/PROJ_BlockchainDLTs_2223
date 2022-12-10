import { useState, useEffect, Fragment } from 'react';
import { Box, Stepper, Step, StepButton, Button, Typography, Container } from '@mui/material';
import dayjs from 'dayjs';
import CampaignForm from '../components/campaign/CampaignForm';
import NFTForm from '../components/nft/NFTForm';

const steps = ['Campaign Details', 'NFT Awards'];

const NewCampaign = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [values, setValues] = useState({
        minimumContribution: 1,
        NFTAwards: 0,
        campaignTitle: "",
        campaignDescription: "",
        closeDate: dayjs().add(5, 'day'),
        selectedImages: [],
        imageURLs: []
    });

    useEffect(() => {
        if (values.selectedImages.length > 0)
            setValues(v => ({ ...v, imageURLs: values.selectedImages.map(img => URL.createObjectURL(img)) }));
    }, [values.selectedImages]);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const totalSteps = () => {
        return steps.length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const handleNext = () => {
        setActiveStep(isLastStep() ? activeStep : activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    return (
        <Fragment>
            <Typography variant="h2" marginTop="0.5em" textAlign="center" gutterBottom >
                Create Campaign
            </Typography>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                <Fragment>
                    <Container sx={{ mt: 2, mb: 1, py: 1 }}>
                        {isLastStep() ? <NFTForm handleChange={handleChange} values={values} setValues={setValues} /> : <CampaignForm handleChange={handleChange} values={values} />}
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
                            {isLastStep() ? 'Submit' : 'Next'}
                        </Button>
                    </Box>
                </Fragment>
            </div>
        </Fragment>
    );
};

export default NewCampaign;