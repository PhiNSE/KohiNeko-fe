import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { HiOutlineCheck } from "react-icons/hi";
import {
  getAllPackages,
  redirectVnPay,
  sendVnPayMessage,
} from "../../../services/apiPackage";
import { toastError, toastSuccess } from "../../../components/Toast";
import { subscribePackage } from "../../../services/apiPackage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../../components/Loader";

const Packages = () => {
  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: getAllPackages,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  // const SubmitPackage = useMutation({ mutationFn: subscribePackage });
  const RedirectVnPay = useMutation({ mutationFn: redirectVnPay });
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
    switch (allSearchParams.vnp_ResponseCode) {
      case "00":
        toastSuccess("Payment success");
        localStorage.removeItem("packageId");
        navigate("/management/coffeeShop");
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

  const handlePackageSubmit = async () => {
    setOpenPopUp(false);
    try {
      if (paymentMethod === "VNPAY") {
        const response = await RedirectVnPay.mutateAsync(selectedPackage._id);
        if (response.status === 200) {
          localStorage.setItem("packageId", selectedPackage._id);
          const url = response.data;
          window.location.href = url;
        } else {
          toastError(response.message);
        }
      }
    } catch (error) {
      toastError(error.message);
    }
  };
  return (
    <div className="bg-gray-200 h-fit w-full">
      <div className="m-4">
        <p className="mb-8 text-4xl font-bold">
          Choose a plan that works for you
        </p>
        <Grid container spacing={2}>
          {packages?.data
            .sort((a, b) => a.price - b.price)
            .map((pkg, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={4}>
                <div className="p-4 flex flex-col gap-2 bg-white border rounded-xl">
                  <div className="flex justify-between">
                    <h1 className="text-3xl font-bold">{pkg.name}</h1>
                    <p className="text-2xl font-bold text-gray-500">
                      đ {pkg.price}
                      <span className="text-sm">/{pkg.duration} day</span>
                    </p>
                  </div>
                  <p>{pkg.description}</p>
                  <p className="text-xl font-semibold">Highlighted features:</p>
                  <ul>
                    <li className="flex items-center">
                      <HiOutlineCheck /> <p>Benefit 1</p>
                    </li>
                    <li className="flex items-center">
                      <HiOutlineCheck /> <p>Benefit 2</p>
                    </li>
                    <li className="flex items-center">
                      <HiOutlineCheck /> <p>Benefit 3</p>
                    </li>
                  </ul>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedPackage(pkg);
                    }}
                  >
                    Select package
                  </Button>
                </div>
              </Grid>
            ))}
        </Grid>
      </div>
      <div className="mx-4 mb-4">
        <p className="text-3xl font-semibold">
          Your selected package: {selectedPackage?.name}
        </p>
        <p className="text-2xl font-semibold">
          Total pay: {selectedPackage?.price} VND
        </p>

        <FormControl sx={{ background: "white", marginTop: 2 }} fullWidth>
          <InputLabel>Choose payment method</InputLabel>
          <Select
            label="Choose payment method"
            color="warning"
            margin="normal"
            required
            disabled={Object.keys(selectedPackage).length === 0}
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <MenuItem value="VNPAY">VNPAY</MenuItem>
            <MenuItem value="Other">Wallet</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={Object.keys(selectedPackage).length === 0}
          sx={{ mt: 2 }}
          style={{ borderRadius: "50px" }}
          onClick={() => setOpenPopUp(true)}
        >
          Checkout
        </Button>
      </div>
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
            <p className="text-3xl">Subscribe package confirmation</p>
          </DialogTitle>
          <DialogContent className="flex flex-col items-center justify-center">
            <DialogContentText id="alert-dialog-description">
              <p className="text-2xl text-center text-black font-semibold">
                Package Name: {selectedPackage.name}
              </p>
              <p className="text-2xl text-center text-black font-semibold">
                Price: {selectedPackage.price} VND
              </p>
              <p className="text-2xl text-center text-black font-semibold">
                Duration: {selectedPackage.duration} day(s)
              </p>
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              <p className="text-2xl">Do you want to buy this package?</p>
            </DialogContentText>
          </DialogContent>
        </div>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              setOpenPopUp(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handlePackageSubmit()}
          >
            Buy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Packages;
