import { TextField, Typography, Button } from "@mui/material";
import { HiOutlineCheckCircle, HiOutlineChevronRight } from "react-icons/hi";
import FormatNumber from "../../utils/NumberFormatter";
import EmptyBox from "../../assets/empty_box.png";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

const BookingInfo = ({
  numberOfAdults,
  numberOfChildren,
  coffeeShopName,
  startTime,
  endTime,
  chosenAreaName,
  chosenTableName,
  date,
  totalBookingPrice,
}) => {
  const navigate = useNavigate();
  // console.log(numberOfAdults);
  function formatTimeToDateString(timeString) {
    const date = new Date(timeString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  function formatTimeToHourString(timeString) {
    const [hours, minutes, seconds] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setSeconds(parseInt(seconds));

    return date.toLocaleTimeString(["en-US"], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <>
      <div className="p-6 border-2 border-gray-300 rounded-lg">
        <h1 className=" text-4xl font-bold text-center text-primary">
          Booking Summary
        </h1>
        <div className="mt-2 text-lg flex justify-center items-center gap-3 ">
          {/* <span>Coffee shop Name:</span>
           */}
          <FaLocationDot className="inline-block text-2xl text-secondary" />
          <h3 className="font-bold text-primary">{coffeeShopName}</h3>
        </div>

        <div className="flex flex-row justify-center gap-6 mt-4">
          <div>
            <h3 className="mt-2 text-lg font-bold">Number of Adults</h3>
            <input
              type="text"
              readOnly
              value={numberOfAdults}
              className={`mt-1 p-2 border-2 border-orange-500 rounded focus:outline-none focus:border-orange-700 ${
                numberOfAdults ? "bg-gray-200" : ""
              }`}
            />
          </div>
          <div>
            <h3 className="mt-2 text-lg font-bold">Number of Children</h3>
            <input
              type="text"
              readOnly
              value={numberOfChildren}
              className={`mt-1 p-2 border-2 border-orange-500 rounded focus:outline-none focus:border-orange-700 ${
                numberOfChildren !== null && numberOfChildren !== undefined
                  ? "bg-gray-200"
                  : ""
              }`}
            />
          </div>
        </div>

        <div className="flex flex-row justify-center gap-6 mt-4">
          <div>
            <h3 className="mt-2 text-lg font-bold">Date</h3>
            <input
              type="text"
              readOnly
              value={formatTimeToDateString(date)}
              className={`mt-1 p-2 border-2 border-orange-500 rounded focus:outline-none focus:border-orange-700 ${
                date ? "bg-gray-200" : ""
              }`}
            />
          </div>
          <div>
            <h3 className="mt-2 text-lg font-bold">Time</h3>
            <input
              type="text"
              readOnly
              value={
                formatTimeToHourString(startTime) +
                " - " +
                formatTimeToHourString(endTime)
              }
              className={`mt-1 p-2 border-2 border-orange-500 rounded focus:outline-none focus:border-orange-700 ${
                startTime && endTime ? "bg-gray-200" : ""
              }`}
            />
          </div>
        </div>

        <div className="flex flex-row justify-center gap-6 mt-4">
          <div>
            <h3 className="mt-2 text-lg font-bold">Area</h3>
            <input
              type="text"
              readOnly
              value={chosenAreaName}
              className={`mt-1 p-2 border-2 border-orange-500 rounded focus:outline-none focus:border-orange-700 ${
                chosenAreaName ? "bg-gray-200" : ""
              }`}
            />
          </div>
          <div>
            <h3 className="mt-2 text-lg font-bold">Table</h3>
            <input
              type="text"
              readOnly
              value={chosenTableName}
              className={`mt-1 p-2 border-2 border-orange-500 rounded focus:outline-none focus:border-orange-700 ${
                chosenTableName ? "bg-gray-200" : ""
              }`}
            />
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between  align-middle items-end gap-4">
          <h3 className="pb-1 text-3xl font-bold">Booking total: </h3>
          <h3 className="text-3xl font-bold border-b-4">
            {FormatNumber(totalBookingPrice)} VND{" "}
          </h3>
        </div>
      </div>
    </>
  );
};

export default BookingInfo;
