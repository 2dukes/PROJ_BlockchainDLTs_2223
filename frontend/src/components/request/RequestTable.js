import { useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'id', label: 'ID', minWidth: 15 },
    { id: 'description', label: 'Description', minWidth: 350 },
    { id: 'approvalCount', label: 'Approval Count (ETH)', minWidth: 15 },
    { id: 'openDate', label: 'Open Date', minWidth: 15 },
    { id: 'approve', label: 'Approve', minWidth: 15 },
    { id: 'finalize', label: 'Finalize', minWidth: 15 },
];

const rows = [
    {
        id: 1,
        description: "This is a description.",
        openDate: "12/12/2022",
        approvalCount: "50/250"
    },
    {
        id: 2,
        description: "This is a description.",
        openDate: "12/12/2022",
        approvalCount: "50/250"
    },
    {
        id: 3,
        description: "This is a description.",
        openDate: "12/12/2022",
        approvalCount: "50/250"
    },
    {
        id: 4,
        description: "This is a description.",
        openDate: "12/12/2022",
        approvalCount: "50/250"
    },
    {
        id: 5,
        description: "This is a description.",
        openDate: "12/12/2022",
        approvalCount: "50/250"
    },
    {
        id: 6,
        description: "This is a description.",
        openDate: "12/12/2022",
        approvalCount: "50/250"
    },
];

const RequestTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
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
                                        <TableCell key="approve">
                                            <Button variant="contained" color="success">
                                                Approve
                                            </Button>
                                        </TableCell>
                                        <TableCell key="finalize">
                                            <Button variant="outlined" color="secondary">
                                                Finalize
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default RequestTable;