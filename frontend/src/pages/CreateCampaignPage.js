import { useState, useEffect, Fragment } from 'react';
import { Box, Stepper, Step, StepButton, Button, Typography, Container } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs';
import CampaignForm from '../components/campaign/CampaignForm';
import NFTForm from '../components/nft/NFTForm';

const steps = ['Campaign Details', 'NFT Awards'];

const NewCampaign = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [values, setValues] = useState({
        minimumContribution: 1,
        targetContribution: 10,
        productPrice: 0.25,
        campaignTitle: "",
        campaignDescription: "",
        closeDate: dayjs().add(5, 'day'),
        NFTselectedImages: [],
        NFTImageURLs: [],
        campaignImage: null,
        campaignImageURL: null
    });

    useEffect(() => {
        if (values.NFTselectedImages.length > 0)
            setValues(v => ({ ...v, NFTImageURLs: values.NFTselectedImages.map(img => URL.createObjectURL(img)) }));
        if (values.campaignImage !== null)
            setValues(v => ({ ...v, campaignImageURL: URL.createObjectURL(values.campaignImage) }));
    }, [values.NFTselectedImages, values.campaignImage]);

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

    const submitCampaign = async (event) => {
        event.preventDefault();
        handleNext();

        // minimumContribution: 1,
        // targetContribution: 10,
        // productPrice: 0.25,
        // campaignTitle: "",
        // campaignDescription: "",
        // closeDate: dayjs().add(5, 'day'),
        // NFTselectedImages: [],
        // NFTImageURLs: [],
        // campaignImage: null,
        // campaignImageURL: null

        // Deploy Campaign and get its address.

        const formData = new FormData();
        formData.append("campaignAddress", "0x12345");

        // Campaign Image
        formData.append("campaignImage", values.campaignImage);

        for (let i = 0; i < values.NFTselectedImages.length; i++)
            formData.append("nfts", values.NFTselectedImages[i]);

        // Request to save string fields in MongoDB.

        const createCampaignResult = await fetch("http://localhost:8000/images",
            {
                method: "POST",
                body: formData,
            }
        );

        const createCampaignResultJSON = await createCampaignResult.json();
        console.log(createCampaignResultJSON);
    };

    return (
        <Fragment>
            <Typography variant="h3" marginTop="2em" textAlign="center" gutterBottom >
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

            <Container sx={{ mt: 2, mb: 1, py: 1 }}>
                {isLastStep() ? <NFTForm values={values} setValues={setValues} /> : <CampaignForm handleChange={handleChange} values={values} setValues={setValues} />}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ fontWeight: "bold" }}
                        startIcon={<ArrowLeftIcon />}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button sx={{ fontWeight: "bold" }} variant="contained" onClick={isLastStep() ? submitCampaign : handleNext} endIcon={isLastStep() ? <SendIcon /> : <ArrowRightIcon />}>
                        {isLastStep() ? 'Submit' : 'Next'}
                    </Button>
                </Box>
            </Container>
        </Fragment>
    );
};

export default NewCampaign;