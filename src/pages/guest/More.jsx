import { useState } from 'react';
import Avatar from '@mui/material/Avatar';

function getSteps() {
  return ['Email', 'Send OTP', 'Verify OTP', 'Change Password'];
}

const More = () => {
  const [otp, setOtp] = useState('');

  const handleChange = (otp) => setOtp({ otp });

  return (
    <div className='grid grid-cols-[1fr_4fr]'>
      {/* Avatar + Usernames */}
      <div className='flex flex-col bg-gray-200 justify-center items-center'>
        <Avatar
          alt='Remy Sharp'
          src='https://via.placeholder.com/150'
          sx={{ width: 80, height: 80 }}
        />
        <h1>Username</h1>
      </div>
      {/* Other info  */}
      <div className='bg-orange-100 px-5 py-4'>
        <h2 className='font-semibold'>User Profile</h2>
      </div>
    </div>
  );
};

export default More;
