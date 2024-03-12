import React from "react";
import { FaSpinner } from "react-icons/fa";
import {
  MdPending,
  MdCheck,
  MdMoneyOff,
  MdOutlineSettings,
  MdOutlineAccountBalanceWallet,
  MdError,
} from "react-icons/md";

const Status = ({ name }) => {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const styles = {
    finished: { icon: MdOutlineAccountBalanceWallet, bgColor: "bg-green-500" },
    pending: { icon: MdPending, bgColor: "bg-orange-500" },
    "in progress": { icon: FaSpinner, bgColor: "bg-blue-500" },
    refund: { icon: MdMoneyOff, bgColor: "bg-red-500" },
    paid: { icon: MdOutlineAccountBalanceWallet, bgColor: "bg-green-700" },
    unavailable: { icon: MdError, bgColor: "bg-red-500" },
    available: { icon: MdCheck, bgColor: "bg-green-500" },
    default: { icon: MdOutlineSettings, bgColor: "bg-gray-500" },
  };

  const Icon = styles[name]?.icon || styles.default.icon;
  const bgColor = styles[name]?.bgColor || styles.default.bgColor;

  return (
    <div
      className={`w-fit h-fit px-2 pt-0.5 pb-1 rounded-lg flex justify-center items-center gap-2 ${bgColor}`}
    >
      <span className="font-semibold text-l">
        {capitalizeFirstLetter(name)}
      </span>
      <Icon size="1.2rem" />
    </div>
  );
};

export default Status;
