import { ThemeProvider, Typography, createTheme } from "@mui/material";
import { orange } from "@mui/material/colors";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, set } from "react-hook-form";
import { HiOutlineMinus } from "react-icons/hi";

const RenderChooseTime = ({
  control,
  errors,
  day,
  selectedDayTime,
  setSelectedDayTime,
  disableDay,
  setErrorDay,
}) => {
  const theme = createTheme({
    palette: {
      primary: orange,
    },
  });

  const [dayTime, setDayTime] = useState(() => {
    const index = selectedDayTime.findIndex(
      (item) => item.day === (day || "All days")
    );
    if (index !== -1) {
      return {
        ...selectedDayTime[index],
      };
    } else {
      return {
        day: day || "All days",
        openHour: null,
        closeHour: null,
      };
    }
  });
  const [error, setError] = useState(null);

  const handleChangeTime = (time, identifier, error) => {
    if (error) {
      return;
    }
    if (identifier === 1) {
      setDayTime({ ...dayTime, openHour: time });
    } else if (identifier === 2) {
      setDayTime({ ...dayTime, closeHour: time });
    }
  };

  useEffect(() => {
    if (dayTime.openHour && dayTime.closeHour) {
      // check if day is already in selectedDayTime, overwrite it
      const index = selectedDayTime.findIndex(
        (item) => item.day === dayTime.day
      );
      if (index !== -1) {
        setSelectedDayTime((prev) => {
          const updatedSelectedDayTime = [...prev];
          updatedSelectedDayTime[index] = dayTime;
          return updatedSelectedDayTime;
        });
      } else {
        setSelectedDayTime((prev) => [...prev, dayTime]);
      }
    }
  }, [dayTime]);

  useEffect(() => {
    error ? setErrorDay(true) : setErrorDay(false);
  }, [error]);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <div className="flex items-center">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <Controller
              name="openHour"
              control={control}
              // rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TimePicker
                  label="Open time"
                  color="primary"
                  minutesStep={30}
                  // minTime={dayjs().set("hour", 7).set("minute", 30)}
                  // maxTime={dayjs().set("hour", 22)}
                  // value={openTime.openHour ? dayjs(openTime.openHour, "h:mm A") : dayjs(value)}
                  value={
                    dayTime?.openHour ? dayjs(dayTime.openHour, "h:mm A") : null
                  }
                  onChange={(time) => {
                    if (time) {
                      const date = time.toDate();
                      const formattedTime = date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });
                      if (
                        dayjs(formattedTime, "h:mm A").isAfter(
                          dayjs(dayTime.closeHour, "h:mm A")
                        ) ||
                        dayjs(formattedTime, "h:mm A").isSame(
                          dayjs(dayTime.closeHour, "h:mm A")
                        )
                      ) {
                        setError("Open time must be less than close time");
                        onChange(() =>
                          handleChangeTime(formattedTime, 1, "error")
                        );
                      } else {
                        setError(null);
                        onChange(() =>
                          handleChangeTime(formattedTime, 1, null)
                        );
                      }
                    } else {
                      onChange("");
                    }
                  }}
                  readOnly={
                    error === "Close time must be greater than open time"
                  }
                  disabled={disableDay}
                  error={!!errors.openHour}
                  slotProps={{
                    textField: {
                      helperText: errors.openHour ? "Time is required" : null,
                    },
                  }}
                />
              )}
            />
            <HiOutlineMinus className="mx-1" />
            <Controller
              name="closeHour"
              control={control}
              // rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TimePicker
                  label="Close time"
                  color="primary"
                  minutesStep={30}
                  value={
                    dayTime?.closeHour
                      ? dayjs(dayTime.closeHour, "h:mm A")
                      : null
                  }
                  onChange={(time) => {
                    if (time) {
                      const date = time.toDate();
                      const formattedTime = date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });
                      if (
                        dayjs(formattedTime, "h:mm A").isBefore(
                          dayjs(dayTime.openHour, "h:mm A")
                        ) ||
                        dayjs(formattedTime, "h:mm A").isSame(
                          dayjs(dayTime.openHour, "h:mm A")
                        )
                      ) {
                        setError("Close time must be greater than open time");
                        onChange(() =>
                          handleChangeTime(formattedTime, 2, "error")
                        );
                      } else {
                        setError(null);
                        onChange(() =>
                          handleChangeTime(formattedTime, 2, null)
                        );
                      }
                    } else {
                      onChange("");
                    }
                  }}
                  readOnly={error === "Open time must be less than close time"}
                  error={!!errors.closeHour}
                  slotProps={{
                    textField: {
                      helperText: errors.closeHour ? "Time is required" : null,
                    },
                  }}
                  disabled={!dayTime.openHour || disableDay} // Disable closeHour if openHour don't have value
                />
              )}
            />
          </LocalizationProvider>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
      </div>
    </ThemeProvider>
  );
};

export default RenderChooseTime;
