import MainMenu from '../MainMenu';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaCat } from 'react-icons/fa6';

const StaffMenu = () => {
  const menuItems = [
    { path: '/staff/booking', label: 'Booking', icon: FaRegCalendarAlt },
  ];
  return <MainMenu menuItems={menuItems} />;
};

export default StaffMenu;
