import { Grid, Card, FormControl, Button, ImageList, ImageListItem, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AspectRatio from '@mui/joy/AspectRatio';

const NFTForm = ({ values, setValues }) => {
    const printReset = values.NFTselectedImages.length > 0 && values.NFTImageURLs.length > 0;

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));
    const imageListProp = isSmall ? {} : { rowHeight: 200 };

    return (
        <FormControl variant="outlined" sx={{ width: "100%" }}>
            <input
                type="file"
                id="nfts-images"
                multiple
                style={{ display: "none" }}
                onChange={(e) => setValues(v => ({ ...v, NFTselectedImages: Array.from(e.target.files) }))}
            />
            <Grid container align="center">
                <Grid item xs={12} >
                    <label htmlFor="nfts-images">
                        <Button sx={{ fontWeight: "bold" }} variant="contained" color="primary" component="span" endIcon={<FileUploadIcon />}>
                            Upload Image(s)
                        </Button>
                    </label>
                </Grid>
                {printReset && (
                    <Grid item xs={12} sx={{ pt: 2 }}>
                        <Button sx={{ fontWeight: "bold" }} onClick={(e) => setValues(v => ({ ...v, NFTselectedImages: [], NFTImageURLs: [] }))} variant="outlined" color="error" component="span" endIcon={<RefreshIcon />}>
                            Reset
                        </Button>
                    </Grid>
                )}
            </Grid>
            {printReset && (
                <ImageList cols={isSmall ? 1 : 3}{...imageListProp} sx={{ border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px", padding: "0.5em" }}>
                    {values.NFTImageURLs.map((imageURL) => {
                        if (!isSmall)
                            return (
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
                                </Card>);
                        else
                            return (<Card variant="outlined" sx={{ px: "10%", border: 0 }} key={imageURL}>
                                <AspectRatio objectFit="cover">
                                    <ImageListItem key={imageURL} >
                                        <img
                                            src={imageURL}
                                            alt={imageURL}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                </AspectRatio>
                            </Card>);
                    })}
                </ImageList>
            )}
        </FormControl>
    );
};

export default NFTForm;;