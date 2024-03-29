import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { HiOutlineMinus, HiOutlinePlay, HiOutlinePlus } from "react-icons/hi";
import QuantityControl from "../../../components/QuantityControl";
import { set } from "react-hook-form";
import { moneyFormat } from "../../../utils/moneyFormater";

const AddTable = ({ register, reset, setValue, watch, onFormUpdate }) => {
  const name = watch("name");
  const [price, setPrice] = useState();
  const [minSeats, setMinSeats] = useState(1);
  const [maxSeats, setMaxSeats] = useState(1);

  useEffect(() => {
    setValue("price", Number(price));
    setValue("minNumberOfSeats", Number(minSeats));
    setValue("maxNumberOfSeats", Number(maxSeats));
  }, [price, minSeats, maxSeats]);

  // reset form after submit
  useEffect(() => {
    reset({
      name: null,
      price: null,
      minNumberOfSeats: null,
      maxNumberOfSeats: null,
    });
  }, []);

  // this use to check if all fields are filled
  useEffect(() => {
    console.log(minSeats, maxSeats);
    const isFormFilled =
      name &&
      minSeats <= maxSeats &&
      minSeats > 0 &&
      maxSeats > 0 &&
      price;
    onFormUpdate(isFormFilled);
  }, [watch, name, price, minSeats, maxSeats, onFormUpdate]);

  const handlePriceChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setPrice(numericValue);
  };
  return (
    <>
      <div className="mt-2">
        <p className="text-2xl">Name</p>
        <TextField
          label="Name"
          color="primary"
          fullWidth
          required
          margin="normal"
          {...register("name")}
        />

        <p className="text-2xl">Price (VND) / 1 hour</p>
        <TextField
          label="Input price / 1 hour"
          color="primary"
          fullWidth
          required
          margin="normal"
          onChange={(event) => handlePriceChange(event)}
          value={price && moneyFormat(price)}

        />
        <p className="text-2xl">Min number of seat</p>
        <QuantityControl
          value={minSeats || 1}
          onIncrement={() => setMinSeats(Math.min((minSeats || 1) + 1, 10))}
          onDecrement={() => setMinSeats(Math.max((minSeats || 1) - 1, 1))}
        />

        <p className="text-2xl">Max number of seat</p>
        <QuantityControl
          value={maxSeats || 1}
          onIncrement={() => setMaxSeats(Math.min((maxSeats || 1) + 1, 10))}
          onDecrement={() =>
            setMaxSeats(Math.max((maxSeats || 1) - 1, minSeats || 1))
          }
        />
      </div>
    </>
  );
};

export default AddTable;
