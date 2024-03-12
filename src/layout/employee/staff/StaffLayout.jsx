import EmployeeLayout from '../EmployeeLayout';
import StaffHeader from './StaffHeader';
import StaffMenu from './StaffMenu';

const StaffLayout = () => {
  return (
    <EmployeeLayout Menu={StaffMenu} Header={StaffHeader}></EmployeeLayout>
  );
};

export default StaffLayout;
