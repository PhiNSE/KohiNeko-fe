import { useState } from 'react';
import Logo from '../../components/Logo';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../../services/apiLogin';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '../../components/Button';

const Sidebar = ({ Menu, logoLink }) => {
  const [loading, setLoading] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const navigate = useNavigate();
  const Logout = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      localStorage.removeItem('user');
      localStorage.removeItem('Authorization');
    },
  });

  const handleClickOpenLogout = () => {
    setOpenLogout(true);
  };
  const handleCloseLogout = () => {
    setOpenLogout(false);
  };
  async function onLogout() {
    setLoading(true);
    try {
      await Logout.mutateAsync();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <aside className='p-8 pr-6 border-r border-gray-100 row-span-full flex flex-col justify-between items-center gap-5 bg-orange-100'>
        <div className='flex flex-col justify-between items-center gap-5'>
          <Link to='/staff/'>
            <Link to={logoLink}>
              <Logo />
            </Link>
          </Link>
          <Menu />
        </div>
        <div
          onClick={() => {
            // onLogout();
            handleClickOpenLogout();
          }}
          className=' flex items-center px-9 py-2 text-white bg-red-500 rounded hover:bg-red-600'
        >
          Logout
          <FaSignOutAlt className='inline-block ml-2' />
        </div>
      </aside>

      {/* Confirm logout */}
      <Dialog
        open={openLogout}
        onClose={handleCloseLogout}
        PaperProps={{
          style: {
            backgroundColor: '#f5f5f5',
            borderRadius: '15px',
            width: '80%', // Add this line
          },
        }}
      >
        <h2 className='text-center text-red-500 font-semibold uppercase'>
          {'Confirm Logout  ?'}
        </h2>

        <div className='px-2 flex justify-between items-center py-3'>
          <Button onClick={handleCloseLogout} levelType='secondary'>
            Cancel
          </Button>
          <Button onClick={onLogout} levelType='primary' autoFocus>
            Logout
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default Sidebar;
