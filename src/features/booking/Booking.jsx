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
  Stepper,
  Step,
  StepLabel,
  StepConnector,
} from "@mui/material";
import { Tooltip } from "@mui/material";
import { useForm, Controller, set, get } from "react-hook-form";
import EmptyBox from "../../assets/empty_box.png";
import {
  HiLocationMarker,
  HiBookOpen,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineMinus,
} from "react-icons/hi";
import { useCallback, useEffect, useState } from "react";
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
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { getTablesInArea } from "../../services/apiTable";
import { getOpenAndCloseTime, getShopById } from "../../services/apiShops";
import FormatNumber from "../../utils/NumberFormatter";
import Cats from "./Cats";
import Loader from "../../components/Loader";
import Loading from "../../components/Loading";
import CardItem from "../../components/CardItem";
import { FaChild, FaChildren } from "react-icons/fa6";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import BookingInfo from "./BookingInfo";

import PaginationCustom from "../../components/PaginationCustom";
import QuantityControl from "../../components/QuantityControl";
import PageTransition from "../../pages/PageTransition";
import { IoPeople } from "react-icons/io5";
import "../../index.css";
import { toast } from "react-toastify";
import SaveBookingInfo from "../../components/SaveBookingInfo";
import { FaClock, FaLongArrowAltLeft } from "react-icons/fa";
import { FaCalendarAlt, FaStore } from "react-icons/fa";
import { FaStairs } from "react-icons/fa6";
import { MdTableBar } from "react-icons/md";
import { PiKeyReturn } from "react-icons/pi";
import { MdSkipPrevious, MdOutlineSkipNext } from "react-icons/md";
import CoffeeShop from "./../management/coffeeShop/CoffeeShop";

function getSteps() {
  return [
    "N.O People",
    "Datetime",
    "Area Booking",
    "Table Booking",
    "Booking Summary",
  ];
}

