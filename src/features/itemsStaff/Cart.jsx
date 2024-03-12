import {
  Grid,
  TextField,
  Typography,
  Button,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import FormatNumber from "../../utils/NumberFormatter";
import { HiOutlineX } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyBox from "../../assets/empty_box.png";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createInvoice } from "../../services/apiInvoice";
import { FaTrashCan } from "react-icons/fa6";
import LazyLoadImage from "../../components/LazyLoadImage";
import QuantityControl from "../../components/QuantityControl";
import Currency from "../../components/Currency";
import emptyImg from "../../assets/EmptyImg.jpg";
import { redirectVnPay } from "../../services/apiInvoice";
import { useParams } from "react-router-dom";
import { SlArrowLeftCircle } from "react-icons/sl";
import { toastError, toastSuccess } from "../../components/Toast";

const Cart = ({ selectedItems, setSelectedItems, handleUpdateItem }) => {
  const navigate = useNavigate();
  const bookingId = useParams();
  const [totalPrice, setTotalPrice] = useState();
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm();
  // const CreateInvoice = useMutation({ mutationFn: createInvoice });

  const removeItem = (itemToRemove) => {
    setSelectedItems((prevItems) => {
      return prevItems.filter((item) => item !== itemToRemove);
    });
  };

  const onSubmit = async () => {
    const invoice = {
      items: selectedItems.map((item) => ({
        itemId: item._id,
        quantity: item.quantity,
      })),
      paymentMethod: paymentMethod,
    };
    console.log(invoice);
    if (paymentMethod === "VNPAY") {
      const redirectUrl = await redirectVnPay(bookingId, invoice.items);
      if (redirectUrl.status === 200) {
        const url = redirectUrl.data;
        console.log(url);
        window.location.href = url;
      }
    } else if (paymentMethod === "Cash") {
      const invoice = {
        items: selectedItems.map((item) => ({
          itemId: item._id,
          quantity: item.quantity,
        })),
        paymentMethod: paymentMethod,
      };
      const res = await createInvoice(bookingId, invoice.items);
      if (res.status === 200) {
        toastSuccess("Purchased successfully");
        navigate(`/staff/booking/${bookingId.bookingId}`);
      } else {
        toastError("Purchased failed");
        navigate(`/staff/booking/${bookingId.bookingId}`);
      }
    }
  };

  useEffect(() => {
    const total = selectedItems.reduce(
      (asc, item) => asc + Number(item.price) * Number(item.quantity),
      0
    );
    setTotalPrice(total);
  }, [selectedItems]);

  const [quantities, setQuantities] = useState({});
  // const handleQuantityChange = (id, quantity) => {
  //   setQuantities((prevQuantities) => ({ ...prevQuantities, [id]: quantity }));
  // };
  const handleQuantityChange = (id, quantity) => {
    handleUpdateItem(id, quantity);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {selectedItems.length !== 0 ? (
          <div className="my-2">
            <Grid sx={{ mb: 2 }} container spacing={1} alignItems="center">
              <Grid container item xs={12}>
                <Grid item xs={2}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    style={{ textTransform: "uppercase" }}
                  >
                    Item
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    style={{ textTransform: "uppercase" }}
                  >
                    Quantity
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    style={{ textTransform: "uppercase" }}
                  >
                    Price
                  </Typography>
                </Grid>
              </Grid>

              {selectedItems.length > 0 &&
                selectedItems.map((item, idx) => (
                  <Grid container item xs={12} key={idx}>
                    <Grid
                      item
                      xs={2}
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <div className="h-20 w-20">
                        <img
                          src={
                            item?.images[0]?.url ? item.images[0].url : emptyImg
                          }
                          alt={item.name}
                          className="w-full h-full object-cover rounded-large"
                        />
                      </div>

                      <span className="text-l text-center ">{item.name}</span>
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <QuantityControl
                        value={item.quantity || 1}
                        onIncrement={() =>
                          handleQuantityChange(
                            item._id,
                            (item.quantity || 1) + 1
                          )
                        }
                        onDecrement={() =>
                          handleQuantityChange(
                            item._id,
                            Math.max((item.quantity || 1) - 1, 1)
                          )
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      textAlign="center"
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography variant="h6">
                        {FormatNumber(item.price)}
                        <Currency>VND</Currency>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      textAlign="center"
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <FaTrashCan
                        size={24}
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => removeItem(item)}
                      />
                    </Grid>
                  </Grid>
                ))}
            </Grid>

            <>
              <hr />
              <div className="mt-2 flex flex-row justify-between">
                <div>
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
                    <MenuItem value="Cash">Cash</MenuItem>
                  </Select>
                </div>
                <div className="flex flex-row">
                  <Typography variant="h5" fontWeight="bold">
                    Total:{" "}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {totalPrice ? FormatNumber(totalPrice) : 0} VND
                  </Typography>
                </div>
              </div>
            </>
          </div>
        ) : (
          <div className="w-full h-auto flex flex-col justify-center items-center">
            <img
              src={EmptyBox}
              alt="empty box"
              className="h-60 w-60 object-cover rounded-large"
            />
            <Typography variant="h6" fontWeight="bold">
              Your cart is empty
            </Typography>
          </div>
        )}

        <div className="mt-5 mb-4">
          <Button
            fullWidth
            variant="contained"
            color="warning"
            style={{ borderRadius: "50px" }}
            type="submit"
            disabled={isSubmitting || selectedItems.length === 0}
            //   onClick={() => handleCheckOut(selectedItems)}
          >
            Check out
          </Button>
        </div>
      </form>
    </>
  );
};

export default Cart;
