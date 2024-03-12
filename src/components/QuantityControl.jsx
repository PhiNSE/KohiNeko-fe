import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import { FaCircleMinus } from "react-icons/fa6";
import { FaMinusCircle } from "react-icons/fa";
import { VscAdd } from "react-icons/vsc";
import { VscRemove } from "react-icons/vsc";

import styled from "styled-components";

const QuantityControl = ({ value, onIncrement, onDecrement, isChildren }) => {
  return (
    <div className="flex items-center justify-between bg-white p-2 rounded-lg border-2 border-gray-200">
      <button
        onClick={onDecrement}
        type="button"
        className="bg-primary hover:bg-secondary text-white font-bold py-1 px-2 rounded"
        data-hs-input-number-decrement
        disabled={isChildren ? value <= 0 : value <= 1}
      >
        <VscRemove size="1em" />
      </button>
      <div
        className="text-center w-12 text-xl bg-transparent border-0 text-gray-800 focus:ring-0"
        type="text"
        readOnly
      >
        {value}
      </div>
      <button
        type="button"
        onClick={onIncrement}
        className="bg-primary hover:bg-secondary text-white font-bold py-1 px-2 rounded"
        data-hs-input-number-increment
      >
        <VscAdd size="1em" />
      </button>
    </div>
  );
};

export default QuantityControl;
