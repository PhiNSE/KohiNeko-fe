import { useState, useEffect, useContext } from "react";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import GetImage from "../../../components/GetImage";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, set } from "react-hook-form";
import { HiChevronDown, HiOutlineMinus } from "react-icons/hi";
import { getAreasInAShop } from "../../../services/apiArea";
import { ManagerContext } from "../ManagerContext";
import dayjs from "dayjs";
import LazyLoadImage from "../../../components/LazyLoadImage";
import { getCatsInArea } from "../../../services/apiArea";
import { checkStaffMail } from "../../../services/apiStaff";

const AddStaff = ({
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
  const [emailError, setEmailError] = useState(false);

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

  useEffect(() => {
    const fetchEmail = async () => {
      if (email) {
        const result = await checkStaffMail(email);
        if (result.status === 500) {
          setEmailError(true);
        } else {
          setEmailError(false);
        }
      }
    };
    fetchEmail();
  }, [email]);

  // this use to check if all fields are filled
  useEffect(() => {
    const isFormFilled =
      firstName !== "" &&
      lastName !== "" &&
      username !== "" &&
      dob &&
      phone !== "" &&
      email &&
      emailError === false &&
      gender;
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
    emailError,
    onFormUpdate,
  ]);
  const handlePhoneChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setPhone(numericValue);
  };
  return (
    <>
      <div className="mt-2">
        <Typography variant="h6">First name</Typography>
        <TextField
          label="Input First Name"
          color="primary"
          fullWidth
          required
          margin="normal"
          {...register("firstName")}
        />

        <Typography variant="h6">Last Name</Typography>
        <TextField
          label="Input Last Name"
          color="primary"
          fullWidth
          required
          margin="normal"
          {...register("lastName")}
        />

        <Typography variant="h6">Username</Typography>
        <TextField
          label="Input Username"
          color="primary"
          fullWidth
          required
          margin="normal"
          {...register("username")}
        />

        <Typography variant="h6">Email</Typography>
        <TextField
          label="Input Email"
          color="primary"
          fullWidth
          required
          margin="normal"
          {...register("email")}
          error={emailError}
          helperText={emailError ? "Email already existed" : ""}
        />

        <Typography variant="h6">Phone number</Typography>
        <TextField
          label="Add phone number"
          color="primary"
          fullWidth
          required
          margin="normal"
          onChange={(event) => handlePhoneChange(event)}
          value={phone}
        />

        <Typography variant="h6" sx={{ pb: 2 }}>
          Date of Birth
        </Typography>
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
                disableFuture
                value={value}
                onChange={(date) => onChange(date || null)}
              />
            )}
          />
        </LocalizationProvider>

        <Typography variant="h6">Gender</Typography>
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

export default AddStaff;
