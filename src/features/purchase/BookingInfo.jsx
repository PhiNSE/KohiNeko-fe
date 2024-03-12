import { TextField, Typography, Button } from "@mui/material";
import { HiOutlineCheckCircle, HiOutlineChevronRight } from "react-icons/hi";
import FormatNumber from "../../utils/NumberFormatter";
import EmptyBox from "../../assets/empty_box.png";
import { useNavigate } from "react-router-dom";

const BookingInfo = ({ bookingInfo }) => {
  console.log(bookingInfo);
  const navigate = useNavigate();
  return (
    <>
      {Object.keys(bookingInfo).length > 0 ? (
        <div className="px-6 py-6 border-solid border-2 rounded-large">
          <Typography variant="h4" fontWeight="bold">
            Your booking
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
                  new Date(bookingInfo.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) +
                  " - " +
                  new Date(bookingInfo.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
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
                defaultValue={bookingInfo.areaId.name}
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
                defaultValue={bookingInfo.tableId.tableTypeId.name}
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
