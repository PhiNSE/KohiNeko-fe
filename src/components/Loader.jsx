import Backdrop from '@mui/material/Backdrop';
import { useState } from 'react';

const Loader = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className='flex justify-center items-center h-screen relative'>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      ></Backdrop>
      <div
        className='relative flex justify-center items-center'
        style={{ zIndex: 2000 }}
      >
        <div className='absolute animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary'></div>
        <img
          src='https://img.freepik.com/free-vector/cute-cat-laying-down-floor-cartoon-vector-icon-illustration-animal-nature-icon-isolated_138676-4611.jpg?w=740&t=st=1705299493~exp=1705300093~hmac=870f70c36341219e09514e4269063e6eb3149ec93ac655fca527b0ddb4d12e0f'
          className='rounded-full h-16 w-16'
          alt='Avatar'
        />
      </div>
    </div>
  );
};

export default Loader;
