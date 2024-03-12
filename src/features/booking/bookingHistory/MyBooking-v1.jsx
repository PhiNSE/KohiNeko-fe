import {
  Paper,
  Tab,
  TableCell,
  TableContainer,
  TablePagination,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  TableSortLabel,
  Box,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  cancelBooking,
  getRefundBooking,
  getCustomerBookingHistory,
  countTotalBookingByStatus,
} from '../../../services/apiBooking';
import Loader from '../../../components/Loader';
import { useState } from 'react';
import { DateFormater } from '../../../utils/DateFormater';
import FormatNumber from '../../../utils/NumberFormatter';
import { RiRefund2Fill } from 'react-icons/ri';
import { FiEye } from 'react-icons/fi';

import { toastError, toastSuccess } from '../../../components/Toast';
import { set } from 'react-hook-form';
import { visuallyHidden } from '@mui/utils';
import { NavLink } from 'react-router-dom';
import Status from '../../../components/Status';

const MyBooking = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('in progress'); // [1
  const [sortDate, setSortDate] = useState(''); // [2

  const [bookingPrice, setBookingPrice] = useState(0); // [3
  const [refundPrice, setRefundPrice] = useState(0); // [4
  const [refundPercent, setRefundPercent] = useState(0); // [5
  const [invoicePrice, setInvoicePrice] = useState(0); // [6

  const CancelBooking = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => refetch(),
  });
  const {
    data: bookingHistory,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['bookingHistory', page, rowsPerPage, bookingStatus, sortDate],
    queryFn: () =>
      getCustomerBookingHistory(
        page + 1,
        rowsPerPage,
        bookingStatus,
        sortDate === 'asc' ? 'asc' : 'desc'
      ),
  });
  const { data: totalBookingHistory } = useQuery({
    queryKey: ['totalBookingHistory', bookingStatus],
    queryFn: () => countTotalBookingByStatus(bookingStatus),
  });
  if (isLoading)
    return (
      <div>
        <div>
          {isLoading ? (
            <Loader /> // This will show only when isLoading is true
          ) : (
            <Table data={bookingHistory} /> // This will show when isLoading is false
          )}
        </div>
      </div>
    );

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  const handleSortDate = async () => {
    if (sortDate === 'asc') {
      setSortDate('desc');
    } else {
      setSortDate('asc');
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(+event.target.value);
    setBookingStatus('');
    setPage(0);
  };

  const handleChangeStatus = async (event) => {
    setBookingStatus(event.target.value);
    setPage(0);
  };

  const handleClick = (event, id) => {
    setSelectedRow(id);
  };

  const handleOpenDialog = async (row) => {
    setBookingId(row._id);
    const data = await getRefundBooking(row._id);
    console.log(data.data);
    console.log(data.data.refundAmount);
    setBookingPrice(data.data.bookingPrice);
    setRefundPrice(data.data.refundAmount);
    setRefundPercent(data.data.refundPercent);
    setOpenPopUp(true);
  };

  const handleCancel = async () => {
    setOpenPopUp(false);
    const result = await CancelBooking.mutateAsync(bookingId);
    if (result.status === 200) {
      toastSuccess('Cancel booking successfully');
    } else {
      toastError(result.message);
    }
  };
  return (
    <div className='m-3 h-screen'>
      <Typography sx={{ mx: 2 }} variant='h4'>
        My Booking
      </Typography>
      <div className='flex justify-end'>
        <select value={bookingStatus} onChange={handleChangeStatus}>
          <option value=''>All</option>
          <option value='pending'>Pending</option>
          <option value='in progress'>In progress</option>
          <option value='finished'>Finished</option>
          <option value='refund'>Refund</option>
          {/* // Add more options as needed */}
        </select>
        {/* Rest of your component */}
      </div>
      <br />

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 660 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant='h6' fontWeight='bold'>
                    Shop Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='h6' fontWeight='bold'>
                    Table Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={true}
                    direction={sortDate === 'asc' ? 'asc' : 'desc'}
                    onClick={() => {
                      handleSortDate();
                    }}
                  >
                    <Typography variant='h6' fontWeight='bold'>
                      Date
                    </Typography>
                    <Box component='span' sx={visuallyHidden}>
                      {sortDate === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant='h6' fontWeight='bold'>
                    Start Time
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='h6' fontWeight='bold'>
                    End Time
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='h6' fontWeight='bold'>
                    Price
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='h6' fontWeight='bold'>
                    Status
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingHistory.data && bookingHistory.data.length > 0 ? (
                bookingHistory.data.map((row, idx) => {
                  return (
                    <TableRow
                      className='cursor-pointer'
                      onClick={(event) => handleClick(event, row._id)}
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={idx}
                    >
                      <TableCell>{row.coffeeShopId.shopName}</TableCell>
                      <TableCell>{row.tableId.tableTypeId.name}</TableCell>
                      <TableCell>{DateFormater(row.startTime)}</TableCell>
                      <TableCell>
                        {new Date(row.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(row.endTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}
                      </TableCell>
                      <TableCell>{FormatNumber(row.price)}</TableCell>
                      {/* <TableCell>{row.status}</TableCell> */}
                      <TableCell>
                        <Status name={row.status} />
                      </TableCell>
                      <TableCell>
                        <Tooltip title='View' placement='top'>
                          <NavLink to={`/booking/history/${row._id}`}>
                            <IconButton
                              aria-label='view'
                              style={{
                                border: '0.1px solid blue',
                                marginLeft: '5px',
                                marginRight: '5px',
                              }} // Add margin here
                            >
                              <FiEye size={15} color='blue' />
                            </IconButton>
                          </NavLink>
                        </Tooltip>
                        <Tooltip title='Refund' placement='top'>
                          {row.status !== 'refund' && (
                            <IconButton
                              aria-label='delete'
                              onClick={() => handleOpenDialog(row)}
                              style={{
                                border: '0.5px solid red',
                                marginLeft: '5px',
                              }} // Add margin here
                            >
                              <RiRefund2Fill size={15} color='red' />
                            </IconButton>
                          )}
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    No Booking
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={
            totalBookingHistory && totalBookingHistory.data
              ? totalBookingHistory.data
              : 0
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog
          open={openPopUp}
          onClose={() => setOpenPopUp(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          disableBackdropClick={true} // Disable closing dialog by clicking outside
          disableEscapeKeyDown={true} // Disable closing dialog by pressing Escape key
        >
          <div className='flex flex-col items-center justify-center'>
            <DialogTitle id='alert-dialog-title'>
              <Typography variant='h4'>Booking cancel policy</Typography>
            </DialogTitle>
            <DialogContent className='flex flex-col items-center justify-center'>
              {/* <HiOutlineCheckCircle size={80} color="green" /> */}
              <DialogContentText id='alert-dialog-description'>
                <Typography variant='h6'>
                  We will refund <strong>100%</strong> of the booking bill if
                  you cancel <strong>2 days</strong> or more before the booking
                  time.
                </Typography>
              </DialogContentText>
              <DialogContentText id='alert-dialog-description'>
                <Typography variant='h6'>
                  We will refund <strong>50%</strong> of the booking bill if you
                  cancel <strong>1 day</strong> before the booking time.
                </Typography>
              </DialogContentText>
              <div className='w-4/5 border-y-2  px-5 py-3'>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography
                    variant='h6'
                    style={{ borderBottom: '1px solid black' }}
                  >
                    Refund amount:
                  </Typography>
                  <Typography variant='h6'>
                    {FormatNumber(refundPrice)} VND
                  </Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography
                    variant='h6'
                    style={{ borderBottom: '1px solid black' }}
                  >
                    Booking amount:
                  </Typography>
                  <Typography variant='h6'>
                    {FormatNumber(bookingPrice * refundPercent)} VND
                  </Typography>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography
                    variant='h6'
                    style={{ borderBottom: '1px solid black' }}
                  >
                    Invoice amount:
                  </Typography>
                  <Typography variant='h6'>
                    {FormatNumber(refundPrice - bookingPrice * refundPercent)}{' '}
                    VND
                  </Typography>
                </div>
              </div>
            </DialogContent>
            <Typography variant='h6'>
              Do you want to cancel this booking?
            </Typography>
          </div>
          <DialogActions>
            <Button
              color='warning'
              onClick={() => {
                setOpenPopUp(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color='error'
              variant='contained'
              onClick={() => handleCancel()}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default MyBooking;
