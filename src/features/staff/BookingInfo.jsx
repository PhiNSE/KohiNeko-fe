import { TextField, Typography, Button } from "@mui/material";
import { HiOutlineCheckCircle, HiOutlineChevronRight } from "react-icons/hi";
// import FormatNumber from "../../../utils/NumberFormatter";
import EmptyBox from "../../assets/empty_box.png";
import { useNavigate } from "react-router-dom";
import { SlArrowLeftCircle } from "react-icons/sl";
import Status from "../../components/Status";

const BookingInfo = ({ bookingInfo }) => {
  console.log(bookingInfo);
  console.log(bookingInfo.status);
  const navigate = useNavigate();
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const FormatNumber = (num) => {
    const str = num.toString();
    const reversed = str.split("").reverse().join("");
    const formatted = reversed.replace(/(\d{3})(?=\d)/g, "$1.");
    return formatted.split("").reverse().join("");
  };

  function formatUTCDate(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }
  return (
    <>
      {Object.keys(bookingInfo).length > 0 ? (
        <div className="px-6 py-6 border-solid border-2 rounded-large">
          <Typography variant="h4" fontWeight="bold">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Your booking ID: </span>
              <span className="text-yellow-600">
                {bookingInfo._id.slice(-4)}
              </span>
            </div>
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              Status: <Status name={bookingInfo.status} />
            </div>
          </Typography>
          <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
            Coffee shop Name
          </Typography>
          <TextField
            defaultValue={bookingInfo.coffeeShopId.shopName}
            color="warning"
            variant="standard"
            fullWidth
            focused
            InputProps={{
              readOnly: true,
              endAdornment: (
                <div className="cursor-pointer">
                  <HiOutlineCheckCircle color="orange" size={24} />
                </div>
              ),
            }}
          />
          <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
            Address
          </Typography>
          <TextField
            defaultValue={
              bookingInfo.coffeeShopId.address.houseNumber +
              " " +
              bookingInfo.coffeeShopId.address.street +
              ", " +
              bookingInfo.coffeeShopId.address.district +
              ", " +
              bookingInfo.coffeeShopId.address.city
            }
            color="warning"
            variant="standard"
            fullWidth
            focused
            InputProps={{
              readOnly: true,
              endAdornment: (
                <div className="cursor-pointer">
                  <HiOutlineCheckCircle color="orange" size={24} />
                </div>
              ),
            }}
          />
          <div className="flex flex-row justify-between">
            <div>
              <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
                Date
              </Typography>
              <TextField
                defaultValue={new Date(
                  bookingInfo.startTime
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                color="warning"
                variant="standard"
                focused
                // sx={{ width: "150%" }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <div className="cursor-pointer">
                      <HiOutlineCheckCircle color="orange" size={24} />
                    </div>
                  ),
                }}
              />
            </div>
            <div>
              <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
                Time
              </Typography>
              <TextField
                defaultValue={
                  formatUTCDate(bookingInfo.startTime) +
                  " - " +
                  formatUTCDate(bookingInfo.endTime)
                }
                color="warning"
                variant="standard"
                focused
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <div className="cursor-pointer">
                      <HiOutlineCheckCircle color="orange" size={24} />
                    </div>
                  ),
                }}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div>
              <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
                Area
              </Typography>
              <TextField
                defaultValue={bookingInfo.tableId.areaId.name}
                color="warning"
                variant="standard"
                focused
                // sx={{ width: "48%"}}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <div className="cursor-pointer">
                      <HiOutlineCheckCircle color="orange" size={24} />
                    </div>
                  ),
                }}
              />
            </div>
            <div>
              <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
                Table
              </Typography>
              <TextField
                defaultValue={bookingInfo.tableId?.tableTypeId.name}
                color="warning"
                variant="standard"
                focused
                // sx={{ width: "48%"}}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <div className="cursor-pointer">
                      <HiOutlineCheckCircle color="orange" size={24} />
                    </div>
                  ),
                }}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between border-4 p-3 rounded-xl mt-5">
            <div>
              <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
                Customer Email
              </Typography>
              <TextField
                defaultValue={bookingInfo.customerId.email}
                color="warning"
                variant="standard"
                focused
                // sx={{ width: "48%"}}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <div className="cursor-pointer">
                      <HiOutlineCheckCircle color="orange" size={24} />
                    </div>
                  ),
                }}
              />
            </div>
            <div>
              <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
                Customer phone number
              </Typography>
              <TextField
                defaultValue={bookingInfo.customerId.phoneNumber}
                color="warning"
                variant="standard"
                focused
                // sx={{ width: "48%"}}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <div className="cursor-pointer">
                      <HiOutlineCheckCircle color="orange" size={24} />
                    </div>
                  ),
                }}
              />
            </div>
            <div>
              <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
                Customer name
              </Typography>
              <TextField
                defaultValue={
                  bookingInfo.customerId.firstName +
                  " " +
                  bookingInfo.customerId.lastName
                }
                color="warning"
                variant="standard"
                focused
                // sx={{ width: "48%"}}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <div className="cursor-pointer">
                      <HiOutlineCheckCircle color="orange" size={24} />
                    </div>
                  ),
                }}
              />
            </div>
          </div>
          <br />
          <hr />
          <div className="flex flex-row justify-between">
            <Typography sx={{ mt: 2 }} variant="h5" fontWeight="bold">
              Total booking:
            </Typography>
            <Typography sx={{ mt: 2 }} variant="h6" fontWeight="bold">
              {FormatNumber(bookingInfo.price || 0)} VND
            </Typography>
          </div>
        </div>
      ) : (
        <div className="px-6 py-6 border-solid border-2 rounded-large">
          <div className="flex flex-col justify-center items-center">
            <div>
              <img src={EmptyBox} alt="empty box" />
            </div>
            <div>
              <Typography variant="h5">There is no booking yet</Typography>
            </div>
            <Button
              variant="outlined"
              color="warning"
              endIcon={<HiOutlineChevronRight />}
              onClick={() => navigate("/booking")}
            >
              To booking page
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingInfo;
