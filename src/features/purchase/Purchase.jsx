import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import FormatNumber from "../../utils/NumberFormatter";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import { toastError, toastSuccess } from "../../components/Toast";
import { get, useForm } from "react-hook-form";
import BookingInfo from "./BookingInfo";
import Items from "./Items";
import {
  purchaseBookingByWallet,
  createBooking,
  redirectVnPay,
  sendVnPayMessage,
} from "../../services/apiBooking";
import CartStatic from "./CartStatic";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import CoffeeShop from "./../management/coffeeShop/CoffeeShop";
import { WalletContext } from "../../context/WalletProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Purchase = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wallet, setWallet } = useContext(WalletContext);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const bookingInfo = JSON.parse(localStorage.getItem("booking")) || {};
  const CoffeeShop =
    JSON.parse(localStorage.getItem("booking")).coffeeShopId || {};
  const items = JSON.parse(localStorage.getItem("items")) || [];
  //* Confirm Booking
  const [openConfirmBooking, setOpenConfirmBooking] = useState(false);
  const handleOpenPurchase = () => {
    setOpenConfirmBooking(true);
  };
  const handleClosePurchase = () => {
    setOpenConfirmBooking(false);
  };
  const handleAgree = () => {
    handleSubmit(onSubmit)();
    setOpenConfirmBooking(false);
  };

  const CreateBooking = useMutation({
    mutationFn: createBooking,
    onError: toastError,
  });
  const RedirectVnPay = useMutation({
    mutationFn: redirectVnPay,
    onError: toastError,
  });
  const { data: vnPayMessage, isLoading } = useQuery({
    queryKey: ["vnPayMessage"],
    queryFn: () => sendVnPayMessage(allSearchParams),
  });
  isLoading && <Loader />;

  const getAllSearchParams = () => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  const allSearchParams = getAllSearchParams();
  useEffect(() => {
    switch (allSearchParams.vnp_ResponseCode) {
      case "00":
        toastSuccess("Payment success");
        localStorage.removeItem("booking");
        localStorage.removeItem("items");
        localStorage.removeItem("bookingId");
        navigate("/booking/history");
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
  }, []);

  const totalPrice =
    items.length === 0
      ? 0
      : items.reduce(
          (total, product) =>
            total + Number(product.price) * Number(product.quantity),
          0
        );
  const onSubmit = async (data) => {
    setValue("booking", bookingInfo);
    if (items.length > 0) {
      const filteredItems = eliminateUnwanted(items);
      setValue("invoiceItems", filteredItems);
    }
    try {
      const response = await CreateBooking.mutateAsync(getValues());
      if (response.status === 200) {
        localStorage.setItem("bookingId", response.data._id);
        const bookingId = response.data._id;
        if (paymentMethod === "VNPAY") {
          const redirectUrl = await RedirectVnPay.mutateAsync(bookingId);
          if (redirectUrl.status === 200) {
            const url = redirectUrl.data;
            window.location.href = url;
            // navigate(url);
          } else {
            toastError(redirectUrl.message);
          }
        } else {
          const walletResponse = await purchaseBookingByWallet(bookingId);
          if (walletResponse.status === 200) {
            toastSuccess(walletResponse.message);
            localStorage.removeItem("booking");
            localStorage.removeItem("items");
            localStorage.removeItem("bookingId");
            navigate("/booking/history");
            //* Update Wallet Value
            const newWalletValue =
              wallet - ((bookingInfo && bookingInfo.price) + totalPrice);
            setWallet(newWalletValue);
          } else {
            toastError(walletResponse.message);
          }
        }
      } else {
        toastError(response.message);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const eliminateUnwanted = (data) => {
    return data.map((item) => {
      const { images, price, name, status, itemTypeId, description, ...rest } =
        item;
      return { ...rest };
    });
  };
  return (
    <>
      <div className="mx-4 my-6">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/* Booking info */}
            <BookingInfo bookingInfo={bookingInfo} />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="px-6 py-6 border-solid border-2 rounded-large">
              <div className="mb-5">
                <NavLink to={`/coffeeShops/${CoffeeShop._id}/items`}>
                  <Button variant="outlined" color="warning">
                    Edit Item
                  </Button>
                </NavLink>
              </div>
              {/* Cart */}
              <div className=" border-t-2 ">
                <CartStatic selectedItems={items} />
              </div>
              <br />
              <hr />
              <div className="flex flex-row justify-between my-2">
                <Typography variant="h6" fontWeight="bold">
                  Total booking:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {FormatNumber((bookingInfo && bookingInfo.price) || 0)} VND
                </Typography>
              </div>
              <div className="flex flex-row justify-between my-2">
                <Typography variant="h6" fontWeight="bold">
                  Total item:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {FormatNumber(totalPrice)} VND
                </Typography>
              </div>
              <hr />
              <div className="flex flex-row justify-between my-3">
                <Typography variant="h5" fontWeight="bold">
                  Total payment:
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {FormatNumber(
                    (bookingInfo && bookingInfo.price) + totalPrice || 0
                  )}{" "}
                  VND
                </Typography>
              </div>

              {/* Payment method */}
              {Object.keys(bookingInfo).length > 0 && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl fullWidth>
                    <InputLabel>Choose payment method</InputLabel>
                    <Select
                      label="Choose payment method"
                      color="warning"
                      margin="normal"
                      required
                      {...register("paymentMethod", { required: true })}
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    >
                      <MenuItem value="VNPAY">VNPAY</MenuItem>
                      <MenuItem value="Other">Wallet</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    // type='submit'
                    sx={{ mt: 2 }}
                    style={{ borderRadius: "50px" }}
                    onClick={handleOpenPurchase}
                  >
                    Checkout
                  </Button>
                </form>
              )}
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Confirm purchase */}
      <Dialog
        open={openConfirmBooking}
        onClose={handleClosePurchase}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            borderRadius: 15,
            width: "80%",
            maxHeight: 435,
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ textAlign: "center", fontSize: "1.5rem" }}
        >
          {"Confirm Your Purchase"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center", color: "gray", fontSize: "1.2rem" }}
          >
            {"Are you sure you want to proceed with this purchase?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <Button
            onClick={handleClosePurchase}
            color="secondary"
            variant="contained"
            style={{ backgroundColor: "red" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAgree}
            color="primary"
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Purchase;
