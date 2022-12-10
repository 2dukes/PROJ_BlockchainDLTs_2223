import { Container, Card, FormControl, Button, ImageList, ImageListItem } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AspectRatio from '@mui/joy/AspectRatio';

const NFTForm = ({ values, setValues }) => {
    const printReset = values.NFTselectedImages.length > 0 && values.NFTImageURLs.length > 0;

    return (
        <FormControl variant="outlined" sx={{ width: "100%" }}>
            <input
                type="file"
                id="nfts-images"
                multiple
                style={{ display: "none" }}
                onChange={(e) => setValues(v => ({ ...v, NFTselectedImages: Array.from(e.target.files) }))}
            />
            <Container align="center">
                <label htmlFor="nfts-images">
                    <Button sx={{ fontWeight: "bold", mr: printReset ? 2 : 0 }} variant="contained" color="primary" component="span" endIcon={<FileUploadIcon />}>
                        Upload Image(s)
                    </Button>
                </label>
                {printReset && (
                    <Button sx={{ fontWeight: "bold", ml: 2 }} onClick={(e) => setValues(v => ({ ...v, NFTselectedImages: [], NFTImageURLs: [] }))} variant="outlined" color="error" component="span" endIcon={<RefreshIcon />}>
                        Reset
                    </Button>
                )}
            </Container>
            {printReset && (
                <ImageList cols={3} rowHeight={200} sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px", padding: "0.5em" }}>
                    {values.NFTImageURLs.map((imageURL) => (
                        <Card variant="outlined" key={imageURL}>
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