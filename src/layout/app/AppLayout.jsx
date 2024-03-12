import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AppLayout = () => {
  return (
    <div className='grid grid-rows-[auto_1fr_auto] h-screen'>
      <Header />
      {/* Children of the route */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppLayout;
