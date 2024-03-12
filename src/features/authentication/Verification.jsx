import { useRef, useState, useEffect } from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP } from '../../services/apiOTP';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toastError, toastSuccess } from '../../components/Toast';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IoIosWarning } from 'react-icons/io';
import Loader from '../../components/Loader';
import { MdOutlineEmail } from 'react-icons/md';
import cuteCat from '../../assets/catPngHome.png';
import {
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../../services/apiLogin';
import { HiOutlineEyeSlash, HiOutlineEye } from 'react-icons/hi2';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import dayjs from 'dayjs';
import { PiKeyReturnBold } from 'react-icons/pi';

function getSteps() {
  return ['Email', 'OTP Code', 'Verify successfully'];
}

const Verification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [openExist, setOpenExist] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email: formEmail || '',
    },
  });

  const emailValue = watch('email');

  const signUp = useMutation({ mutationFn: signup });
  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await signUp.mutateAsync(data);
      if (response.status === 201 || response.status === 200) {
        console.log(response);
        const accessToken = response.data.accessToken;
        localStorage.setItem('Authorization', accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
        toastSuccess(response.message);
      } else {
        toastError(response.message + ' ' + response.data);
      }
    } catch (error) {
      console.log(error);
      toastError('An error occurred');
    }
    setLoading(true);
  };

  const handleClickOpenExist = () => {
    setOpenExist(true);
  };
  const handleCloseExist = () => {
    setOpenExist(false);
  };
  //* Stepped Form
  const [activeStep, setActiveStep] = useState(0);
  const [trigger, setTrigger] = useState(false);
  const steps = getSteps();

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const inputsRef = useRef([]);
  const focusNextInput = (index) => {
    if (index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleOTP = async () => {
    setIsLoading(true);
    try {
      const response = await sendOTP(email);
      if (!email) {
        toastError('Please enter your email');
        return;
      }

      if (response.status !== 200) {
        throw new Error(response.message || 'An error occurred');
      }
      handleNext();
    } catch (error) {
      console.error(error);
      handleClickOpenExist(); // Open the modal here
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await verifyOTP(email, otp);
      if (response.status === 200) {
        setValue('email', email);
        toastSuccess('Verify successfully');
        handleNext();
      } else {
        toastError(response.message);
      }
    } catch (error) {
      console.error(error);
      toastError(error.response ? error.response.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await sendOTP(email);
      if (response.status !== 200) {
        throw new Error(response.message || 'An error occurred');
      }
      toastSuccess('Resend OTP successfully');
    } catch (error) {
      console.error(error);
      handleClickOpenExist(); // Open the modal here
    } finally {
      setIsLoading(false);
    }
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div className='flex flex-col items-center justify-center h-[70vh] gap-3'>
            <h2 className='text-primary font-semibold'>
              We will send a verification code to your email
            </h2>
            <div className='text-2xl text-secondary font-bold flex gap-3 items-center'>
              <MdOutlineEmail />
              <h3>Get the code right away</h3>
            </div>
            <input
              className='p-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-orange-900 w-full md:w-1/2'
              type='email'
              placeholder='Your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className='w-1/2'>
              <Button type='large' onClick={() => handleOTP()}>
                Get OTP
              </Button>
            </div>
            <p>or</p>
            <div className='w-1/2'>
              <Button type='large' levelType='secondary' to='/login'>
                Already have account ?
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className='flex flex-col items-center justify-center h-[70vh] gap-3'>
            <p className='text-lg text-gray-500'>
              A 6-digit code has been sent to your email. Please check it.
            </p>
            <p className='text-md'>
              <span className='text-gray-500'>Did not get the code ? </span>
              {''}
              <span
                className='text-primary hover:underline cursor-pointer'
                onClick={handleResendOTP}
              >
                Resend now !
              </span>
            </p>
            <div className='flex justify-center space-x-2'>
              {Array(6)
                .fill()
                .map((_, i) => (
                  <input
                    key={i}
                    ref={(ref) => (inputsRef.current[i] = ref)}
                    className='w-12 h-12 p-2 border border-primary rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-900'
                    type='tel'
                    maxLength='1'
                    min='0'
                    max='9'
                    pattern='[0-9]{1}'
                    onChange={(e) => {
                      // Update the otp state when the input value changes
                      setOtp(
                        (prevOtp) =>
                          prevOtp.slice(0, i) +
                          e.target.value +
                          prevOtp.slice(i + 1)
                      );
                      // If the input value is deleted, update the otp state
                      if (e.target.value === '') {
                        setOtp(
                          (prevOtp) =>
                            prevOtp.slice(0, i) + prevOtp.slice(i + 1)
                        );
                      } else {
                        // Only move focus to the next input field if the input value is not deleted
                        focusNextInput(i);
                      }
                    }}
                    onKeyPress={(e) => {
                      // Prevent non-numeric input
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      // Ensure that each input field only contains one character
                      e.target.value = e.target.value.slice(0, 1);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      // Get pasted data
                      let paste = e.clipboardData.getData('text');
                      // Split pasted data and set it to the otp state
                      let pastedOtp = paste.split('');
                      for (let j = 0; j < 6; j++) {
                        if (j >= pastedOtp.length) break;
                        inputsRef.current[j].value = pastedOtp[j];
                      }
                      // Update the otp state with the pasted data
                      setOtp(pastedOtp.join(''));
                    }}
                    onKeyUp={(e) => {
                      if (e.key === 'Backspace' && e.target.value === '') {
                        const nextInput = inputsRef.current[i - 1];
                        if (nextInput) {
                          nextInput.focus();
                        }
                      }
                    }}
                    style={{ WebkitAppearance: 'textfield' }}
                  />
                ))}
            </div>
            <div className='w-1/2 flex flex-col gap-5'>
              <Button type='large' onClick={handleVerify}>
                Verify code
              </Button>
              <Button type='large' levelType='secondary' onClick={handleBack}>
                Return
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <div className='px-20 flex flex-col gap-9'>
              <Typography
                className='font-bold text-center text-primary '
                variant='h5'
                mb={1}
              >
                Sign up now to get your experience at our cat coffee shop
              </Typography>

              <div>
                {/* input user's information form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <TextField
                            label='First Name'
                            color='warning'
                            fullWidth
                            required
                            margin='normal'
                            {...register('firstName', {
                              pattern: {
                                value: /^[A-Za-z]+$/i,
                                message: 'Invalid First Name format',
                              },
                            })}
                            className='w-full p-2 border border-gray-300 rounded-md'
                          />
                          <Typography variant='h7' className='text-red-500'>
                            {errors.firstName?.message}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label='Last Name'
                            color='warning'
                            fullWidth
                            required
                            margin='normal'
                            {...register('lastName', {
                              pattern: {
                                value: /^[A-Za-z]+$/i,
                                message: 'Invalid Last Name format',
                              },
                            })}
                            className='w-full p-2 border border-gray-300 rounded-md'
                          />
                          <Typography variant='h7' className='text-red-500'>
                            {errors.lastName?.message}
                          </Typography>
                        </Grid>
                      </Grid>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                          name='dateOfBirth'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, value } }) => (
                            <DatePicker
                              label='Date of Birth'
                              margin='normal'
                              format='DD/MM/YYYY'
                              maxDate={dayjs()} // use dayjs() to get the current date
                              sx={{ width: '100%' }}
                              value={value}
                              onChange={(date) =>
                                onChange(
                                  date ? date.toDate().toISOString() : null
                                )
                              }
                              error={!!errors.date}
                              slotProps={{
                                textField: {
                                  helperText: errors.date
                                    ? 'Date is required'
                                    : null,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>

                      <TextField
                        label='Phone'
                        type='string'
                        color='warning'
                        fullWidth
                        margin='normal'
                        required
                        {...register('phoneNumber')}
                        className='w-full p-2 border border-gray-300 rounded-md'
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />

                      <FormControl
                        fullWidth
                        className='w-full p-2 border border-gray-300 rounded-md'
                      >
                        <InputLabel id='demo-simple-select-label'>
                          Gender
                        </InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Gender'
                          color='warning'
                          margin='normal'
                          required
                          {...register('gender')}
                        >
                          <MenuItem value='male'>Male</MenuItem>
                          <MenuItem value='female'>Female</MenuItem>
                        </Select>
                      </FormControl>
                      <Typography
                        variant='h7'
                        className='text-red-500'
                      ></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {/* Second column with 4 fields */}
                      <Controller
                        name='email'
                        control={control}
                        defaultValue='example@example.com' // replace with the actual email value
                        rules={{
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: 'Invalid email format',
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Email'
                            fullWidth
                            required
                            margin='normal'
                            inputProps={{ readOnly: true }}
                            style={{ backgroundColor: '#f0f0f0' }} // replace with the color you want
                            className='w-full p-2 border border-gray-300 rounded-md'
                          />
                        )}
                      />
                      <Typography variant='h7' className='text-red-500'>
                        {errors.email?.message}
                      </Typography>

                      <TextField
                        label='Username'
                        color='warning'
                        fullWidth
                        required
                        margin='normal'
                        {...register('username', {
                          pattern: {
                            value: /^[A-Za-z0-9]+$/i,
                            message: 'Invalid UserName format',
                          },
                        })}
                        className='w-full p-2 border border-gray-300 rounded-md'
                      />
                      <Typography variant='h7' className='text-red-500'>
                        {errors.username?.message}
                      </Typography>

                      <TextField
                        label='Password'
                        type={showPassword ? 'text' : 'password'}
                        color='warning'
                        required
                        autoComplete='current-password'
                        fullWidth
                        margin='normal'
                        {...register('password', {
                          pattern: {
                            value:
                              /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                            message:
                              'Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.',
                          },
                        })}
                        InputProps={{
                          endAdornment: (
                            <div
                              className='cursor-pointer'
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <HiOutlineEyeSlash />
                              ) : (
                                <HiOutlineEye />
                              )}
                            </div>
                          ),
                        }}
                        className='w-full p-2 border border-gray-300 rounded-md'
                      />
                      <Typography variant='h7' className='text-red-500'>
                        {errors.password?.message}
                      </Typography>

                      <TextField
                        label='Confirm password'
                        type={showConfirmPassword ? 'text' : 'password'}
                        color='warning'
                        required
                        autoComplete='current-password'
                        fullWidth
                        margin='normal'
                        {...register('passwordConfirm', {
                          validate: (value) =>
                            value === getValues('password') ||
                            'The passwords do not match',
                        })}
                        InputProps={{
                          endAdornment: (
                            <div
                              className='cursor-pointer'
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <HiOutlineEyeSlash />
                              ) : (
                                <HiOutlineEye />
                              )}
                            </div>
                          ),
                        }}
                        className='w-full p-2 border border-gray-300 rounded-md'
                      />
                    </Grid>
                  </Grid>
                  <div className='mt-4 flex justify-center items-center'>
                    <Button
                      type='medium'
                      // type='submit'
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    >
                      Create
                    </Button>
                  </div>
                </form>

                <div className='mt-4 flex flex-row items-center justify-around'>
                  <hr className='w-full basis-2/5 border-t border-gray-300'></hr>
                  <p className='basis-1/10w-fit p-0 m-0'>or</p>
                  <hr className='w-full basis-2/5 border-t border-gray-300'></hr>
                </div>
                <div className='flex flex-row justify-center mt-4 gap-3 pb-20'>
                  <Typography>Already have an account?</Typography>
                  <Link onClick={() => navigate('/login')} underline='hover'>
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return <h1></h1>;
    }
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='grid grid-cols-[1fr_4fr] justify-items-center align-items-center w-full h-screen'>
          <div className='flex flex-col items-center justify-center w-full bg-orange-100 '>
            <div className='p-8 border-r border-gray-100 grid grid-rows-1 gap-9 items-center justify-items-center w-full'>
              <Logo />
              <Stepper activeStep={activeStep} orientation='vertical'>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel className='text-5xl'>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div
                onClick={() => {
                  navigate(-1);
                }}
                className=' flex items-center px-9 py-2 gap-1 text-white bg-red-500 rounded hover:bg-red-600'
              >
                <PiKeyReturnBold className='inline-block' />
                Return
              </div>
            </div>
          </div>
          <div className='bg-orange-50 w-full'>
            <div>
              <h1 className='text-5xl font-bold text-center text-primary pt-3'>
                Welcome to Kohi Neko
              </h1>
            </div>
            <div>{getStepContent(activeStep)}</div>
          </div>
        </div>
      )}
      {/* Existing Dialog */}
      <Dialog
        open={openExist}
        keepMounted
        onClose={handleCloseExist}
        aria-describedby='alert-dialog-slide-description'
      >
        <div className='flex items-center justify-center text-blue-600 font-semibold gap-3'>
          <IoIosInformationCircleOutline size='2rem' />
          <h1>Oops! Your account seems to already exist.</h1>
        </div>
        <DialogContent className='bg-white p-6 rounded-lg'>
          <DialogContentText
            id='alert-dialog-slide-description'
            className='text-gray-700 text-lg'
          >
            Your account seems to already exist. You can return to the sign up
            page or continue here.
          </DialogContentText>
          <div className='flex justify-between space-x-4 mt-6'>
            <Button levelType='secondary' onClick={handleCloseExist}>
              Continue Here
            </Button>
            <Button
              className='bg-green-500 text-white rounded-lg px-6 py-2'
              onClick={() => navigate('/login')}
            >
              Return to Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Verification;
