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
import React from "react";
import {
  cancelBooking,
  getRefundBooking,
  getCustomerBookingHistory,
  countTotalBookingByStatus,
} from "../../../services/apiBooking";
import Loader from "../../../components/Loader";
import { useState } from "react";
import { DateFormater } from "../../../utils/DateFormater";
import FormatNumber from "../../../utils/NumberFormatter";
import { RiRefund2Fill } from "react-icons/ri";
import { FiEye } from "react-icons/fi";

import { toastError, toastSuccess } from "../../../components/Toast";
import { set } from "react-hook-form";
import { visuallyHidden } from "@mui/utils";
import { NavLink } from "react-router-dom";
import Status from "../../../components/Status";
import myBookingImg from "../../../assets/mybooking.jpg";
import AboutDetails from "../../../components/AboutDetails";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "@uidotdev/usehooks";

const MyBooking = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(""); // [1
  const [sortDate, setSortDate] = useState(""); // [2

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
    queryKey: [
      "bookingHistory",
      page,
      rowsPerPage,
      bookingStatus,
      sortDate,
      debouncedSearch,
    ],
    queryFn: () =>
      getCustomerBookingHistory(
        page + 1,
        rowsPerPage,
        bookingStatus,
        sortDate === "asc" ? "asc" : "desc",
        debouncedSearch
      ),
  });
  const { data: totalBookingHistory } = useQuery({
    queryKey: ["totalBookingHistory", bookingStatus, debouncedSearch],
    queryFn: () => countTotalBookingByStatus(bookingStatus, debouncedSearch),
  });
  function formatUTCDate(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }
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

  const getTotalPrice = (booking) => {
    let total = booking.price;
    if (booking.invoices) {
      const totalInvocie = booking.invoices.reduce((acc, item) => {
        return acc + item.totalPrice;
      }, 0);
      total += totalInvocie;
    }
    return total;
  };
  const handleSortDate = async () => {
    if (sortDate === "asc") {
      setSortDate("desc");
    } else {
      setSortDate("asc");
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(+event.target.value);
    setBookingStatus("");
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
  return (
    <AboutDetails backgroundImg="bg-my-booking" header="My Booking">
      <div className="px-[2rem] ">
        <div className="text-xl h-auto">
          <div className="flex justify-between">
            <div className="mt-3 xl:w-96 ">
              <div className="relative  flex items-center align-middle w-full flex-wrap gap-x-4">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="relative m-0 block flex-auto rounded ring-orange-500 ring-2 bg-transparent bg-clip-padding px-3 py-[0.25rem]  font-semibold leading-[1.6] text-xl outline-none transition duration-200 ease-in-out focus:rounded focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                  placeholder="Search coffee shops"
                  aria-label="Search"
                  aria-describedby="button-addon2"
                />
                <FaSearch size={35} />
              </div>
            </div>
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
          <br />

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6" fontWeight="bold">
                        Shop Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight="bold">
                        Table Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={true}
                        direction={sortDate === "asc" ? "asc" : "desc"}
                        onClick={() => {
                          handleSortDate();
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          Date
                        </Typography>
                        <Box component="span" sx={visuallyHidden}>
                          {sortDate === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
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
                  {bookingHistory.data && bookingHistory.data.length > 0 ? (
                    bookingHistory.data.map((row, idx) => {
                      return (
                        <TableRow
                          className="cursor-pointer capitalize"
                          onClick={(event) => handleClick(event, row._id)}
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={idx}
                        >
                          <TableCell>{row.coffeeShopId?.shopName}</TableCell>
                          <TableCell>
                            {row.tableId?.tableTypeId?.name}
                          </TableCell>
                          <TableCell>{DateFormater(row.startTime)}</TableCell>
                          <TableCell>{formatUTCDate(row.startTime)}</TableCell>
                          <TableCell>{formatUTCDate(row.endTime)}</TableCell>
                          <TableCell>
                            {FormatNumber(getTotalPrice(row))} VND
                          </TableCell>
                          {/* <TableCell>{row.status}</TableCell> */}
                          <TableCell>
                            <Status name={row.status} />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View" placement="top">
                              <NavLink to={`/booking/history/${row._id}`}>
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
                              {row.status !== "refund" &&
                                row.status !== "finished" &&
                                row.status !== "in progress" && (
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
                      We will refund <strong>100%</strong> of the booking bill
                      if you cancel <strong>2 days</strong> or more before the
                      booking time.
                    </Typography>
                  </DialogContentText>
                  <DialogContentText id="alert-dialog-description">
                    <Typography variant="h6">
                      We will refund <strong>50%</strong> of the booking bill if
                      you cancel <strong>1 day</strong> before the booking time.
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
                        {FormatNumber(
                          refundPrice - bookingPrice * refundPercent
                        )}{" "}
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
        </div>
      </div>
    </AboutDetails>
  );
};

export default MyBooking;
