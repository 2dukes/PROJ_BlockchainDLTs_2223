import { useState, useEffect, Fragment } from 'react';
import { Box, Stepper, Step, StepButton, Button, Typography, Container } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs';
import CampaignForm from '../components/campaign/CampaignForm';
import NFTForm from '../components/nft/NFTForm';
import LoadingSpinner from '../components/progress/LoadingSpinner';
import { useSnackbar } from 'notistack';
import { campaignFactoryContract, web3 } from '../services/connectWallet';

const steps = ['Campaign Details', 'NFT Awards'];

const NewCampaign = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);
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

    const formErrorVerification = () => {
        let noError = true;
        noError &= values.campaignTitle !== "";
        noError &= values.campaignDescription !== "";
        noError &= values.minimumContribution < values.targetContribution;
        noError &= dayjs().isBefore(values.closeDate, 'day');
        return noError;
    };

    const submitCampaign = async (event) => {
        event.preventDefault();
        handleNext();

        setIsLoading(true);

        if (!web3) {
            enqueueSnackbar('Please connect MetaMask!', { variant: "error" });
            setIsLoading(false);
            return;
        }
        if (!formErrorVerification()) {
            enqueueSnackbar('Please fix incorrect inputs before submitting!', { variant: "error" });

        }

        // Deploy Campaign and get its address.

        let status = true, tx, newCampaignAddr;
        const { ethereum } = window;

        try {
            tx = await campaignFactoryContract.methods.deployCampaign(
                web3.utils.toWei(String(values.minimumContribution)),
                web3.utils.toWei(String(values.targetContribution)),
                values.NFTselectedImages.length,
                Math.round(values.closeDate.diff(dayjs(), 'day', true))
            ).send({ from: ethereum.selectedAddress });

            newCampaignAddr = tx.events['NewCampaignDeployed'].returnValues.campaignAddr;
            status &= Boolean(tx.status);
        } catch (err) {
            status = false;
        }

        if(status) {
            // Store images locally
            const formData = new FormData();
            formData.append("campaignAddress", newCampaignAddr);

            // Campaign Image
            formData.append("campaignImage", values.campaignImage);

            // NFT Images
            for (let i = 0; i < values.NFTselectedImages.length; i++)
                formData.append("nfts", values.NFTselectedImages[i]);

            const storeCampaignImgResult = await fetch("http://localhost:8000/images", {
                method: "POST",
                body: formData,
            });

            const storeCampaignImgResultJSON = await storeCampaignImgResult.json();

            status &= storeCampaignImgResultJSON.status;
        }

        // Request to save string fields in MongoDB

        if(status) {
            const data = { id: newCampaignAddr, title: values.campaignTitle, description: values.campaignDescription };

            const storeCampaignDetailsResult = await fetch("http://localhost:8000/campaigns", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const storeCampaignDetailsResultJSON = await storeCampaignDetailsResult.json();

            status &= storeCampaignDetailsResultJSON.status;
        }

        console.log(status);

        setIsLoading(false);

        // Redirect to main page after successful submition.
        // TO DO: Error message whenever wallet is not connected.
    };

    return (
        <Fragment>
            {isLoading && <LoadingSpinner />}
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