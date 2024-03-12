import React from 'react';
import AdminMenu from './AdminMenu';
import AdminHeader from './AdminHeader';
import EmployeeLayout from '../EmployeeLayout';

const AdminLayout = () => {
  return <EmployeeLayout Menu={AdminMenu} Header={AdminHeader} />;
};

export default AdminLayout;
