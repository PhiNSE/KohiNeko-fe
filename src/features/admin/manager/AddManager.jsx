import { useState, useEffect } from "react";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller } from "react-hook-form";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { HiOutlineEye } from "react-icons/hi";

const AddManager = ({
  register,
  reset,
  watch,
  setValue,
  onFormUpdate,
  control,
}) => {
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const username = watch("username");
  const email = watch("email");
  const dob = watch("dateOfBirth");
  const gender = watch("gender");
  const [phone, setPhone] = useState();
  const [showPassword, setShowPassword] = useState(true);

  // reset form after submit
  useEffect(() => {
    reset({
      dateOfBirth: null,
      firstName: null,
      lastName: null,
      gender: null,
      email: null,
      phoneNumber: null,
      username: null,
    });
  }, []);

  useEffect(() => {
    setValue("phoneNumber", phone);
  }, [phone]);

  // this use to check if all fields are filled
  useEffect(() => {
    const isFormFilled =
      firstName !== "" &&
      lastName !== "" &&
      username !== "" &&
      dob &&
      phone !== "" &&
      email !== "" &&
      gender !== "";
    onFormUpdate(isFormFilled);
  }, [
    watch,
    firstName,
    dob,
    lastName,
    phone,
    username,
    email,
    gender,
    onFormUpdate,
  ]);
  const handlePhoneChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setPhone(numericValue);
  };
  return (
    <>
      <div className="mt-2">
        <p className="text-2xl">First name</p>
        <TextField
          label="Input First Name"
          color="primary"
          fullWidth
          required
          margin="normal"
          {...register("firstName")}
        />

        <p className="text-2xl">Last Name</p>
        <TextField
          label="Input Last Name"
          color="primary"
          fullWidth
          required
          margin="normal"
          {...register("lastName")}
        />

        <p className="text-2xl">Username</p>
        <TextField
          label="Input Username"
          color="primary"
          fullWidth
          required
          margin="normal"
          {...register("username")}
        />

        <p className="text-2xl">Password</p>
        <TextField
          label="Password"
          type={showPassword ? "password" : "text"}
          color="warning"
          required
          autoComplete="current-password"
          fullWidth
          margin="normal"
          {...register("password", {})}
          InputProps={{
            endAdornment: (
              <div
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
              </div>
            ),
          }}
        />

        <p className="text-2xl mt-2">Email</p>
        <TextField
          label="Input Email"
          color="primary"
          fullWidth
          required
          margin="normal"
          {...register("email")}
        />
        <p className="text-2xl">Phone number</p>
        <TextField
          label="Add phone number"
          color="primary"
          fullWidth
          required
          margin="normal"
          onChange={(event) => handlePhoneChange(event)}
          value={phone}
        />

        <p className="text-2xl pb-4">Date of Birth</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Date of Birth"
                margin="normal"
                format="DD/MM/YYYY"
                sx={{ width: "100%" }}
                value={value}
                onChange={(date) => onChange(date || null)}
              />
            )}
          />
        </LocalizationProvider>

        <p className="text-2xl">Gender</p>
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Choose gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Choose gender"
            color="primary"
            margin="normal"
            required
            {...register("gender")}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>
      </div>
    </>
  );
};

export default AddManager;
