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

function getSteps() {
  return ['Email', 'OTP Code', 'Verify successfully'];
}

const Verification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [openExist, setOpenExist] = useState(false);

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
      console.log(response);
      if (response.status === 200) {
        handleNext();
      } else {
        // Display the error message from the response in a toast notification
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
          <>
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
          </>
        );
      case 1:
        return (
          <>
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
                      focusNextInput(i);
                      // Update the otp state when the input value changes
                      setOtp(
                        (prevOtp) =>
                          prevOtp.slice(0, i) +
                          e.target.value +
                          prevOtp.slice(i + 1)
                      );
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
          </>
        );
      case 2:
        return (
          <div className='w-full flex flex-col items-center justify-center'>
            <div className='flex items-center gap-3'>
              <h1 className='text-3 font-bold text-green-500'>
                Verification Successful!
              </h1>
              <FaCheck size='2rem' color='green' />
            </div>
            <p className='text-lg text-gray-500'>
              Redirecting you to the sign up page in{' '}
              <span className='font-bold text-xl'>{remainingSeconds}</span>{' '}
              seconds
            </p>
          </div>
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
            </div>
          </div>
          <div className='bg-orange-50 w-full'>
            <div>
              <h1 className='text-5xl font-bold text-center text-primary pt-3'>
                Welcome to Kohi Neko
              </h1>
            </div>
            <div className='flex flex-col gap-4 justify-center items-center w-full h-[90vh]'>
              {getStepContent(activeStep)}
            </div>
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
        <div className='flex items-center justify-center text-secondary font-semibold gap-3'>
          <IoIosWarning size='2rem' />
          <h1>Oops! Your account seems to already exist.</h1>
        </div>
        <DialogContent className='bg-white p-6 rounded-lg'>
          <DialogContentText
            id='alert-dialog-slide-description'
            className='text-gray-700 text-lg'
          >
            Oops! Your account seems to already exist. You can return to the
            sign up page or continue here.
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
