import { useState, useEffect } from "react";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import GetImage from "../../../components/GetImage";
import QuantityControl from "../../../components/QuantityControl";
import { moneyFormat } from "../../../utils/moneyFormater";

const UpdateTable = ({
  register,
  watch,
  setValue,
  onFormUpdate,
  selectedTable,
}) => {
  const name = watch("name");
  const [minSeats, setMinSeats] = useState(selectedTable?.minNumberOfSeats);
  const [maxSeats, setMaxSeats] = useState(selectedTable?.maxNumberOfSeats);
  const [price, setPrice] = useState(selectedTable?.price);

  useEffect(() => {
    setValue("price", Number(price));
    setValue("minNumberOfSeats", Number(minSeats));
    setValue("maxNumberOfSeats", Number(maxSeats));
  }, [price, minSeats, maxSeats]);

  // this use to check if all fields are filled
  useEffect(() => {
    const isFormFilled =
      name !== "" &&
      minSeats <= maxSeats &&
      minSeats > 0 &&
      maxSeats > 0 &&
      price !== "";
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

        <p className="text-2xl">Price (VND)</p>
        <TextField
          label="Input price / 1 hour"
          color="primary"
          fullWidth
          required
          margin="normal"
          onChange={(event) => handlePriceChange(event)}
          type="number"
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

export default UpdateTable;
