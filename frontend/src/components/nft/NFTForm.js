import { Typography, TextField, FormControl } from '@mui/material';

const NFTForm = ({ handleChange, values }) => {
    return (
        <FormControl variant="outlined" sx={{ width: "100%" }}>
            <Typography variant="body1" fontWeight="bold">
                Number of NFT Awards
            </Typography>
            <TextField
                id="nft-awards"
                type="number"
                value={values.NFTAwards}
                onChange={handleChange("NFTAwards")}
            />
        </FormControl>
    );
};

export default NFTForm;;