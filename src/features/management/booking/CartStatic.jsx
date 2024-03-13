import { Grid, TextField, Typography } from "@mui/material";
import FormatNumber from "../../../utils/NumberFormatter";
import { HiOutlineX } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyBox from "../../../assets/empty_box.png";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";

import Currency from "../../../components/Currency";
import emptyImg from "../../../assets/EmptyImg.jpg";

const CartStatic = ({ selectedItems, bookingStatus }) => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState();
  const { register, handleSubmit, setValue, getValues } = useForm();
  // const CreateInvoice = useMutation({ mutationFn: createInvoice });

  const onSubmit = async () => {
    setValue("items", selectedItems);
    console.log(selectedItems.data);
    localStorage.setItem("items", JSON.stringify(selectedItems));
    navigate("/purchase");
  };

  useEffect(() => {
    // const total = selectedItems.reduce(
    //   (asc, item) => asc + Number(item.price) * Number(item.quantity),
    //   0
    // );
    // setTotalPrice(total);
    selectedItems.forEach((invoiceItem) => {
      console.log(invoiceItem);
    });
  }, [selectedItems]);

  function combineItems(selectedItems) {
    // Flatten the array of invoiceItems
    const items = selectedItems.flatMap(
      (invoiceItem) => invoiceItem.invoiceItems
    );

    const combinedItems = {};

    items.forEach((item) => {
      console.log(item);
      if (combinedItems[item.itemId._id]) {
        combinedItems[item.itemId._id].totalPrice += item.totalPrice;
        combinedItems[item.itemId._id].quantity += item.quantity;
      } else {
        combinedItems[item.itemId._id] = { ...item };
      }
    });
    // console.log(Object.values(combinedItems));
    return Object.values(combinedItems);
  }
  const combinedItems = combineItems(selectedItems);

  return (
    // <></>
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {selectedItems.length !== 0 ? (
          <div className="border-t-4 border-orange-400 pt-2">
            <Grid sx={{ mb: 2 }} container spacing={3} alignItems="center">
              <Grid container item xs={18}>
                <Grid item xs={3}>
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
              {combinedItems.length > 0 &&
                combinedItems.map((item, idx) => (
                  <Grid container item xs={12} key={idx}>
                    <Grid
                      item
                      xs={3}
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <div className="h-20 w-24">
                        <img
                          src={
                            item.itemId?.images[0]?.url
                              ? item.itemId.images[0].url
                              : emptyImg
                          }
                          alt={item.itemId.name}
                          className="w-full h-full object-cover rounded-large"
                        />
                      </div>

                      <span className="text-xl text-center ">
                        {item.itemId.name}
                      </span>
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <div className="border-2 border-orange-300 rounded-xl p-4 text-xl">
                        {item.quantity || 1}
                      </div>
                      {/* <QuantityControl value={item.quantity || 1} /> */}
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
                        {FormatNumber(item.totalPrice)}
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
                    ></Grid>
                  </Grid>
                ))}
            </Grid>

            <>
              <hr />
              {/* <div className="mt-2 flex flex-row justify-end">
                <Typography variant="h5" fontWeight="bold">
                  Total:{" "}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {totalPrice ? FormatNumber(totalPrice) : 0} VND
                </Typography>
              </div> */}
            </>
          </div>
        ) : (
          <div className="w-full h-auto flex flex-col justify-center items-center">
            <img
              src={EmptyBox}
              alt="empty box"
              className="h-60 w-60 object-cover rounded-large"
            />
            {/* <Typography variant="h6" fontWeight="bold">
              Your cart is empty
            </Typography> */}
          </div>
        )}

        {/* <div className="mt-5 mb-4">
          <Button
            fullWidth
            variant="contained"
            color="warning"
            style={{ borderRadius: "50px" }}
            type="submit"
            //   onClick={() => handleCheckOut(selectedItems)}
          >
            Check out
          </Button>
        </div> */}
      </form>
    </>
  );
};

export default CartStatic;
