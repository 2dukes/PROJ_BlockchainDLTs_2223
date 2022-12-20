import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingSpinner = ({ borderRadius = "0px" }) => {
    return (
        <div>
            <Backdrop
                sx={{ borderRadius , color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export default LoadingSpinner;