import EmployeeLayout from '../EmployeeLayout';
import ManagerMenu from './ManagerMenu';
import ManagerHeader from './ManagerHeader';

const ManagerLayout = () => {
  return <EmployeeLayout Menu={ManagerMenu} Header={ManagerHeader} />;
};

export default ManagerLayout;
