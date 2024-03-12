import { useParams } from 'react-router-dom';
import Logo from '../../components/Logo';
import { MdOutlineLockReset } from 'react-icons/md';
import Button from '../../components/Button';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../services/apiResetPassword';
import { toastError, toastSuccess } from '../../components/Toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineEyeSlash } from 'react-icons/hi2';
import { HiOutlineEye } from 'react-icons/hi2';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const mutation = useMutation({
    mutationFn: resetPassword,
    onError: () => {
      toastError('Reset password failed');
    },
    onSuccess: (data) => {
      if (data.status === 'fail') {
        toastError(data.message);
      } else {
        toastSuccess('Reset password successfully');
        navigate('/login');
      }
    },
  });
  function handleResetPassword() {
    if (!newPassword || !confirmPassword) {
      toastError('Password and confirmation password cannot be empty');
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError('Password and confirmation password must match');
      return;
    }
    mutation.mutate({
      token,
      password: newPassword,
      passwordConfirm: confirmPassword,
    });
  }

  return (
    <div className=' bg-orange-100 h-screen flex justify-center items-center  flex-col gap-3 py-6 text-primary'>
      <Logo />
      <div className='flex items-center gap-2 font-semibold'>
        <h1>Reset Your Password</h1>A
        <MdOutlineLockReset size='2rem' />
      </div>
      <div>
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-5 items-center'>
            <TextField
              type={showNewPassword ? 'password' : 'text'}
              label='New Password'
              variant='outlined'
              value={newPassword}
              style={{
                width: '40rem',
              }}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <div
                    className='cursor-pointer'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                  </div>
                ),
              }}
            />

            <TextField
              type={showConfirmPassword ? 'password' : 'text'}
              label='Confirm New Password'
              variant='outlined'
              value={confirmPassword}
              fullWidth
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <div
                    className='cursor-pointer'
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
          </div>
          <Button
            type='large'
            onClick={() =>
              handleResetPassword(token, newPassword, confirmPassword)
            }
          >
            Update password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
