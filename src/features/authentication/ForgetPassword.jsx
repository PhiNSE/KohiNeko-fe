import { useState } from 'react';
import Logo from '../../components/Logo';
import checkMail from '../../assets/checkMail.png';
import { MdOutlineLockReset } from 'react-icons/md';
import Button from '../../components/Button';
import { forgotPassword } from '../../services/apiResetPassword';
import { useMutation } from '@tanstack/react-query';
import { toastError, toastSuccess } from '../../components/Toast';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';

function getSteps() {
  return ['Email', 'OTP Code'];
}
const ForgetPassword = () => {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(user ? user.email : '');
  const [openExistModal, setOpenExistModal] = useState(false);
  const handleClickOpenExist = () => {
    setOpenExistModal(true);
  };
  const handleCloseExist = () => {
    setOpenExistModal(false);
  };
  //* Stepped Form
  const [activeStep, setActiveStep] = useState(0);
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const mutation = useMutation({
    mutationFn: forgotPassword,
    onError: () => {
      toastError('Mail sent failed');
    },
    onSuccess: (data) => {
      if (data.data.status === 500) {
        handleClickOpenExist();
      }
      if (data.data.status === 200) {
        toastSuccess('Mail sent successfully');
        if (activeStep === 0) {
          handleNext();
        }
      }
    },
  });

  function handleGetResetToken(userEmail) {
    mutation.mutate(userEmail);
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div className='flex flex-col gap-3 justify-center items-center'>
            <h3 className='max-w-md text-center'>
              Enter your email address first and we&apos;ll send you
              instructions to reset your password
            </h3>

            <TextField
              type='email'
              placeholder='Enter your email'
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
              fullWidth
              variant='outlined'
            />
            {userEmail && (
              <Button
                type='medium'
                onClick={() => handleGetResetToken(userEmail)}
              >
                Confirm Email
              </Button>
            )}
            <Button
              type='medium'
              levelType='secondary'
              onClick={() => navigate(-1)}
            >
              Return
            </Button>
          </div>
        );
      case 1:
        return (
          <>
            <h1 className=' font-semibold text-center mb-4'>Check email</h1>
            <p className='text-center max-w-md text-gray-500'>
              We have sent a password reset link to{' '}
              <span className='font-semibold'>{userEmail}</span>. Please check
              your inbox and follow the instructions to reset your password. If
              you don&apos;t receive email,{' '}
              <span
                className='text-primary hover:underline cursor-pointer'
                onClick={() => handleGetResetToken(userEmail)}
              >
                click here to resend !
              </span>
            </p>
            <div className='flex flex-col justify-center items-center max-w-lg'>
              <img src={checkMail} alt='Email sent' className=' h-64 w-64' />
              <Button type='medium' levelType='secondary' onClick={handleBack}>
                Go Back
              </Button>
            </div>
          </>
        );

      default:
        return <h1></h1>;
    }
  }
  return (
    <>
      <div className='bg-orange-100 flex justify-center items-center h-screen'>
        <div className='flex  justify-center items-center  flex-col gap-3 py-6 '>
          <Logo />
          <div className='flex items-center gap-2 font-semibold text-primary'>
            <h1>Reset Your Password</h1>
            <MdOutlineLockReset size='2rem' />
          </div>
          <div>{getStepContent(activeStep)}</div>
        </div>
      </div>

      <Dialog
        open={openExistModal}
        onClose={handleCloseExist}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className='p-6'>
          <h2 className='text-lg font-semibold text-gray-700'>
            Email not found
          </h2>
          <p className='mt-2 text-sm text-gray-600'>Do you want to sign up?</p>
          <div className='mt-4 flex justify-between space-x-4'>
            <Button
              onClick={handleCloseExist}
              levelType='secondary'
              className='w-1/2'
            >
              Disagree
            </Button>
            <Button
              onClick={() => navigate('/verification')}
              autoFocus
              className='w-1/2'
            >
              Agree
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ForgetPassword;
