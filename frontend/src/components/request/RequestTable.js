import { useState, useEffect, useContext, Fragment, useCallback } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import LoadingSpinner from '../progress/LoadingSpinner';
import { Context } from "../../services/context";
import { web3 } from '../../services/connectWallet';
import campaign from '../../contracts/Campaign.json';
import { useSnackbar } from 'notistack';

const columns = [
    { id: 'description', label: 'Description', minWidth: 350 },
    { id: 'askedValue', label: 'Value (ETH)', minWidth: 15 },
    { id: 'approvalCount', label: 'Approval Count (ETH)', minWidth: 15 },
    { id: 'openDate', label: 'Open Date', minWidth: 15 },
    { id: 'approve', label: 'Approve', minWidth: 15 },
    { id: 'finalize', label: 'Finalize', minWidth: 15 },
];

const RequestTable = ({ address, setTab }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { connectedWallet } = useContext(Context);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [requests, setRequests] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCampaignContributor, setIsCampaignContributor] = useState(false);
    const [isCampaignCreator, setIsCampaignCreator] = useState(false);

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);

        if (connectedWallet) {
            const { ethereum } = window;

            const data = { personalAddress: ethereum.selectedAddress };
            const queryParams = Object.keys(data)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
                .join('&');

            try {
                const requestResponse = await fetch(`http://localhost:8000/requests/${address}?` + queryParams);
                const requestResponseJSON = await requestResponse.json();

                const campaignContract = new web3.eth.Contract(campaign.abi, address);
                const campaignCreator = (await campaignContract.methods.campaignCreator().call()).toLowerCase() === ethereum.selectedAddress.toLowerCase();
                const isContributor = (await campaignContract.methods.approvers(ethereum.selectedAddress).call()) > 0;
                setIsCampaignContributor(isContributor);
                setIsCampaignCreator(campaignCreator);
                setRequests(requestResponseJSON.requests);
            } catch (err) {
                console.log(err);
            }
        }

        setIsLoading(false);
    }, [address, connectedWallet]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const approveRequest = async (id) => {
        setIsLoading(true);

        const { ethereum } = window;
        const campaignContract = new web3.eth.Contract(campaign.abi, address);
        try {
            await campaignContract.methods.approveRequest(id).send({ from: ethereum.selectedAddress });
            enqueueSnackbar('Request successfully approved!', { variant: "success" });
            fetchRequests();
        } catch (err) {
            enqueueSnackbar('An error occurred while approving the request!', { variant: "error" });
        }

        setIsLoading(false);
    };

    const finalizeRequest = async (id) => {
        setIsLoading(true);

        try {
            const { ethereum } = window;
            const campaignContract = new web3.eth.Contract(campaign.abi, address);
            await campaignContract.methods.completeRequest(id).send({ from: ethereum.selectedAddress });
            enqueueSnackbar('Request successfully finalized!', { variant: "success" });
            fetchRequests();
        } catch (err) {
            enqueueSnackbar('An error occurred while finalizing the request!', { variant: "error" });
        }

        setIsLoading(false);
    };

    return (
        <Fragment>
            {requests !== undefined && requests.length === 0 ? (<Typography variant="body1" component="span">
                No requests available.
            </Typography>) : (isLoading && <LoadingSpinner borderRadius="20px" />)}
            {
                (requests !== undefined && requests.length > 0) && (<Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    {isLoading ? <LoadingSpinner borderRadius="20px" /> : (
                        <Fragment>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => {
                                                if ((column.id === "approve" && isCampaignContributor) || (column.id === "finalize" && isCampaignContributor) || (column.id !== "approve" && column.id !== "finalize"))
                                                    return (<TableCell
                                                        key={column.id}
                                                        style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                                                    >
                                                        {column.label}
                                                    </TableCell>);
                                                return null;
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {requests
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                        {columns.slice(0, columns.length - 2).map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id}>
                                                                    {value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                        {isCampaignContributor && <TableCell key="approve">
                                                            <Button variant="contained" color="success" onClick={approveRequest.bind(null, row.id)} disabled={row.complete || row.isApproved}>
                                                                Approve
                                                            </Button>
                                                        </TableCell>}
                                                        {isCampaignCreator && <TableCell key="finalize">
                                                            <Button variant="outlined" color="secondary" onClick={finalizeRequest.bind(null, row.id)} disabled={row.complete || !row.canFinalize}>
                                                                Finalize
                                                            </Button>
                                                        </TableCell>}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={requests.length}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[]}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Fragment>
                    )}
                </Paper>)}
        </Fragment>
    );
};

export default RequestTable;