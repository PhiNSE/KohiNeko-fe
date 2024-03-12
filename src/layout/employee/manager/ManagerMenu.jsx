import { FaStairs, FaTable } from 'react-icons/fa6';
import MainMenu from '../MainMenu';
import { FaCat, FaCoffee, FaShoppingCart, FaUser } from 'react-icons/fa';

const ManagerMenu = () => {
  const menuItems = [
    //* Example
    { path: '/management/coffeeShop', label: 'Coffee Shop', icon: FaCoffee },
    { path: '/management/area', label: 'Area', icon: FaStairs  },
    { path: '/management/table', label: 'Table Type', icon: FaTable },
    { path: '/management/cat', label: 'Cat', icon: FaCat },
    { path: '/management/item', label: 'Item', icon: FaShoppingCart },
    { path: '/management/staff', label: 'Staff', icon: FaUser },
  ];
  return <MainMenu menuItems={menuItems} />;
};

export default ManagerMenu;
