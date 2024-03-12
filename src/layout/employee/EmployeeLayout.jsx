import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const EmployeeLayout = ({ Header, Menu }) => {
  return (
    <div className='grid grid-cols-[13rem,1fr] grid-rows-[auto,1fr] h-screen'>
      <Sidebar Menu={Menu} />
      <Header />
      <main className='bg-orange-50 overflow-scroll'>
        <div className='max-w-[120rem] m-auto flex flex-col gap-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;
