import { useState, useEffect } from 'react';
import {
  Checkbox,
  Grid,
  TextField,
  Typography,
  Link,
  Hidden,
} from '@mui/material';
import image from '../../assets/authentication.jpg';
import logo from '../../assets/logo.png';
import google from '../../assets/google.png';
import { HiOutlineEyeSlash } from 'react-icons/hi2';
import { HiOutlineEye } from 'react-icons/hi2';
import Button from '../../components/Button';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Logo from '../../components/Logo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleLoginCallback, login } from '../../services/apiLogin';
import { toastError, toastSuccess } from '../../components/Toast';
import { NavLink } from 'react-router-dom';
import LazyLoadImage from '../../components/LazyLoadImage';
import { DEFAULT_API_URL } from '../../utils/appConstants';
const Login = () => {
  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: login,
  // });
  const QueryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const Login = useMutation({
    mutationFn: login,
  });

  const [googleParams] = useSearchParams();

  let handleGoogleCallback = async () => {
    try {
      if (googleParams && googleParams.get('code')) {
        const response = await googleLoginCallback(googleParams);
        handleLoginNav(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGoogleCallback();
    handleGoogleCallback = () => {};
  }, [googleParams]);

  const onGoogleLogin = () => {
    window.open(`${DEFAULT_API_URL}/auth/login/google/callback`, '_self');
  };

  const handleLoginNav = (response) => {
    if (response.status === 200) {
      const accessToken = response.data.accessToken;
      localStorage.setItem('Authorization', accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log(response.data.user);
      if (response.data.user.role === 'customer') {
        navigate('/');
      } else if (response.data.user.role === 'shopManager') {
        navigate('/management/coffeeShops');
      } else if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else if (response.data.user.role === 'staff') {
        console.log('staff');
        navigate('/staff/booking');
      }
      //* After success login, refetch user data
      const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
      if (redirectAfterLogin) {
        navigate(redirectAfterLogin);
        localStorage.removeItem('redirectAfterLogin');
      } else {
        if (response.data.user.role === 'customer') {
          navigate('/');
        } else if (response.data.user.role === 'shopManager') {
          navigate('/management/coffeeShops');
        } else if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else if (response.data.user.role === 'staff') {
          navigate('/staff/booking');
        }
      }
      toastSuccess(response.message);
    } else {
      console.log(response);
      toastError(response.message);
      if (response.message === 'Email not sign up') {
        navigate('/verification');
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await Login.mutateAsync(data);
      handleLoginNav(response);
    } catch (error) {
      console.log(error);
      toastError('An error occurred');
    }
    setLoading(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className='grid grid-cols-[0.5fr_1fr] bg-orange-100'>
      {/* Form log in */}
      <Grid className='px-2 mt-6'>
        <div className='flex justify-center items-center'>
          <NavLink to='/' className=''>
            <Logo />
          </NavLink>
        </div>
        <div className='md:px-5'>
          <div className='text-center'>
            <Typography className='font-bold ' variant='h4' mb={1}>
              Sign in
            </Typography>
            <Typography className='text-gray-500 ' variant='h7'>
              Please login to continue to your account
            </Typography>
          </div>

          {/* input email & password form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label='Username'
              className='w-full'
              color='warning'
              fullWidth
              required
              margin='normal'
              {...register('username', {})}
            />
            <TextField
              label='Password'
              type={showPassword ? 'password' : 'text'}
              color='warning'
              required
              autoComplete='current-password'
              fullWidth
              margin='normal'
              {...register('password', {})}
              InputProps={{
                endAdornment: (
                  <div
                    className='cursor-pointer'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                  </div>
                ),
              }}
            />

            <div className='flex justify-between flex-row my-1'>
              <div>
                <Checkbox
                  className='p-0'
                  color='warning'
                  sx={{ p: 0 }}
                  // onChange={() => handleCheckboxChange(value)}
                />
                <Typography variant='h7'>Keep me logged in</Typography>
              </div>

              <div onClick={() => navigate('/forgot-password')}>
                <Link className='cursor-pointer'>Forget password ?</Link>
              </div>
            </div>
            <div className='mt-4'>
              <Button type='large'>Sign in</Button>
            </div>
          </form>
          <div className='mt-4 flex flex-row items-center justify-around'>
            <hr className='w-full basis-2/5 border-t border-gray-300'></hr>
            <p className='basis-1/10w-fit p-0 m-0'>or</p>
            <hr className='w-full basis-2/5 border-t border-gray-300'></hr>
          </div>
          <div className='mt-4'>
            <Link onClick={() => onGoogleLogin()} type='large'>
              <div className='flex flex-row justify-center'>
                <div className='mr-1'>Sign in with Google</div>
                <div className='ml-1'>
                  <img src={google} />
                </div>
              </div>
            </Link>
          </div>
          <div className='flex gap-2 items-center justify-center mt-4'>
            <h3>Need an account?</h3>
            <span
              className='cursor-pointer'
              onClick={() => navigate('/verification')}
            >
              <Link>Create an account</Link>
            </span>
          </div>

          <div className='flex justify-center items-center mt-3'>
            <Button
              type='large'
              levelType='secondary'
              onClick={() => navigate('/management/signup')}
            >
              Join us as a shop manager
            </Button>
          </div>
        </div>
      </Grid>
      {/* image */}

      <div className='h-[100vh] w-full'>
        {/* <img className='h-[100vh] w-screen object-cover' src={image} /> */}
        <LazyLoadImage src={image} />
      </div>
    </div>
  );
};

export default Login;
