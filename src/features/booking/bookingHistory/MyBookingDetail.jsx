import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../../services/apiBooking";
import Loader from "../../../components/Loader";
import { Button, Grid } from "@mui/material";
import { Typography } from "@mui/material";
import FormatNumber from "./../../../utils/NumberFormatter";
import BookingInfo from "./BookingInfo";
import CartStatic from "./CartStatic";
import Items from "../../purchase/Items";

import { HiOutlineChevronRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
const MyBookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const {
    data: booking,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["boooking"],
    queryFn: () => getBooking(bookingId),
  });
  if (isLoading) {
    return <Loader />;
  }
  function calculateTotalPrice(invoices) {
    let total = 0;
    for (let invoice of invoices) {
      total += invoice.totalPrice;
    }
    return total;
  }

  function formatUTCDate(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  return (
    <>
      <div className="mx-4 my-6">
        <div className="mb-2">
          <Button
            variant="outlined"
            color="warning"
            endIcon={<HiOutlineChevronRight />}
            onClick={() => navigate("/booking/history")}
          >
            Back to booking history
          </Button>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/* Booking info */}
            <BookingInfo bookingInfo={booking.data} />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="px-6 py-6 border-solid border-2 rounded-large">
              {/* Cart */}
              {/* <Items items={items} coffeeShopId={CoffeeShop._id} /> */}
              <CartStatic
                selectedItems={booking.data.invoices}
                // setSelectedItems={setSelectedItems}
                // handleUpdateItem={handleUpdateItem}
              />
              <br />
              <hr />
              <div className="flex flex-row justify-between my-2">
                <Typography variant="h6" fontWeight="bold">
                  Total booking:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {FormatNumber(booking.data.price)} VND
                  {/* {FormatNumber((bookingInfo && bookingInfo.price) || 0)} VND */}
                </Typography>
              </div>
              <div className="flex flex-row justify-between my-2">
                {/* <div>
                <Typography variant="h6" fontWeight="bold">
                  Edit Item
                </Typography>
                
              </div> */}
                <Typography variant="h6" fontWeight="bold">
                  Total item:{" "}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {FormatNumber(calculateTotalPrice(booking.data.invoices))} VND
                </Typography>
              </div>
              <hr />
              <div className="flex flex-row justify-between my-3">
                <Typography variant="h5" fontWeight="bold">
                  Total payment:
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {/* {FormatNumber(
                    (bookingInfo && bookingInfo.price) + totalPrice || 0
                  )}{" "} */}
                  {FormatNumber(
                    booking.data.price +
                      calculateTotalPrice(booking.data.invoices)
                  )}{" "}
                  VND
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default MyBookingDetail;