const Booking = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
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
  const adult = watch("adult") || 1;
  const children = watch("children") || 0;
  const navigate = useNavigate();
  const { coffeeShopId } = useParams();
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [openTime, setOpenTime] = useState(new Date());
  const [closeTime, setCloseTime] = useState(new Date());
  const [datePicker, setDatePicker] = useState(null);
  const location = useLocation();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  //* Cancel Dialog
  const [cancelDialog, setCancelDialog] = useState(false);

  const handleOpenCancel = () => {
    setCancelDialog(true);
  };
  const handleCloseCancel = () => {
    setCancelDialog(false);
  };
  //* Exit Dialogs
  const [exitDialog, setExitDialog] = useState(false);
  const handleOpenExit = () => {
    window.scrollTo(0, 0);
    setExitDialog(true);
  };
  const handleCloseExit = () => {
    // navigate(location.pathname, { replace: true });
    setExitDialog(false);
  };

  // const getCloseDay(){
  //   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  //   const closeDays = [];

  //   for(let sho)
  // }

  const [prevLocation, setPrevLocation] = useState();
  const [isFirstRender, setIsFirstRender] = useState(true);

  //Bien tam
  const [totalBookingPrice, setTotalBookingPrice] = useState(0);
  const [chosenAreaName, setChosenAreaName] = useState(null);
  const [chosenTableName, setChosenTableName] = useState(null);
  const [coffeeShopName, setCoffeeShopName] = useState(null);
  const [timeFrom, setTimeFrom] = useState(null);
  const [timeTo, setTimeTo] = useState(null);
  const [openDay, setOpenDay] = useState([]);
  //State tool tip
  const [fromToolTip, setFromToolTip] = useState(false);
  const [toToolTip, setToToolTip] = useState(false);
  const [dateToolTip, setDateToolTip] = useState(false);
  // const [open, setOpen] = useState(false);

  //* Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const watchFrom = watch("from");
  const watchTo = watch("to");

  //* Stepped Form
  const [activeStep, setActiveStep] = useState(0);
  const [trigger, setTrigger] = useState(false);
  const steps = getSteps();
  useEffect(() => {
    const timer = setTimeout(() => setTrigger(false), 500);
    return () => clearTimeout(timer); // Clean up on component unmount
  }, []);

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleNextPeople = async () => {
    const shop = await getShopById(coffeeShopId);
    let openDays = [];
    shop.openTime.map((time) => {
      openDays.push(time.day);
    });
    setOpenDay(openDays);
    console.log("openDay", openDay);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleFinalStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
    getTotalBookingPrice();
  };

  const handleNextDate = () => {
    if (watchFrom && watchTo) {
      const startTime = new Date(watchFrom);
      const endTime = new Date(watchTo);
      console.log("startTime", startTime);
      console.log("endTime", endTime);
      if (watchFrom < watchTo) {
        setActiveStep((prevStep) => prevStep + 1);
      } else {
        toast.error("Start time must be greater than end time");
      }
    }
  };

  const handleReset = () => {
    reset();
    navigate(`/coffeeShops/${coffeeShopId}`);
    // window.location.reload();
  };

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

  function convertTo24Hour(timeStr) {
    if (timeStr === null) {
      return null; // or return a default value
    }

    const time = new Date(`01/01/2020 ${timeStr}`);
    let hours = time.getHours();
    let minutes = time.getMinutes();

    // Set the current date's hours and minutes to the converted time
    const currentDate = new Date();
    currentDate.setHours(hours, minutes);

    return currentDate;
  }

  //* Exit dialog
  useEffect(() => {
    // Replace the current history entry when the component mounts
    navigate(location.pathname, { replace: true });

    // Listen for the popstate event
    const handlePopState = (event) => {
      // Prevent the default back navigation
      event.preventDefault();

      // Open the exit dialog and scroll to the top of the page
      handleOpenExit();
    };

    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (areas && checkedArea !== null && areas.data[checkedArea]) {
      setValue("area", {
        _id: areas.data[checkedArea]._id,
        coffeeShopId: areas.data[checkedArea].coffeeShopId,
      });
    }
  }, [areas, checkedArea]);

  useEffect(() => {
    console.log("adult", adult, "children", children);
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
      setCoffeeShopName(res.data.shopName);
    });
  }, [datePicker, coffeeShopId]);

  useEffect(() => {
    const updatedTables = tables.map((table) => {
      const existingTable = filterTables.find(
        (t) => t.tableTypeId === table.tableTypeId
      );
      if (existingTable) {
        return { ...existingTable, maxSeat: table.maxSeat };
      }
      return table;
    });
    const filteredTables = updatedTables.filter(
      (table) => table.maxSeat >= adult + children
    );
    setFilterTables(filteredTables);
  }, [tables, adult, children]);

  if (isLoading) return <Loader />;
  if (error) return "An error has occurred: " + error.message;

  const handleClick = (index) => {
    console.log(index);
    if (index !== buttonClicked) {
      setButtonClicked(index);
    } else {
      setButtonClicked(0);
    }
  };
  function getTimeGap(time1, time2) {
    const date1 = new Date(`1970-01-01T${time1}Z`);
    const date2 = new Date(`1970-01-01T${time2}Z`);
    const diff = date2 - date1;
    const hours = diff / (1000 * 60 * 60);
    return hours;
  }

  const getTotalBookingPrice = () => {
    let total = 0;
    const tablePrice = tables.find(
      (table) => table.tableTypeId === getValues("tableTypeId")
    ).price;

    const amountTime = getTimeGap(getValues("from"), getValues("to"));
    total = tablePrice * amountTime;
    setTotalBookingPrice(total);
    // console.log("total", total);
  };

  const handleCheckArea = async (check, areaId) => {
    setCheckedArea(check);
    setChosenAreaName(areas.data[check].name);

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
    setChosenTableName(tables[check].name);
    setCheckedTable(check);
    setValue("tableTypeId", tableTypeId);
  };

  const handleHoverTimePicker = (event) => {
    if (getValues("from") === undefined || getValues("from") === null) {
      setFromToolTip(true);
    }
    if (getValues("to") === undefined || getValues("to") === null) {
      setToToolTip(true);
    }
    if (getValues("date") === undefined || getValues("date") === null) {
      setDateToolTip(true);
    }
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
    setTimeFrom(startTime);
    setTimeTo(endTime);
    // setDatePicker(availableTime[buttonClicked - 1].date);
    const result = await GetTablesInArea.mutateAsync([
      coffeeShopId,
      getValues("area")._id,
      getValues("from"),
      getValues("to"),
      getValues("date"),
    ]);
    if (result.status === 200) {
      const sortedData = result.data.sort((a, b) =>
        a.tableTypeId.localeCompare(b.tableTypeId)
      );
      setTables(sortedData);
    } else {
      toastError(result.message);
    }
    console.log("result", result);
    setOpenPopUp(0);
  };

  const onSubmit = async () => {
    setIsBookingLoading(true);
    const data = getValues();

    // setCheckedArea(null);
    // setCheckedTable(null);
    try {
      console.log("data", data);
      const response = await CreateBooking.mutateAsync(data);

      console.log("response", response);
      if (response.status === 200) {
        localStorage.setItem("booking", JSON.stringify(response.data));
        setOpenPopUp(1);
        // reset();
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
      console.log("Session is out please login again!!!", error);
      toastError("Session is out please login again!!!");
      navigate("/login");
    }
    setCheckedArea(null);
    setCheckedTable(null);
    setIsBookingLoading(false);
  };

  const getAvailableTimeTable = async (tableTypeId) => {
    setIsBookingLoading(true);
    const data = getValues();
    data.tableTypeId = tableTypeId;
    console.log("data", data);
    const res = await GetAvailableTime.mutateAsync(data);
    if (res.status === 200) {
      const currentTime = Date.now();
      const filteredData = res.data.filter(
        (slot) => slot.endTime > currentTime || slot.startTime > currentTime
      );
      // ... rest of your code
      setAvailableTime(filteredData);
      if (res.data.length === 0) {
        toastError("There is no table available in this time");
      } else {
        setAvailableTime(res.data);
        setOpenPopUp(2);
      }
    } else {
      console.log("error", res);
      toastError(res.message);
    }
    setIsBookingLoading(false);
  };

  const handleNextArea = async () => {
    if (checkedArea !== null) {
      const result = await GetTablesInArea.mutateAsync([
        coffeeShopId,
        getValues("area")._id,
        getValues("from"),
        getValues("to"),
        getValues("date"),
      ]);
      if (result.status === 200) {
        const sortedData = result.data.sort((a, b) =>
          a.tableTypeId.localeCompare(b.tableTypeId)
        );
        setTables(sortedData);
      } else {
        toastError(result.message);
      }
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  //* Step Content
  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <Grid item md={5} xs={12}>
            <div className="flex flex-col gap-5 justify-center items-center gap-x-3 border-2 rounded-lg border-orange-200 p-5 w-[79rem] h-[50vh]">
              <h1 className="text-center text-primary font-semibold">
                How many people are you intend to visit ?
              </h1>

              <div className="flex justify-between gap-10">
                <Tooltip title="Adult">
                  <div className="flex items-center justify-center gap-5">
                    <span>
                      <IoPeople size="3rem" className="text-secondary" />
                    </span>

                    <Controller
                      name="adult"
                      control={control}
                      defaultValue={1}
                      rules={{ required: true, min: 1, max: 10 }}
                      render={({ field: { onChange, value } }) => (
                        <QuantityControl
                          value={value}
                          // showValue={false}
                          onIncrement={() => onChange(Number(value) + 1)}
                          onDecrement={() => onChange(Number(value) - 1)}
                        />
                      )}
                    />
                  </div>
                </Tooltip>
                <Tooltip title="Children">
                  <div className="flex items-center justify-center gap-5">
                    <span>
                      <FaChildren size="3rem" className="text-secondary" />
                    </span>

                    <Controller
                      name="children"
                      control={control}
                      defaultValue={0}
                      rules={{ min: 0, max: 10 }}
                      render={({ field: { onChange, value } }) => (
                        <QuantityControl
                          isChildren={true}
                          value={value}
                          onIncrement={() => onChange(Number(value) + 1)}
                          onDecrement={() =>
                            value > 0 && onChange(Number(value) - 1)
                          }
                        />
                      )}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="absolute left-0 bottom-0 ml-4 mb-4">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                style={{
                  backgroundColor: activeStep === 0 ? "#d9d9d9" : "#a3a3a3",
                  color: "black",
                  width: "12vw",
                }}
              >
                <MdSkipPrevious />
                Back
              </Button>
            </div>
            <div className="absolute right-0 bottom-0 mr-4 mb-2">
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextPeople}
                style={{
                  backgroundColor: `${"#ff9933"}`,
                  color: "black",
                  width: "12vw",
                }}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
                <MdOutlineSkipNext />
              </Button>
            </div>
          </Grid>
        );
      case 1:
        return (
          <Grid item md={7} xs={12}>
            <div className="flex flex-col align-middle items-center justify-center gap-y-5 border-2 rounded-lg border-orange-200 p-3 w-[79rem] h-[50vh]">
              <h1 className="text-center text-primary font-semibold">
                When are you going to visit us ?
              </h1>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div
                    className="flex items-center gap-3"
                    onKeyDown={(event) => event.preventDefault()}
                  >
                    {/* Date */}
                    <Tooltip
                      PopperProps={{
                        disablePortal: true,
                      }}
                      onClose={() => setDateToolTip(false)}
                      open={dateToolTip}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={
                        <span style={{ fontSize: "0.8vw" }}>
                          Please select date!!!
                        </span>
                      }
                      arrow
                    >
                      <span>
                        <Controller
                          name="date"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange } }) => (
                            <DatePicker
                              label="Date"
                              value={datePicker ? dayjs(datePicker) : null}
                              format="DD/MM/YYYY"
                              sx={{ width: "200px" }}
                              // value={value || ""} // Use null instead of undefined
                              onChange={(date) => {
                                onChange(
                                  date ? date.toDate().toISOString() : null
                                );
                                setDatePicker(
                                  date ? date.toDate().toISOString() : null
                                );
                                console.log("date", date);
                                console.log("datePicker", datePicker);
                              }}
                              error={!!errors.date}
                              slotProps={{
                                textField: {
                                  helperText: errors.date
                                    ? "Date is required"
                                    : null,
                                },
                              }}
                              shouldDisableDate={(date) =>
                                !openDay.includes(dayNames[date.day()])
                              }
                              disablePast
                            />
                          )}
                        />
                      </span>
                    </Tooltip>
                    <div className="mx-3"></div>
                    {/* Time: from */}
                    <Tooltip
                      PopperProps={{
                        disablePortal: true,
                      }}
                      onClose={() => setFromToolTip(false)}
                      open={fromToolTip}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={
                        <span style={{ fontSize: "0.8vw" }}>
                          Please select start time!!!
                        </span>
                      }
                      arrow
                    >
                      <span>
                        <Controller
                          name="from"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, value } }) => (
                            <TimePicker
                              disabled={datePicker === null ? true : false}
                              label="From"
                              sx={{ width: "140px" }}
                              value={
                                getValues("from")
                                  ? dayjs(`1970-01-01T${getValues("from")}`)
                                  : null
                              }
                              color="warning"
                              minutesStep={30}
                              minTime={
                                dayjs().isSame(dayjs(datePicker), "day")
                                  ? dayjs().add(1, "hour")
                                  : dayjs()
                                      .set("hour", openTime.getHours())
                                      .set("minute", openTime.getMinutes())
                              }
                              maxTime={dayjs().set(
                                "hour",
                                closeTime.getHours()
                              )}
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
                                setTimeFrom(formattedTime);
                                onChange(formattedTime);
                              }}
                              error={!!errors.from}
                              slotProps={{
                                textField: {
                                  helperText: errors.from
                                    ? "Time is required"
                                    : null,
                                },
                              }}
                            />
                          )}
                        />
                      </span>
                    </Tooltip>

                    <HiOutlineMinus className="mx-1" />
                    {/* Time: to */}
                    <Tooltip
                      PopperProps={{
                        disablePortal: true,
                      }}
                      onClose={() => setToToolTip(false)}
                      open={toToolTip}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={
                        <span style={{ fontSize: "0.8vw" }}>
                          Please select end time!!!
                        </span>
                      }
                      arrow
                    >
                      <span>
                        <Controller
                          name="to"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange } }) => (
                            <TimePicker
                              label="To"
                              disabled={datePicker === null ? true : false}
                              value={
                                getValues("to")
                                  ? dayjs(`1970-01-01T${getValues("to")}`)
                                  : null
                              }
                              sx={{ width: "140px" }}
                              minutesStep={30}
                              minTime={
                                dayjs().isSame(dayjs(datePicker), "day")
                                  ? dayjs().add(1, "hour")
                                  : dayjs()
                                      .set("hour", openTime.getHours())
                                      .set("minute", openTime.getMinutes())
                              }
                              maxTime={dayjs().set(
                                "hour",
                                closeTime.getHours()
                              )}
                              onChange={(time) => {
                                if (time) {
                                  // console.log('time', time);
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
                                  setValue("to", formattedTime);
                                  setTimeTo(formattedTime);
                                } else {
                                  onChange("");
                                }
                              }}
                              error={!!errors.to}
                              slotProps={{
                                textField: {
                                  helperText: errors.to
                                    ? "Time is required"
                                    : null,
                                },
                              }}
                            />
                          )}
                        />
                      </span>
                    </Tooltip>
                  </div>
                </LocalizationProvider>
              </div>
              <div className="absolute left-0 bottom-0 ml-4 mb-4">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  style={{
                    backgroundColor: "#a3a3a3",
                    color: "black",
                    width: "12vw",
                  }}
                >
                  <MdSkipPrevious />
                  Back
                </Button>
              </div>
              <div
                className="absolute right-0 bottom-0 mr-4 mb-2"
                onMouseEnter={() => handleHoverTimePicker()}
                onMouseLeave={() => {
                  setFromToolTip(false);
                  setToToolTip(false);
                  setDateToolTip(false);
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextDate}
                  style={{
                    opacity: `${
                      !datePicker || !watchFrom || !watchTo ? 0.4 : 1
                    }`,
                    backgroundColor: `${"#ff9933"}`,
                    color: "black",
                    width: "12vw",
                  }}
                  disabled={!datePicker || !watchFrom || !watchTo}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  <MdOutlineSkipNext />
                </Button>
              </div>
            </div>
          </Grid>
        );
      case 2:
        return (
          <>
            <Grid item md={6} xs={12}>
              <div>
                <div className="px-1 border-solid border-2 border-orange-200 rounded-large w-[79rem]  items-center h-[80vh]">
                  <h1 className="text-center text-primary font-semibold">
                    Where would you want to book ?
                  </h1>
                  <div className="flex justify-center items-start  gap-9">
                    {/* render area list */}
                    {areas.data
                      .slice(currentPage * 4, (currentPage + 1) * 4)
                      .map((area, idx) => {
                        return (
                          <div
                            key={idx}
                            className={`w-[20vw] ${
                              !area.isChildAllowed && children > 0
                                ? "pointer-events-none opacity-50"
                                : ""
                            }`}
                            onClick={() => handleCheckArea(idx, area._id)}
                          >
                            <CardItem
                              img={
                                area.images.length !== 0
                                  ? area.images[0].url
                                  : EmptyBox
                              }
                              title={area.name}
                              firstInfoLabel={<FaChildren />}
                              firstInfo={
                                area.isChildAllowed
                                  ? "Child allowed"
                                  : "Child not allowed"
                              }
                              classNameProps={
                                checkedArea === idx
                                  ? " my-12 px-6 py-6 border-3 border-orange-500 rounded-lg shadow-md flex md:flex-row sm:flex-col justify-between cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-900 focus:ring-opacity-50"
                                  : "my-12 px-6 py-6 border-solid rounded-lg shadow-md flex md:flex-row sm:flex-col justify-between cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                              }
                            >
                              <Button
                                variant="contained"
                                className="m-auto w-full"
                                color="primary"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  console.log("Button clicked"); // A
                                  handleViewCatList(idx, area._id);
                                }}
                              >
                                View cat in this area
                              </Button>
                            </CardItem>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <div className="absolute left-0 bottom-0 ml-4 mb-4">
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      style={{
                        backgroundColor: "#a3a3a3",
                        color: "black",
                        width: "12vw",
                      }}
                    >
                      <MdSkipPrevious />
                      Back
                    </Button>
                  </div>
                  <div className="absolute right-0 bottom-0 mr-4 mb-4">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNextArea}
                      style={{
                        opacity: `${checkedArea === null ? 0.4 : 1}`,
                        backgroundColor: `${"#ff9933"}`,
                        color: "black",
                        width: "12vw",
                      }}
                      disabled={checkedArea === null}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      <MdOutlineSkipNext />
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
          </>
        );
      case 3:
        return (
          <>
            <Grid item md={6} xs={12}>
              <div className="px-6 border-solid border-2 border-orange-200 rounded-large w-[79rem] flex flex-col items-center justify-center  h-[50vh]">
                <h1 className="text-center text-primary font-semibold">
                  See available tables in this area
                </h1>
                <div className="mt-4 h-screen overflow-y-auto flex flex-wrap">
                  {tables.map((table, idx) => {
                    return (
                      <div key={idx} className="w-[16rem] p-2">
                        <div
                          onClick={() =>
                            handleCheckTable(idx, table.tableTypeId)
                          }
                          className={`mt-10 px-4 py-3 border-solid rounded-large shadow-md flex flex-col justify-between items-center gap-2 cursor-pointer hover:bg-orange-300 focus:ring-8 focus:ring-orange-500 ${
                            table.maxSeat <
                            (getValues("adult") || 0) +
                              (getValues("children") || 0)
                              ? "pointer-events-none bg-orange-400 opacity-50"
                              : checkedTable === idx
                              ? "border-4 border-orange-900 bg-orange-400"
                              : "bg-orange-400"
                          }`}
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            className="text-xl text-white mb-2 whitespace-nowrap"
                          >
                            {table.name}
                          </Typography>
                          <Typography
                            variant="h8"
                            fontWeight="bold"
                            className="text-lg text-orange-900 whitespace-nowrap"
                          >
                            {FormatNumber(table.price)} VND / 1hour
                          </Typography>
                          <Typography
                            variant="h8"
                            fontWeight="bold"
                            className="text-lg text-orange-900 whitespace-nowrap"
                          >
                            Available Table: {table.count - table.bookedTable}/
                            {table.count}
                          </Typography>

                          {table.count - table.bookedTable === 0 &&
                            table.maxSeat >=
                              (getValues("adult") || 0) +
                                (getValues("children") || 0) && (
                              <Button
                                variant="contained"
                                style={{
                                  borderRadius: 10, // Smaller border radius
                                  height: 50, // Smaller height
                                }}
                                color="primary"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  getAvailableTimeTable(table.tableTypeId);
                                }}
                              >
                                Check out available time{" "}
                              </Button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="absolute left-0 bottom-0 ml-4 mb-4">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  style={{
                    backgroundColor: "#a3a3a3",
                    color: "black",
                    width: "12vw",
                  }}
                >
                  Back
                </Button>
              </div>
              <div className="absolute right-0 bottom-0 mr-4 mb-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFinalStep}
                  style={{
                    opacity: `${checkedTable === null ? 0.4 : 1}`,
                    backgroundColor: `${"#ff9933"}`,
                    color: "black",
                    width: "12vw",
                  }}
                  disabled={checkedTable === null}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  <MdOutlineSkipNext />
                </Button>
              </div>
            </Grid>
          </>
        );
      case 4:
        return (
          <>
            <div className="px-1 border-solid border-2 border-orange-200 rounded-large w-[79rem]  items-center h-[vh] flex flex-col gap-7">
              <div className="max-w-md mx-auto mt-5">
                <BookingInfo
                  numberOfAdults={adult}
                  numberOfChildren={children}
                  coffeeShopName={coffeeShopName}
                  startTime={timeFrom}
                  endTime={timeTo}
                  chosenAreaName={chosenAreaName}
                  chosenTableName={chosenTableName}
                  date={datePicker}
                  totalBookingPrice={totalBookingPrice}
                />
              </div>
              <div className="flex justify-between gap-9 pb-5">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="contained"
                  style={{
                    backgroundColor: "#a3a3a3",
                    color: "black",
                    width: "20vw",
                  }}
                >
                  <MdSkipPrevious />
                  Back
                </Button>

                <Button
                  // onClick={handleReset}
                  onClick={handleOpenCancel}
                  variant="contained"
                  color="error"
                  className="w-[20vw] mt-4"
                >
                  Cancel Booking
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  style={{
                    bacgroundColor: "#ff9933",
                    color: "white",
                    width: "20vw",
                  }}
                  // disabled={checkedArea === null || checkedTable === null}
                  color="primary"
                  className="w-[20vw] mt-4"
                  margin="normal"
                >
                  Continue booking
                </Button>
              </div>
            </div>
          </>
        );
      default:
        return <h1></h1>;
    }
  }

  return (
    <PageTransition>
      {isBookingLoading && <Loading />}

      <div className="bg-orange-100">
        <Link
          to={`/coffeeShops/${coffeeShopId}`}
          onClick={(event) => {
            event.preventDefault();
            handleOpenExit();
          }}
        >
          <div className=" mx-1 flex gap-3 items-center bg-orange-900 w-fit rounded-lg px-3 py-1 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in cursor-pointer hover:text-orange-500">
            <FaLongArrowAltLeft
              size="2rem"
              className="text-orange-200 transition-colors duration-200 ease-in"
            />
            <h2 className="text-lg font-semibold text-orange-200 transition-colors duration-200 ease-in">
              Return to {coffeeShopName} page
            </h2>
          </div>
        </Link>

        <div className="flex mt-5 gap-5 justify-between px-5 pb-3">
          <div className="flex gap-3 text-primary items-center mr-auto ">
            <FaStore size="2rem" />
            <span className="font-semibold text-primary">{coffeeShopName}</span>
          </div>
          <div className="flex justify-start gap-5">
            {adult + children > 0 && (
              <SaveBookingInfo
                IconComponent={IoPeople}
                value={`${adult + children} (${adult} ${
                  adult > 1 ? "adults" : "adult"
                } and ${
                  children > 1
                    ? children + " children"
                    : children === 1
                    ? "1 child"
                    : "no children"
                })`}
              />
            )}

            {datePicker && (
              <SaveBookingInfo
                IconComponent={FaCalendarAlt}
                value={new Date(datePicker).toLocaleDateString()}
              />
            )}

            {timeFrom && timeTo && (
              <SaveBookingInfo
                IconComponent={FaClock}
                value={`${convertTo24Hour(timeFrom).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )} - ${convertTo24Hour(timeTo).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}`}
              />
            )}

            {chosenAreaName && chosenAreaName !== 0 && (
              <SaveBookingInfo
                IconComponent={FaStairs}
                value={chosenAreaName}
              />
            )}

            {chosenTableName && chosenTableName !== 0 && (
              <SaveBookingInfo
                IconComponent={MdTableBar}
                value={chosenTableName}
              />
            )}
          </div>
        </div>
      </div>

      {/* <h1 className='text-xl font-bold '>More Page</h1> */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-orange-100">
        <div className="container px-2 grid grid-cols-[auto_2fr] auto-cols-auto bg-orange-100">
          <div className="my-10 overflow-y-auto max-h-[90vh] min-w-[200px]">
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel className="text-5xl">{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          <div className="bg-orange-50 shadow-lg rounded-lg p-6 flex flex-col items-center justify-center relative px-5 overflow-x-hidden ">
            <div
              className={`transform transition-all duration-500 ${
                trigger
                  ? "translate-y-0 opacity-100"
                  : "translate-y-0 opacity-100"
              } max-h-[80vh] overflow-auto w-full`} // Add w-full here
            >
              {getStepContent(activeStep)}
            </div>
          </div>
        </div>
      </form>

      {/* Confirm exiting  */}
      <Dialog
        open={exitDialog}
        onClose={handleCloseExit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h1 className="text-center text-red-500">Exiting booking ?</h1>
        </DialogTitle>
        <DialogContent>
          <span className="text-lg text-gray-700 font-semibold">
            If you exit now, all your booking information{" "}
            <span className="font-bold text-red-500 uppercase">
              will be erased
            </span>
            . Are you sure you want to proceed?
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExit}>Disagree</Button>
          <Button
            onClick={() => navigate(`/coffeeShops/${coffeeShopId}`)}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Cancel */}
      <Dialog
        open={cancelDialog}
        onClose={handleCloseCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h1 className="text-center text-red-500">Cancel your booking ?</h1>
        </DialogTitle>
        <DialogContent>
          <span className="text-lg text-gray-700 font-semibold">
            If you cancel your booking, all your booking information{" "}
            <span className="font-bold text-red-500 uppercase">
              will be erased
            </span>
            . Are you sure you want to proceed?
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel}>Disagree</Button>
          <Button onClick={handleReset} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

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
            Available time in the store
          </DialogTitle>
          <DialogContent className="flex flex-col items-center justify-center">
            <br />
            <div className="grid grid-cols-3 justify-center text-center border-2 rounded-xl border-orange-200">
              {(() => {
                let uniqueIdx = 1; // Create a counter outside of the map functions
                return [`Morning`, "Evening", "Night"].map(
                  (period, periodIdx) => (
                    <div key={period} className="border border-orange-200 ">
                      <Typography
                        variant="h6"
                        className="border border-orange-200  bg-orange-200 p-2"
                      >
                        {period}
                      </Typography>
                      <div className="mt-5"></div>
                      {availableTime
                        ?.filter((time) => {
                          const hour = new Date(time.startTime).getHours();
                          return (
                            (periodIdx === 0 && hour < 12) || // Morning: before 12:00
                            (periodIdx === 1 && hour >= 12 && hour < 18) || // Evening: 12:00-17:59
                            (periodIdx === 2 && hour >= 18) // Night: after 18:00
                          );
                        })
                        .map((time) => {
                          const currentIdx = uniqueIdx++; // Increment the counter for each button
                          return (
                            <Button
                              key={currentIdx}
                              sx={{ mb: 3 }}
                              variant={
                                buttonClicked === currentIdx
                                  ? "contained"
                                  : "outlined" // Use a unique value for each button
                              }
                              color="warning"
                              onClick={() => handleClick(currentIdx)}
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
                          );
                        })}
                    </div>
                  )
                );
              })()}
            </div>
          </DialogContent>
        </div>
        <DialogActions>
          {buttonClicked !== 0 && (
            <Button
              color="warning"
              onClick={() => handleSelectDate()}
              style={{ border: "1px solid #ff9933" }} // Add border and background color here
            >
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Cat area detail */}
      {open && (
        <CustomDrawer
          styles={{ width: "40%" }}
          showModel={open}
          setShowModel={setOpen}
          renderBody={<Cats cats={cats} />}
          message={{ header: "Cats in this area", primaryBtn: "Done" }}
        />
      )}
    </PageTransition>
  );
};

export default Booking;
