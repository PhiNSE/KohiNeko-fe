import { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import GetImage from "../../../components/GetImage";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, set } from "react-hook-form";
import dayjs from "dayjs";
import { HiChevronDown, HiOutlineMinus } from "react-icons/hi";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAreasInAShop,
  getCatsInArea,
  getStaffsInArea,
} from "../../../services/apiArea";
import { ManagerContext } from "../ManagerContext";
import LazyLoadImage from "../../../components/LazyLoadImage";
import { get1Cat } from "../../../services/apiCat";

const AssignStaff = ({
  watch,
  setValue,
  onFormUpdate,
  selectedStaff,
  fromTo,
  control,
}) => {
  const { coffeeShopId } = useContext(ManagerContext);
  const areaId = watch("areaId") || "";
  const startTime = watch("startTime") || "";
  const endTime = watch("endTime") || "";
  const [staffs, setStaffs] = useState([]);
  const { data: areas } = useQuery({
    queryKey: ["areas", coffeeShopId],
    queryFn: () => getAreasInAShop(coffeeShopId),
  });
  const GetStaffsInArea = useMutation({ mutationFn: getStaffsInArea });
  useEffect(() => {
    const fetchStaffsInArea = async () => {
      if (areaId) {
        const response = await GetStaffsInArea.mutateAsync([coffeeShopId, areaId]);
        if (response.status === 200) {
          console.log(response.data);
          setStaffs(response.data);
        }
      }
    };
    fetchStaffsInArea();
  }, [areaId]);

  useEffect(() => {
    const isFormFilled = areaId !== "";
    onFormUpdate(isFormFilled);
  }, [areaId, onFormUpdate]);

  useEffect(() => {
    console.log(staffs);
  }, [staffs]);

  return (
    <>
      <div className="my-2">
        <Typography variant="h5">Area</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Choose area</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Choose gender"
            color="primary"
            margin="normal"
            onChange={(event) => setValue("areaId", event.target.value)}
          >
            {areas?.data &&
              areas?.data.map((area) => (
                <MenuItem
                  key={area._id}
                  value={area._id}
                  disabled={selectedStaff.area === area.name}
                >
                  {area.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Grid container spacing={1}>
          {staffs.length > 0 ? (
            staffs.map((staff, idx) => (
              <Grid key={idx} item xs={12} md={6}>
                <div className="border-2 rounded-lg p-2">
                  <div className="w-full h-[20vh]">
                    <LazyLoadImage
                      src={staff.avatar}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-between gap-1 p-2">
                    <h1 className="text-primary text-2xl font-bold">
                      {staff.username}
                    </h1>
                    <Typography className="text-justify text-sm text-gray-700">
                      {staff.email}
                    </Typography>
                  </div>
                </div>
              </Grid>
            ))
          ) : (
            <>No staff in this area</>
          )}
        </Grid>
        <Typography variant="h5">Choose time (Optional)</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="my-4 flex justify-between items-center">
            <Controller
              name="startTime"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Start Time"
                  margin="normal"
                  format="DD/MM/YYYY"
                  sx={{ width: "100%" }}
                  value={fromTo[0] ? dayjs(fromTo[0].startTime) : null}
                  onChange={(date) => onChange(date || null)}
                  disablePast
                />
              )}
            />
            <HiOutlineMinus className="mx-2" />
            <Controller
              name="endTime"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="End Time"
                  margin="normal"
                  format="DD/MM/YYYY"
                  sx={{ width: "100%" }}
                  value={fromTo[0] ? dayjs(fromTo[0].endTime) : null}
                  onChange={(date) => onChange(date || null)}
                />
              )}
            />
          </div>
          {dayjs(startTime).isAfter(dayjs(endTime)) && (
            <p className="text-center text-red-500">
              Start time cannot be greater than end time
            </p>
          )}
        </LocalizationProvider>
        <p className="text-center">
          If dont assign start time, the time will be set to current time
        </p>
        <p className="text-center">
          If dont assign end time, the time will be set to forever
        </p>
      </div>
    </>
  );
};

export default AssignStaff;
