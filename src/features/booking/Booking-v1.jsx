import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller, set, get } from "react-hook-form";
import EmptyBox from "../../assets/empty_box.png";
import {
  HiLocationMarker,
  HiBookOpen,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineMinus,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import CustomDrawer from "../../components/CustomDrawer";
import { DateTimeFormater } from "../../utils/DateFormater";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAreasInAShop, getCatsInArea } from "../../services/apiArea";
import { booking, getAvailableTime } from "../../services/apiBooking";
import { toastError } from "../../components/Toast";
import { useNavigate, useParams } from "react-router-dom";
import { getTablesInArea } from "../../services/apiTable";
import { getOpenAndCloseTime } from "../../services/apiShops";
import FormatNumber from "../../utils/NumberFormatter";
import Cats from "./Cats";
import Loader from "../../components/Loader";
import Loading from "../../components/Loading";
const Booking = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm();
  const [open, setOpen] = useState(false);
  const [checkedArea, setCheckedArea] = useState(null);
  const [checkedTable, setCheckedTable] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(0);
  const [cats, setCats] = useState([]);
  const [availableTime, setAvailableTime] = useState([]);
  const [tables, setTables] = useState([]);
  const [filterTables, setFilterTables] = useState([]);
  const adult = watch("adult") || 0;
  const children = watch("children") || 0;
  const navigate = useNavigate();
  const { coffeeShopId } = useParams();
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [openTime, setOpenTime] = useState(new Date());
  const [closeTime, setCloseTime] = useState(new Date());
  const [datePicker, setDatePicker] = useState(null);
  const {
    isLoading,
    data: areas,
    error,
  } = useQuery({
    queryKey: ["areas", coffeeShopId],
    queryFn: () => getAreasInAShop(coffeeShopId),
  });
  const GetTablesInArea = useMutation({ mutationFn: getTablesInArea });
  const GetCatsInArea = useMutation({ mutationFn: getCatsInArea });
  const CreateBooking = useMutation({ mutationFn: booking });
  const GetAvailableTime = useMutation({ mutationFn: getAvailableTime });
  // const GetOpenAndCloseTime = useMutation({ mutationFn: getOpenAndCloseTime });

  function convertTo24Hour(timeStr) {
    const time = new Date(`01/01/2020 ${timeStr}`);
    let hours = time.getHours();
    let minutes = time.getMinutes();

    // Set the current date's hours and minutes to the converted time
    const currentDate = new Date();
    currentDate.setHours(hours, minutes);

    return currentDate;
  }

  useEffect(() => {
    if (areas && checkedArea !== null && areas.data[checkedArea]) {
      setValue("area", {
        _id: areas.data[checkedArea]._id,
        coffeeShopId: areas.data[checkedArea].coffeeShopId,
      });
    }
  }, [areas, checkedArea]);

  useEffect(() => {
    const numberOfPeople = adult || 0 + children || 0;
    // if number of people is increase
    tables.map((table) => {
      if (numberOfPeople <= table.maxSeat) {
        if (!filterTables.some((t) => t.tableTypeId === table.tableTypeId)) {
          setFilterTables((prev) => [...prev, table]);
        }
      }
    });
    setCheckedTable(null);
    // if number of people is decrease
    setFilterTables((prevTables) =>
      prevTables.filter((table) => numberOfPeople <= table.maxSeat)
    );
  }, [tables, adult, children]);

  useEffect(() => {
    getOpenAndCloseTime(coffeeShopId, datePicker).then((res) => {
      setOpenTime(convertTo24Hour(res.data.openTime[0].openHour));
      setCloseTime(convertTo24Hour(res.data.openTime[0].closeHour));
    });
  }, [datePicker]);

  useEffect(() => {
    setFilterTables((prevTables) => {
      const updatedTables = tables.map((table) => {
        const existingTable = prevTables.find(
          (t) => t.tableTypeId === table.tableTypeId
        );
        if (existingTable) {
          return { ...existingTable, maxSeat: table.maxSeat };
        }
        return table;
      });
      return updatedTables.filter((table) => table.maxSeat >= adult + children);
    });
  }, [tables, filterTables, adult, children]);

  if (isLoading) return <Loader />;
  if (error) return "An error has occurred: " + error.message;

  const handleClick = (index) => {
    if (index !== buttonClicked) {
      setButtonClicked(index);
    } else {
      setButtonClicked(0);
    }
  };

  const handleCheckArea = async (check, areaId) => {
    setCheckedArea(check);
    console.log(areaId);
    const result = await GetTablesInArea.mutateAsync([coffeeShopId, areaId]);
    if (result.status === 200) {
      const sortedData = result.data.sort((a, b) =>
        a.tableTypeId.localeCompare(b.tableTypeId)
      );
      setTables(sortedData);
    } else {
      toastError(result.message);
    }
    const res = await GetCatsInArea.mutateAsync([coffeeShopId, areaId]);
    if (res.status === 200) {
      setCats(res.data);
    } else {
      toastError(res.message);
    }
  };

  const handleViewCatList = async (check, areaId) => {
    const res = await GetCatsInArea.mutateAsync([coffeeShopId, areaId]);
    if (res.status === 200) {
      setCats(res.data);
      setOpen(true);
    } else {
      toastError(res.message);
    }
  };

  const handleCheckTable = async (check, tableTypeId) => {
    setCheckedTable(check);
    setValue("tableTypeId", tableTypeId);
  };

  const handleSelectDate = async () => {
    const startTime = new Date(
      availableTime[buttonClicked - 1].startTime
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const endTime = new Date(
      availableTime[buttonClicked - 1].endTime
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    setValue("from", startTime);
    setValue("to", endTime);
    const response = await CreateBooking.mutateAsync(getValues());
    if (response.status === 200) {
      localStorage.setItem("booking", JSON.stringify(response.data));
      setOpenPopUp(1);
      reset();
    } else {
      toastError(response.message);
      setOpenPopUp(0);
    }
  };

  const onSubmit = async () => {
    setIsBookingLoading(true);
    const data = getValues();

    setCheckedArea(null);
    setCheckedTable(null);
    try {
      const response = await CreateBooking.mutateAsync(data);

      console.log("response", response);
      if (response.status === 200) {
        localStorage.setItem("booking", JSON.stringify(response.data));
        setOpenPopUp(1);
        reset();
      } else if (
        response.status === "fail" &&
        response.message.includes("There is no table available in this time")
      ) {
        console.log(response.message);
        const res = await GetAvailableTime.mutateAsync(data);
        console.log("res", res);
        if (res.status === 200) {
          console.log("res", res);
          setIsBookingLoading(false);
          if (res.data.length === 0) {
            toastError("There is no table available in this time");
          } else {
            setAvailableTime(res.data);
            setOpenPopUp(2);
          }
        } else {
          setIsBookingLoading(false);
          console.log("error", res);
          toastError(res.message);
        }
      } else {
        setIsBookingLoading(false);
        console.log("error", response);
        toastError(response.message);
      }
    } catch (error) {
      console.log("error", error);
      toastError(error);
    }
    setIsBookingLoading(false);
  };

  return (
    <>
      {isBookingLoading && <Loading />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full sticky top-0 border bg-slate-50 p-3 z-50">
          <Grid container spacing={2}>
            <Grid item md={5} xs={12}>
              <div className="flex flex-row align-middle items-center gap-x-3 border-2 rounded-lg border-orange-200 p-3">
                <div className="mx-2 flex items-center">
                  <Typography className="mx-2" variant="h5">
                    1. Choose number people
                  </Typography>
                </div>
                <div className="mx-2 flex items-center">
                  <TextField
                    label="Adults"
                    color="warning"
                    required
                    type="number"
                    className="w-36"
                    {...register("adult", { valueAsNumber: true })}
                    InputProps={{
                      inputProps: { min: 1, max: 10 },
                    }}
                  />
                </div>
                <div className="mx-2 flex items-center">
                  <TextField
                    label="Children"
                    color="warning"
                    required
                    type="number"
                    className="w-36"
                    {...register("children", { valueAsNumber: true })}
                    InputProps={{
                      inputProps: { min: 0, max: 10 },
                    }}
                  />
                </div>
              </div>
            </Grid>

            {/* date and time picker */}
            <Grid item md={7} xs={12}>
              <div className="flex flex-row align-middle items-center gap-x-3 border-2 rounded-lg border-orange-200 p-3">
                <div className="mx-7">
                  <Typography variant="h5">2. Choose Date and Time</Typography>
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value = null } }) => (
                      <DatePicker
                        label="Date"
                        format="DD/MM/YYYY"
                        sx={{ width: "200px" }}
                        value={value || ""} // Use null instead of undefined
                        onChange={(date) => {
                          console.log(getValues("from"));
                          onChange(date ? date.toDate().toISOString() : null);
                          setDatePicker(
                            date ? date.toDate().toISOString() : null
                          );
                        }}
                        error={!!errors.date}
                        slotProps={{
                          textField: {
                            helperText: errors.date ? "Date is required" : null,
                          },
                        }}
                        disablePast
                      />
                    )}
                  />
                  <div className="mx-3"></div>
                  <Controller
                    name="from"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <TimePicker
                        disabled={datePicker === null ? true : false}
                        label="From"
                        // value={null}
                        // value={getValues("from") || null}
                        sx={{ width: "140px" }}
                        color="warning"
                        minutesStep={30}
                        timeSteps={{ minutes: 30 }}
                        minTime={dayjs()
                          .set("hour", openTime.getHours())
                          .set("minute", openTime.getMinutes())}
                        maxTime={dayjs().set("hour", closeTime.getHours())}
                        // minTime={dayjs().set("hour", 7).set("minute", 30)}
                        // maxTime={dayjs().set("hour", 11)}
                        onChange={(time) => {
                          console.log("time", time);
                          const date = time.toDate();
                          const formattedTime = `${date
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${date
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}:${date
                            .getSeconds()
                            .toString()
                            .padStart(2, "0")}`;
                          setValue("from", formattedTime);
                          onChange(formattedTime);
                        }}
                        error={!!errors.from}
                        slotProps={{
                          textField: {
                            helperText: errors.from ? "Time is required" : null,
                          },
                        }}
                      />
                    )}
                  />
                  <HiOutlineMinus className="mx-1" />
                  <Controller
                    name="to"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange } }) => (
                      <TimePicker
                        label="To"
                        disabled={datePicker === null ? true : false}
                        sx={{ width: "140px" }}
                        minutesStep={30}
                        minTime={dayjs()
                          .set("hour", openTime.getHours())
                          .set("minute", openTime.getMinutes())}
                        maxTime={dayjs().set("hour", closeTime.getHours())}
                        onChange={(time) => {
                          if (time) {
                            console.log("time", time);
                            const date = time.toDate();
                            const formattedTime = `${date
                              .getHours()
                              .toString()
                              .padStart(2, "0")}:${date
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}:${date
                              .getSeconds()
                              .toString()
                              .padStart(2, "0")}`;
                            onChange(formattedTime);
                          } else {
                            onChange("");
                          }
                        }}
                        error={!!errors.to}
                        slotProps={{
                          textField: {
                            helperText: errors.to ? "Time is required" : null,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </Grid>
          </Grid>
          <div className="flex justify-center items-center mt-3">
            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={checkedArea === null || checkedTable === null}
              sx={{ width: "400px", mx: "auto" }}
              margin="normal"
              endIcon={<HiOutlineChevronRight />}
            >
              Book
            </Button>
          </div>
        </div>
        {open && (
          <CustomDrawer
            styles={{ width: "40%" }}
            showModel={open}
            setShowModel={setOpen}
            renderBody={<Cats cats={cats} />}
            message={{ header: "Cats in this area", primaryBtn: "Done" }}
          />
        )}
        <div className="mx-4 my-6 ">
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <div className="px-1 border-solid border-2 border-orange-200 rounded-large">
                <Typography sx={{ mt: 1, ml: 5 }} variant="h5">
                  3. Choose area in this shop
                </Typography>
                <div className="mx-9 my-8">
                  {/* render area list */}
                  {areas.data.map((area, idx) => {
                    return (
                      <div
                        key={idx}
                        onClick={() => handleCheckArea(idx, area._id)}
                        className={
                          "my-12 px-6 py-6 border-solid rounded-large shadow-md flex md:flex-row sm:flex-col justify-between cursor-pointer hover:bg-gray-100"
                        }
                        style={
                          checkedArea === idx
                            ? { border: "2px solid #FF7828" }
                            : {}
                        }
                      >
                        {/* Render area images */}
                        {area.images.length !== 0 ? (
                          area.images.map((image, idx) => (
                            <div
                              key={idx}
                              className="flex md:flex-row sm:flex-col"
                            >
                              <img
                                className="mx-2 h-48 w-56 rounded"
                                src={image.url}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="flex md:flex-row sm:flex-col">
                            <img className="mx-2" src={EmptyBox} />
                          </div>
                        )}
                        <div className="flex flex-col justify-between">
                          <div className="flex flex-row items-center">
                            <Typography variant="h6">{area.name}</Typography>
                          </div>

                          <div className="flex flex-row items-center">
                            <HiBookOpen className="mr-1" size={25} />
                            <Typography variant="h6">
                              {area.isChildAllowed
                                ? "Child allowed"
                                : "Child not allowed"}
                            </Typography>
                          </div>
                          <div className="flex flex-row items-center z-0">
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() => {
                                handleViewCatList(idx, area._id);
                              }}
                            >
                              View cat in this area
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* <div className="h-screen flex">
                <img
                  className=g"w-min flex items-center justify-center"
                  src={EmptyBox}
                />
              </div> */}
              </div>
            </Grid>
            <Grid item md={6} xs={12}>
              <div className="px-6 border-solid border-2 border-orange-200 rounded-large">
                <Typography sx={{ mt: 1 }} variant="h5">
                  4. Tables in this Area
                </Typography>
                <div className="mt-4 h-screen overflow-y-auto">
                  <Grid container spacing={2}>
                    {tables.map((table, idx) => {
                      return (
                        <Grid key={idx} item md={6} xs={12}>
                          <div
                            key={idx}
                            onClick={() =>
                              handleCheckTable(idx, table.tableTypeId)
                            }
                            className={
                              "my-12 px-6 py-6 border-solid rounded-large shadow-md flex md:flex-col sm:flex-col justify-between items-center cursor-pointer hover:bg-gray-100"
                            }
                            style={
                              table.maxSeat <
                              (getValues("adult") || 0) +
                                (getValues("children") || 0)
                                ? {
                                    pointerEvents: "none",
                                    backgroundColor: "grey",
                                  }
                                : checkedTable === idx
                                ? { border: " 2px solid #FF7828" }
                                : {}
                            }
                          >
                            <Typography variant="h6" fontWeight="bold">
                              {table.name}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {FormatNumber(table.price)} VND / 1hour
                            </Typography>
                          </div>
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
                {/* <div className="flex items-center justify-center">
                <img src={EmptyBox} />
              </div> */}
              </div>
            </Grid>
          </Grid>
        </div>
      </form>

      {/* Success booking */}
      <Dialog
        open={openPopUp === 1}
        onClose={() => setOpenPopUp(0)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick={true} // Disable closing dialog by clicking outside
        disableEscapeKeyDown={true} // Disable closing dialog by pressing Escape key
      >
        <div className="flex flex-col items-center justify-center">
          <DialogTitle id="alert-dialog-title">
            Your table have just been booked!
          </DialogTitle>
          <DialogContent className="flex flex-col items-center justify-center">
            <HiOutlineCheckCircle size={80} color="green" />
            <DialogContentText id="alert-dialog-description">
              Do you want to buy more item in our shop?
            </DialogContentText>
          </DialogContent>
        </div>
        <DialogActions>
          <Button
            color="warning"
            onClick={() => {
              setOpenPopUp(0);
              navigate("/purchase");
            }}
          >
            Check out my order
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setOpenPopUp(0);
              navigate(`/coffeeShops/${coffeeShopId}/items`);
            }}
          >
            Continue to buy items
          </Button>
        </DialogActions>
      </Dialog>

      {/* hour not available */}
      <Dialog
        open={openPopUp === 2}
        onClose={() => setOpenPopUp(0)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        // disableBackdropClick={true} // Disable closing dialog by clicking outside
        disableEscapeKeyDown={true} // Disable closing dialog by pressing Escape key
      >
        <div className="flex flex-col items-center justify-center">
          <DialogTitle id="alert-dialog-title">
            Sorry, the time you want to book is currently unavailable!
          </DialogTitle>
          <DialogContent className="flex flex-col items-center justify-center">
            <DialogContentText
              className="flex justify-center"
              id="alert-dialog-description"
            >
              Below are the available times in the store
            </DialogContentText>
            <br />
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical outlined button group"
            >
              {availableTime?.map((time, idx) => (
                <Button
                  key={idx}
                  variant={buttonClicked === idx + 1 ? "contained" : "outlined"}
                  color="warning"
                  onClick={() => handleClick(idx + 1)}
                >
                  {new Date(time.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(time.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Button>
              ))}
            </ButtonGroup>
          </DialogContent>
        </div>
        <DialogActions>
          {buttonClicked !== 0 && (
            <Button color="warning" onClick={() => handleSelectDate()}>
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Booking;
