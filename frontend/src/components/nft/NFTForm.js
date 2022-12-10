import { Container, Card, Typography, TextField, FormControl, Button, ImageList, ImageListItem } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';

const NFTForm = ({ handleChange, values, setValues }) => {
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
                InputProps={{ inputProps: { min: 0 } }}
            />
            <input
                type="file"
                id="nfts-images"
                multiple
                style={{ display: "none" }}
                onChange={(e) => setValues(v => ({ ...v, NFTselectedImages: Array.from(e.target.files) }))}
            />
            {values.NFTAwards > 0 && (
                <Container align="center" sx={{ marginTop: "2em" }}>
                    <label htmlFor="nfts-images">
                        <Button variant="contained" color="primary" component="span">
                            Upload Image(s)
                        </Button>
                    </label>
                </Container>
            )}
            {values.NFTAwards > 0 && values.NFTselectedImages.length > 0 && values.NFTImageURLs.length > 0 && (
                <ImageList cols={3} rowHeight={200} sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px", padding: "0.5em" }}>
                    {values.NFTImageURLs.map((imageURL) => (
                        <Card variant="outlined">
                            <AspectRatio objectFit="cover">
                                <ImageListItem key={imageURL} >
                                    <img
                                        src={imageURL}
                                        alt={imageURL}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            </AspectRatio>
                        </Card>
                    ))}
                </ImageList>
            )}
        </FormControl>
    );
};

export default NFTForm;;