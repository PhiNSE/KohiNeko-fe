import { useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBooking";
import Loader from "../../components/Loader";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import FormatNumber from "../../utils/NumberFormatter";
import BookingInfo from "./BookingInfo";
import CartStatic from "./CartStatic";
import { SlArrowLeftCircle } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { orange } from "@mui/material/colors";
import { toastError, toastSuccess } from "../../components/Toast";
import { sendVnPayMessage } from "../../services/apiInvoice";

const MyBookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  let count = 0;
  const {
    data: booking,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["boooking"],
    queryFn: () => getBooking(bookingId),
  });
  console.log(booking);
  const { data: vnPayMessage } = useQuery({
    queryKey: ["vnPayMessage"],
    queryFn: () => sendVnPayMessage(allSearchParams),
  });

  const getAllSearchParams = () => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  const allSearchParams = getAllSearchParams();

  useEffect(() => {
    if (count < 1) {
      switch (allSearchParams.vnp_ResponseCode) {
        case "00":
          // toastSuccess("Payment success");
          // localStorage.removeItem("booking");
          // localStorage.removeItem("items");
          // localStorage.removeItem("bookingId");
          // navigate("/");
          break;
        case "01":
          toastError("Transaction is already exist");
          break;
        case "11":
          toastError(
            "Transaction failed: Pending payment is expired. Please try again."
          );
          break;
        case "24":
          toastError("Transaction canceled");
          break;
        case "23":
          toastError("Payment canceled");
          break;
        default:
          break;
      }
      count++;
    }
  }, []);

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

  return (
    <>
      <div className="absolute top-2 left-56">
        <SlArrowLeftCircle
          size={50}
          onClick={() => navigate(`/staff/booking`)}
          style={{ cursor: "pointer", transition: "0.3s", color: "black" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "white")}
          onMouseOut={(e) => (e.currentTarget.style.color = "black")}
        />
      </div>

      <div className="mx-4 my-[-2vh]">
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
                bookingStatus={booking.data.status}
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
