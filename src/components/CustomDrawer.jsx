import { useState, useEffect } from "react";
import "./styleDrawer.css";
import { HiCheck, HiOutlineLogin } from "react-icons/hi";
import { Button, Typography } from "@mui/material";
import { FaBackward } from "react-icons/fa6";

const CustomDrawer = (props) => {
  const {
    showModel,
    setShowModel,
    styles,
    renderBody,
    message,
    isFormFilled,
    handlePrimaryBtnClick,
  } = props;

  // ** States
  const [show, setShow] = useState(showModel);

  // ** Hooks
  useEffect(() => {
    if (showModel) {
      setShow(showModel);
    }
  }, [showModel]);

  // ** Handlers
  const handleCloseModal = () => {
    setShow(false);

    const close = setTimeout(() => {
      setShowModel(false);
      typeof handlePrimaryBtnClick == "function" && handlePrimaryBtnClick();
    }, 400);

    return () => clearTimeout(close);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-20 w-full"
      style={{ display: showModel ? "block" : "none", zIndex: "1103" }}
    >
      <div
        className="fromRight fixed z-50 top-0 w-3/5 h-screen p-6 overflow-y-scroll bg-white transition-all duration-200 ease-in-out animate-slideIn shadow-md"
        style={{ right: show ? "0" : "-100%", ...styles }}
      >
        {/* <div className="flex flex-row items-center justify-between space-x-2"> */}
          <div className="flex flex-row items-center justify-start space-x-2">
            <HiOutlineLogin
              size={30}
              color="#707D95"
              style={{ cursor: "pointer" }}
              onClick={handleCloseModal}
            />
            <p className="text-4xl font-semibold">{message?.header}</p>
          </div>
          {/* <div className="flex flex-row items-center justify-end space-x-2 sticky right-0 top-0">
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
              startIcon={<HiCheck />}
              disabled={!isFormFilled}
              onClick={handleCloseModal}
              type="submit"
            >
              {message?.primaryBtn}
            </Button>
          </div> */}
        {/* </div> */}
        <hr />
        {renderBody}
        <div className="w-full flex flex-row items-center justify-end space-x-2 sticky bottom-0">
          {/* <Button variant="text" color="warning" onClick={handleCloseModal}>
            <Typography variant="h6">{message?.secondaryBtn}</Typography>
          </Button> */}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            startIcon={<HiCheck />}
            disabled={!isFormFilled}
            onClick={handleCloseModal}
            type="submit"
          >
            {message?.primaryBtn}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomDrawer;
