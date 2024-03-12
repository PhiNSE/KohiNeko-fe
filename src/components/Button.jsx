import { useState } from 'react';
import { Link } from 'react-router-dom';
import CatDetails from './CatDetails';

const Button = ({
  children,
  type,
  levelType = 'primary',
  to,
  doubleButton = false,
  modalLabel,
  openModal = false,
  shopId,
  catId,
  onClick,
}) => {
  //* For modal button ONLY
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const base =
    'px-2 py-1.5 md:px-4 md:py-3  rounded-lg text-sm font-bold uppercase 0 transition-colors duration-300 hover:bg-secondary focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed md:text-sm md:py-1 md:px-2 text-center flex justify-center items-center';
  const styles = {
    small: base + ' w-1/7',
    medium: base + ' w-1/3',
    large: base + ' w-full',
  };
  const level = {
    primary: base + ' bg-primary text-white',
    secondary: base + ' bg-gary-100 text-primary ring-2 ring-primary 500',
  };

  //* Double button
  if (doubleButton) {
    return (
      <div className='mt-5 flex justify-center space-x-4'>
        <Link to={to} className={`${styles[type]} ${level['primary']} w-full `}>
          View Details
        </Link>
        <button className={`${styles[type]} ${level['secondary']} w-full `}>
          Book Now
        </button>
      </div>
    );
  }

  //* Link to
  if (to) {
    return (
      <div className='mt-5 flex justify-center' onClick={onClick}>
        <Link to={to} className={`${styles[type]} ${level[levelType]} w-full `}>
          {children}
        </Link>
      </div>
    );
  }

  //* Open Modal
  if (openModal)
    return (
      <div>
        <button
          onClick={handleOpen}
          className={`${styles[type]} ${level[levelType]}`}
        >
          {children}
        </button>
        {modalLabel === 'cat' && (
          <CatDetails
            open={open}
            handleClose={handleClose}
            catId={catId}
            shopId={shopId}
          >
            {children}
          </CatDetails>
        )}
      </div>
    );

  return (
    <button className={`${styles[type]} ${level[levelType]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
