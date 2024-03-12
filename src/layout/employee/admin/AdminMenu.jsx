import React from 'react';
import Header from '../Header';
import MainMenu from '../MainMenu';
import { FaStore } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';

const AdminMenu = () => {
  const menuItems = [
    { path: '/admin/coffeeshops', label: 'Shops', icon: FaStore },
    { path: '/admin/managers', label: 'Managers', icon: FaUser },
  ];
  return <MainMenu menuItems={menuItems} />;
};

export default AdminMenu;
