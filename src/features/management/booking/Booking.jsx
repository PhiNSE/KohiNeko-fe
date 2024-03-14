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
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cancelBooking, getRefundBooking } from "../../../services/apiBooking";
import { useBookingByShopId } from "../../../hooks/useBookingByShopId";
import FormatNumber from "../../../utils/NumberFormatter";
import Status from "../../../components/Status";
import { NavLink } from "react-router-dom";
import { DateFormater } from "../../../utils/DateFormater";
import { FiEye } from "react-icons/fi";
import { RiRefund2Fill } from "react-icons/ri";
import { useState } from "react";
import { getTotalCoffeeShopBookingHistory } from "../../../services/apiBooking";
import { toastError, toastSuccess } from "../../../components/Toast";

const Booking = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("");
  const [sort, setSort] = useState("desc");
  const [key, setKey] = useState("");
  const [openPopUp, setOpenPopUp] = useState(false);

  const [bookingPrice, setBookingPrice] = useState(0); // [3
  const [refundPrice, setRefundPrice] = useState(0); // [4
  const [refundPercent, setRefundPercent] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const { isLoading, bookingByShop, error, refetchBookingByShop } =
    useBookingByShopId(page + 1, rowsPerPage, bookingStatus, sort, key);
  const allBookings = bookingByShop?.data;
  console.log(allBookings);

  const CancelBooking = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => refetchBookingByShop(),
  });
  const getTotalPrice = (booking) => {
    let total = Number(booking.price) || 0;
    if (booking.invoices) {
      const totalInvoice = booking.invoices.reduce((acc, item) => {
        return acc + (Number(item.totalPrice) || 0);
      }, 0);
      total += totalInvoice;
    }
    return total;
  };
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(+event.target.value);
    setBookingStatus("");
    setPage(0);
  };

  const { data: bookingCount, refetch: refetchBookingCount } = useQuery({
    queryKey: ["boookingCount", bookingStatus, key],
    queryFn: () => getTotalCoffeeShopBookingHistory(bookingStatus, sort, key),
    keepPreviousData: true,
  });

  const handleOpenDialog = async (row) => {
    console.log(row._id);
    setBookingId(row._id);
    const data = await getRefundBooking(row._id);
    console.log(data.data);
    console.log(data.data.refundAmount);
    setBookingPrice(data.data.bookingPrice);
    setRefundPrice(data.data.refundAmount);
    setRefundPercent(1 - data.data.refundPercent);
    setOpenPopUp(true);
  };

  const handleCancel = async () => {
    setOpenPopUp(false);
    const result = await CancelBooking.mutateAsync(bookingId);
    if (result.status === 200) {
      toastSuccess("Cancel booking successfully");
    } else {
      toastError(result.message);
    }
  };
  const handleChangeStatus = async (event) => {
    setBookingStatus(event.target.value);
    setPage(0);
  };
  return (
    <>
      <div className="flex justify-end mr-3">
        <select
          className="mt-3 text-lg py-2 px-3 border border-gray-300 rounded-sm bg-gray-100 font-medium shadow-sm"
          value={bookingStatus}
          onChange={handleChangeStatus}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in progress">In progress</option>
          <option value="finished">Finished</option>
          <option value="refund">Refund</option>
          {/* // Add more options as needed */}
        </select>
        {/* Rest of your component */}
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">
                    Booking ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">
                    Customer Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <TableSortLabel>
                    <Typography variant="h6" fontWeight="bold">
                      Date
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">
                    Start Time
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">
                    End Time
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">
                    Price
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">
                    Status
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allBookings && allBookings.length > 0 ? (
                allBookings.map((row, idx) => {
                  return (
                    <TableRow
                      className="cursor-pointer capitalize"
                      //     onClick={(event) => handleClick(event, row._id)}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={idx}
                    >
                      <TableCell>
                        <span className="text-xl text-yellow-600 font-semibold">
                          {row._id.slice(-4)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {row.customerId.firstName} {row.customerId.lastName}
                      </TableCell>
                      <TableCell>{DateFormater(row.startTime)}</TableCell>
                      <TableCell>
                        {new Date(row.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(row.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                      </TableCell>
                      <TableCell>
                        {FormatNumber(getTotalPrice(row))} VND
                      </TableCell>
                      {/* <TableCell>{row.status}</TableCell> */}
                      <TableCell>
                        <Status name={row.status} />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View" placement="top">
                          <NavLink to={`/management/booking/${row._id}`}>
                            <IconButton
                              aria-label="view"
                              style={{
                                border: "0.1px solid #ff9933",
                                marginLeft: "5px",
                                marginRight: "5px",
                              }} // Add margin here
                            >
                              <FiEye size={15} color="#b96714" />
                            </IconButton>
                          </NavLink>
                        </Tooltip>
                        <Tooltip title="Refund" placement="top">
                          {row.status !== "refund" && (
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleOpenDialog(row)}
                              style={{
                                border: "0.5px solid red",
                                marginLeft: "5px",
                              }} // Add margin here
                            >
                              <RiRefund2Fill size={15} color="red" />
                            </IconButton>
                          )}
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No Booking
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bookingCount && bookingCount.data ? bookingCount.data : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog
          open={openPopUp}
          onClose={() => setOpenPopUp(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          disableBackdropClick={true} // Disable closing dialog by clicking outside
          disableEscapeKeyDown={true} // Disable closing dialog by pressing Escape key
        >
          <div className="flex flex-col items-center justify-center">
            <DialogTitle id="alert-dialog-title">
              <Typography variant="h4">Booking cancel policy</Typography>
            </DialogTitle>
            <DialogContent className="flex flex-col items-center justify-center">
              {/* <HiOutlineCheckCircle size={80} color="green" /> */}
              <DialogContentText id="alert-dialog-description">
                <Typography variant="h6">
                  We will refund <strong>100%</strong> of the booking bill if
                  you cancel <strong>2 days</strong> or more before the booking
                  time.
                </Typography>
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                <Typography variant="h6">
                  We will refund <strong>50%</strong> of the booking bill if you
                  cancel <strong>1 day</strong> before the booking time.
                </Typography>
              </DialogContentText>
              <div className="w-4/5 border-t-2  px-5 py-3">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ borderBottom: "1px solid black" }}
                  >
                    Booking amount:
                  </Typography>
                  {refundPercent === 1 ? (
                    <>
                      <Typography variant="h6">
                        {FormatNumber(bookingPrice * refundPercent)} VND
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6 line-through">
                        {FormatNumber(bookingPrice)} VND
                      </Typography>
                      <Typography variant="h6 ">
                        {FormatNumber(bookingPrice * refundPercent)} VND
                      </Typography>
                    </>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ borderBottom: "1px solid black" }}
                  >
                    Invoice amount:
                  </Typography>
                  <Typography variant="h6">
                    {FormatNumber(refundPrice - bookingPrice * refundPercent)}{" "}
                    VND
                  </Typography>
                </div>

                <div
                  className="border-t-2 mt-2"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="h5"
                    style={{ borderBottom: "1px solid black" }}
                  >
                    Refund amount:
                  </Typography>
                  <Typography variant="h5">
                    {FormatNumber(refundPrice)} VND
                  </Typography>
                </div>
              </div>
            </DialogContent>
            <Typography variant="h6">
              Do you want to cancel this booking?
            </Typography>
          </div>
          <DialogActions>
            <Button
              color="warning"
              onClick={() => {
                setOpenPopUp(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleCancel()}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default Booking;
