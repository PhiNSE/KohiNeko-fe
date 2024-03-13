import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { FaWallet } from "react-icons/fa6";
import { SlRefresh } from "react-icons/sl";
import { getUserWallet } from "../../services/apiUser";
import { FaLocationDot } from "react-icons/fa6";

const Header = ({ title }) => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const coffeeShopName = user?.coffeeShopId?.shopName || "No coffee shop";
  const [wallet, setWallet] = useState(user?.wallet);

  const refreshUserWallet = async () => {
    if (user) {
      const res = await getUserWallet();
      if (res.status === 200) {
        const wallet = res.data.wallet;
        setWallet(wallet);
        user.wallet = wallet;
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
  };
  return (
    <div className="bg-orange-400 p-3 px-20 border-b border-gray-300 flex gap-6 items-center justify-between text-white font-semibold">
      <h1 className="text-4xl">{title}</h1>
      <div className="flex items-center gap-8">
        {/* Wallet */}
        <div className="border-2 rounded-lg border-orange-200 py-0 px-3 flex items-center justify-around space-x-4">
          <FaWallet size="1.25rem" />
          {wallet ? (
            <span className="text-lg font-bold p-2">
              {wallet.toLocaleString()} VND
            </span>
          ) : (
            <span className="text-lg font-bold p-2">0 VND</span>
          )}
          <IconButton onClick={refreshUserWallet}>
            <SlRefresh
              size="2rem"
              style={{
                border: "1px solid black",
                padding: "5px",
                borderRadius: "50%",
                backgroundColor: "white",
              }}
            />
          </IconButton>
        </div>
        {/* Location */}
        <div className="flex items-center gap-1 p-2 bg-orange-200 rounded-lg w-fit">
          <FaLocationDot className="text-secondary" />
          <span className="text-lg font-bold text-orange-800">
            {coffeeShopName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
