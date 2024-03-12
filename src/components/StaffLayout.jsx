import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import ManagerHeader from "./ManagerHeader";

const ManagerLayout = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <ManagerHeader />
      {/* Children of the route */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default ManagerLayout;
