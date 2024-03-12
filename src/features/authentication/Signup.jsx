import { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import image from '../../assets/authentication.jpg';
import logo from '../../assets/logo2.png';
import google from '../../assets/google.png';
import { HiOutlineEyeSlash } from 'react-icons/hi2';
import { HiOutlineEye } from 'react-icons/hi2';
import Button from '../../components/Button';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../../services/apiLogin';
import { toastError, toastSuccess } from '../../components/Toast';
import LazyLoadImage from '../../components/LazyLoadImage';
import Loader from '../../components/Loader';
import Logo from '../../components/Logo';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedEmail = location.state?.email || '';
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm({
    defaultValues: {
      email: verifiedEmail, // Set the verified email as the default value
    },
  });
  const signUp = useMutation({ mutationFn: signup });

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await signUp.mutateAsync(data);
      if (response.status === 201 || response.status === 200) {
        const accessToken = response.accessToken;
        localStorage.setItem("Authorization", accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
        toastSuccess(response.message);
      } else {
        toastError(response.message + " " + response.data);
      }
    } catch (error) {
      console.log(error);
      toastError("An error occurred");
    }
    setLoading(true);
  };
  return loading ? (
    <Loader />
  ) : (
    <Grid container spacing={2} className="bg-orange-100">
      <Grid item xs={5}>
        <div className='p-10 flex justify-center'>
          <NavLink to='/'>
            <Logo />
          </NavLink>
        </div>
        <div className="px-20">
          <Typography className="font-bold" variant="h4" mb={1}>
            Sign up
          </Typography>
          <Typography className="text-gray-500" variant="h7">
            Sign up to enjoy the feature of our shop
          </Typography>

          {/* input user's information form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="First Name"
              color="warning"
              fullWidth
              required
              margin="normal"
              {...register("firstName", {
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: "Invalid First Name format",
                },
              })}
            />
            <Typography variant="h7" className="text-red-500">
              {errors.firstName?.message}
            </Typography>
            <TextField
              label="Last Name"
              color="warning"
              fullWidth
              required
              margin="normal"
              {...register("lastName", {
                pattern: {
                  value: /^[A-Za-z]+$/i,
                  message: "Invalid Last Name format",
                },
              })}
            />
            <Typography variant="h7" className="text-red-500">
              {errors.lastName?.message}
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
                    value={value}
                    onChange={(date) =>
                      onChange(date ? date.toDate().toISOString() : null)
                    }
                    error={!!errors.date}
                    slotProps={{
                      textField: {
                        helperText: errors.date ? "Date is required" : null,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <TextField
              label="Phone"
              type="number"
              color="warning"
              fullWidth
              margin="normal"
              required
              {...register("phoneNumber")}
            />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Gender"
                color="warning"
                margin="normal"
                required
                {...register("gender")}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h7" className="text-red-500"></Typography>

            {/* <TextField
              label='Email'
              color='warning'
              fullWidth
              required
              margin='normal'
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email format',
                },
              })}
            /> */}
            <TextField
              label="Email"
              color="warning"
              fullWidth
              required
              margin="normal"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email format",
                },
              })}
              InputProps={{
                readOnly: verifiedEmail !== '', // Make the field read-only if the verified email is not an empty string
              }}
              style={
                verifiedEmail !== ''
                  ? { backgroundColor: 'rgba(255, 140, 0, 0.3)' } // Lighter orange color with reduced opacity
                  : {}
              }
            />
            <Typography variant="h7" className="text-red-500">
              {errors.email?.message}
            </Typography>

            <TextField
              label="Username"
              color="warning"
              fullWidth
              required
              margin="normal"
              {...register("username", {
                pattern: {
                  value: /^[A-Za-z0-9]+$/i,
                  message: "Invalid UserName format",
                },
              })}
            />
            <Typography variant="h7" className="text-red-500">
              {errors.username?.message}
            </Typography>

            <TextField
              label="Password"
              type={showPassword ? "password" : "text"}
              color="warning"
              required
              autoComplete="current-password"
              fullWidth
              margin="normal"
              {...register("password")}
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
            <Typography variant="h7" className="text-red-500">
              {errors.password?.message}
            </Typography>

            <TextField
              label="Confirm password"
              type={showConfirmPassword ? "password" : "text"}
              color="warning"
              required
              autoComplete="current-password"
              fullWidth
              margin="normal"
              {...register("passwordConfirm")}
              InputProps={{
                endAdornment: (
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeSlash />
                    ) : (
                      <HiOutlineEye />
                    )}
                  </div>
                ),
              }}
            />

            <div className="mt-4">
              <Button type="large">Create</Button>
            </div>
          </form>

          <div className="mt-4 flex flex-row items-center justify-around">
            <hr className="w-full basis-2/5 border-t border-gray-300"></hr>
            <p className="basis-1/10w-fit p-0 m-0">or</p>
            <hr className="w-full basis-2/5 border-t border-gray-300"></hr>
          </div>
          {/* <div className='mt-4'>
            <Button type='large'>
              <div className='flex flex-row justify-center'>
                <div className='mr-1'>Sign in with Google</div>
                <div className='ml-1'>
                  <img src={google} />
                </div>
              </div>
            </Button>
          </div> */}
          <div className="flex flex-row justify-center mt-4 gap-3 pb-20">
            <Typography>Already have an account?</Typography>
            <Link onClick={() => navigate("/login")} underline="hover">
              Sign in
            </Link>
          </div>
        </div>
      </Grid>
      <Grid item xs={7}>
        <div className="h-[100%] w-full">
          <LazyLoadImage src={image} />
        </div>
        {/* <img className='h-full w-screen object-cover' src={image} /> */}
      </Grid>
    </Grid>
  );
};

export default Signup;
