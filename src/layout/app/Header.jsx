import Navbar from '../../components/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { useContext, useEffect, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { getUserWallet } from '../../services/apiUser';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from 'react-query';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../../services/apiLogin';
import { Avatar, IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { SlRefresh } from 'react-icons/sl';
import { FaWallet } from 'react-icons/fa';
import { set } from 'react-hook-form';
import { Typography } from '@mui/material';
import { WalletContext } from '../../context/WalletProvider';
import Loader from '../../components/Loader';

const Header = () => {
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || null;
  const navigate = useNavigate();
  const { wallet, setWallet } = useContext(WalletContext);

  const Logout = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      localStorage.removeItem('user');
      localStorage.removeItem('Authorization');
    },
  });

  //* Toggle Menu at mobile view
  const [open, setOpen] = useState(false);
  function onToogleMenu() {
    if (window.innerWidth >= 768) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }
  //* When resize window, check it's innerWidth
  useEffect(() => {
    window.addEventListener('resize', onToogleMenu);
    onToogleMenu();
    if (user) {
      getUserWallet()
        .then((data) => {
          const wallet = data.data.wallet;
          setWallet(wallet);
          user.wallet = wallet;
          localStorage.setItem('user', JSON.stringify(user));
        })
        .catch((error) => {
          if (error.message === 'Refresh token is expired') {
            navigate('/login');
          }
          navigate('/login');
        });
    }
    return () => {
      window.removeEventListener('resize', onToogleMenu);
    };
  }, []);

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

  //* Dropdown Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpenModal(true);
  };

  const refreshUserWallet = () => {
    if (user) {
      getUserWallet().then((data) => {
        const wallet = data.data.wallet;
        setWallet(wallet);
        user.wallet = wallet;
        localStorage.setItem('user', JSON.stringify(user));
      });
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpenModal(false);
  };
  const StyledMenu = styled(Menu)({
    '& .MuiMenu-list': {
      padding: 0,
      height: 'auto',
    },
  });
  const StyledMenuItem = styled(MenuItem)({
    color: 'white',

    paddingTop: '10px',
    backgroundColor: '#b96714',
    fontSize: '18x',
    '&:hover': {
      backgroundColor: '#ff9933',
    },
  });

  return loading ? (
    <Loader />
  ) : (
    <div className='grid grid-cols-[1fr_1fr_1fr] place-items-center bg-orange-200 py-4 h-auto'>
      {/* Logo */}
      <div>
        <NavLink to='/'>
          <Logo />
        </NavLink>
      </div>
      {/* Navbar */}

      <div
        className={
          'md:flex md:static absolute md:justify-between  w-full left-0 top-12 md:w-auto md:items-center py-1 min-h-[4vh] text-center mr-12'
        }
      >
        {(open || window.innerWidth >= 768) && (
          <Navbar>
            <NavLink
              to='/'
              className='md:hover:opacity-50 md:hover:text-primary text-2xl'
              style={({ isActive }) => {
                return {
                  color: isActive ? '#B96714' : '',
                  borderBottom:
                    isActive && window.innerWidth >= 768
                      ? '2px solid #B96714'
                      : '',
                };
              }}
            >
              Home
            </NavLink>
            <NavLink
              to='/about'
              className='hover:opacity-50 hover:text-primary text-2xl'
              style={({ isActive }) => {
                return {
                  color: isActive ? '#B96714' : '',
                  borderBottom:
                    isActive && window.innerWidth >= 768
                      ? '2px solid #B96714'
                      : '',
                };
              }}
            >
              About us
            </NavLink>

            <NavLink
              to='/coffeeShops'
              className='hover:opacity-50 hover:text-primary text-2xl'
              style={({ isActive }) => {
                return {
                  color: isActive ? '#B96714' : '',
                  borderBottom:
                    isActive && window.innerWidth >= 768
                      ? '2px solid #B96714'
                      : '',
                };
              }}
            >
              Our Shops
            </NavLink>
          </Navbar>
        )}
      </div>

      {/* Button */}
      <div className='flex items-center gap-6'>
        {!user ? (
          <NavLink to='/login'>
            <Button type='small'>Sign in/up</Button>
          </NavLink>
        ) : (
          <div className='flex items-center gap-2'>
            <div className='border-2 rounded-lg border-orange-400 py-0 px-3 flex items-center'>
              <FaWallet size='1.25rem' />
              {wallet ? (
                <span className='text-lg font-bold p-2'>
                  {wallet.toLocaleString()} VND
                </span>
              ) : (
                <span className='text-lg font-bold p-2'>0 VND</span>
              )}
              <IconButton onClick={refreshUserWallet}>
                <SlRefresh
                  size='2rem'
                  style={{
                    border: '1px solid black',
                    padding: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                  }}
                />
              </IconButton>
            </div>
            <button onClick={handleClick}>
              <div className='flex items-center'>
                <Avatar
                  alt='Remy Sharp'
                  src={user.avatar}
                  sx={{ width: 56, height: 56 }}
                />
                <div
                  className={`transform transition-transform duration-300 ${
                    isOpenModal ? 'rotate-180' : ''
                  }`}
                >
                  <HiChevronDown size='2rem' />
                </div>
              </div>
            </button>
            <StyledMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <NavLink to='/profile' className='mt-2'>
                <StyledMenuItem onClick={handleClose}>
                  My Profile
                </StyledMenuItem>
              </NavLink>
              <NavLink to='/booking/history' className='mt-2'>
                <StyledMenuItem onClick={handleClose}>
                  My Booking
                </StyledMenuItem>
              </NavLink>
              <StyledMenuItem
                onClick={() => {
                  onLogout();
                }}
              >
                Logout
              </StyledMenuItem>
            </StyledMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
