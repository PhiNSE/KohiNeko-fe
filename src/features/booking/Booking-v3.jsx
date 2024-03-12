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
} from '@mui/material';
import { useForm, Controller, set, get } from 'react-hook-form';
import EmptyBox from '../../assets/empty_box.png';
import {
  HiLocationMarker,
  HiBookOpen,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineMinus,
} from 'react-icons/hi';
import { useCallback, useEffect, useState } from 'react';
import CustomDrawer from '../../components/CustomDrawer';
import { DateTimeFormater } from '../../utils/DateFormater';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAreasInAShop, getCatsInArea } from '../../services/apiArea';
import { booking, getAvailableTime } from '../../services/apiBooking';
import { toastError } from '../../components/Toast';
import { useNavigate, useParams } from 'react-router-dom';
import { getTablesInArea } from '../../services/apiTable';
import { getOpenAndCloseTime } from '../../services/apiShops';
import FormatNumber from '../../utils/NumberFormatter';
import Cats from './Cats';
import Loader from '../../components/Loader';
import Loading from '../../components/Loading';
import CardItem from '../../components/CardItem';
import { FaChild, FaChildren } from 'react-icons/fa6';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import BookingInfo from './BookingInfo';

import PaginationCustom from '../../components/PaginationCustom';
import QuantityControl from '../../components/QuantityControl';
import PageTransition from '../../pages/PageTransition';
import { IoPeople } from 'react-icons/io5';

function getSteps() {
  return [
    'Select number of people',
    'Select Date Time',
    'Select area',
    'Select table',
  ];
}

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
  const adult = watch('adult') || 0;
  const children = watch('children') || 0;
  const navigate = useNavigate();
  const { coffeeShopId } = useParams();
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [openTime, setOpenTime] = useState(new Date());
  const [closeTime, setCloseTime] = useState(new Date());
  const [datePicker, setDatePicker] = useState(null);

  //Bien tam
  const [chosenAreaName, setChosenAreaName] = useState(null);
  const [chosenTableName, setChosenTableName] = useState(null);
  const [coffeeShopName, setCoffeeShopName] = useState(null);
  const [timeFrom, setTimeFrom] = useState(null);
  const [timeTo, setTimeTo] = useState(null);

  //* Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const watchFrom = watch('from');
  const watchTo = watch('to');

  const handlePageChange = useCallback((value) => {
    setCurrentPage(value);
  }, []);
  //* Stepped Form
  const [activeStep, setActiveStep] = useState(0);
  const [trigger, setTrigger] = useState(false);
  const steps = getSteps();
  useEffect(() => {
    const timer = setTimeout(() => setTrigger(false), 500); // Reset the trigger after the transition duration
    return () => clearTimeout(timer); // Clean up on component unmount
  }, []);

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    reset();
  };
  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <Grid item md={5} xs={12}>
            <div className='flex flex-col gap-5 items-center gap-x-3 border-2 rounded-lg border-orange-200 p-3 w-[80rem]'>
              <h1 className='text-center text-primary font-semibold'>
                How many people are you intend to visit ?
              </h1>

              <div className='flex justify-between gap-10'>
                <div className='flex items-center justify-center gap-5'>
                  <IoPeople size='3rem' className='text-primary' />
                  <Controller
                    name='adult'
                    control={control}
                    defaultValue={1}
                    rules={{ required: true, min: 1, max: 10 }}
                    render={({ field: { onChange, value } }) => (
                      <QuantityControl
                        value={value}
                        onIncrement={() => onChange(Number(value) + 1)}
                        onDecrement={() => onChange(Number(value) - 1)}
                      />
                    )}
                  />
                </div>

                <div className='flex items-center justify-center gap-5'>
                  <FaChildren size='3rem' className='text-secondary' />
                  <Controller
                    name='children'
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
              </div>
            </div>
            <div className='absolute left-0 bottom-0 ml-4 mb-4'>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className='bg-gray-300 px-4 py-2 rounded'
              >
                Back
              </Button>
            </div>
            <div className='absolute right-0 bottom-0 mr-4 mb-2'>
              <Button
                variant='contained'
                color='primary'
                onClick={handleNext}
                className='bg-blue-500 text-white px-4 py-2 rounded'
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </Grid>
        );
      case 1:
        return (
          <Grid item md={7} xs={12}>
            <div className='flex flex-col align-middle items-center gap-y-5 border-2 rounded-lg border-orange-200 p-3 w-[80rem]'>
              <h1 className='text-center text-primary font-semibold'>
                When are you going to visit us ?
              </h1>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className='flex items-center gap-3'>
                    {/* Date */}
                    <Controller
                      name='date'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange } }) => (
                        <DatePicker
                          label='Date'
                          format='DD/MM/YYYY'
                          sx={{ width: '200px' }}
                          // value={value || ""} // Use null instead of undefined
                          onChange={(date) => {
                            console.log(getValues('from'));
                            onChange(date ? date.toDate().toISOString() : null);
                            setDatePicker(
                              date ? date.toDate().toISOString() : null
                            );
                          }}
                          error={!!errors.date}
                          slotProps={{
                            textField: {
                              helperText: errors.date
                                ? 'Date is required'
                                : null,
                            },
                          }}
                          disablePast
                        />
                      )}
                    />
                    <div className='mx-3'></div>
                    {/* Time: from */}
                    <Controller
                      name='from'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => (
                        <TimePicker
                          disabled={datePicker === null ? true : false}
                          label='From'
                          // value={null}
                          // value={getValues("from") || null}
                          sx={{ width: '140px' }}
                          color='warning'
                          minutesStep={30}
                          minTime={dayjs()
                            .set('hour', openTime.getHours())
                            .set('minute', openTime.getMinutes())}
                          maxTime={dayjs().set('hour', closeTime.getHours())}
                          // minTime={dayjs().set("hour", 7).set("minute", 30)}
                          // maxTime={dayjs().set("hour", 11)}
                          onChange={(time) => {
                            console.log('time', time);
                            const date = time.toDate();
                            const formattedTime = `${date
                              .getHours()
                              .toString()
                              .padStart(2, '0')}:${date
                              .getMinutes()
                              .toString()
                              .padStart(2, '0')}:${date
                              .getSeconds()
                              .toString()
                              .padStart(2, '0')}`;
                            setValue('from', formattedTime);
                            setTimeFrom(formattedTime);
                            onChange(formattedTime);
                          }}
                          error={!!errors.from}
                          slotProps={{
                            textField: {
                              helperText: errors.from
                                ? 'Time is required'
                                : null,
                            },
                          }}
                        />
                      )}
                    />
                    <HiOutlineMinus className='mx-1' />
                    {/* Time: to */}
                    <Controller
                      name='to'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange } }) => (
                        <TimePicker
                          label='To'
                          disabled={datePicker === null ? true : false}
                          sx={{ width: '140px' }}
                          minutesStep={30}
                          minTime={dayjs()
                            .set('hour', openTime.getHours())
                            .set('minute', openTime.getMinutes())}
                          maxTime={dayjs().set('hour', closeTime.getHours())}
                          onChange={(time) => {
                            if (time) {
                              // console.log('time', time);
                              const date = time.toDate();
                              const formattedTime = `${date
                                .getHours()
                                .toString()
                                .padStart(2, '0')}:${date
                                .getMinutes()
                                .toString()
                                .padStart(2, '0')}:${date
                                .getSeconds()
                                .toString()
                                .padStart(2, '0')}`;
                              onChange(formattedTime);
                              setValue('to', formattedTime);
                              setTimeTo(formattedTime);
                            } else {
                              onChange('');
                            }
                          }}
                          error={!!errors.to}
                          slotProps={{
                            textField: {
                              helperText: errors.to ? 'Time is required' : null,
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </LocalizationProvider>
              </div>
              <div className='absolute left-0 bottom-0 ml-4 mb-4'>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className='bg-gray-300 px-4 py-2 rounded'
                >
                  Back
                </Button>
              </div>
              <div className='absolute right-0 bottom-0 mr-4 mb-2'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleNext}
                  className='bg-blue-500 text-white px-4 py-2 rounded'
                  disabled={!datePicker || !watchFrom || !watchTo}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </Grid>
        );
      case 2:
        return (
          <>
            <Grid item md={6} xs={12}>
              <div className='px-1 border-solid border-2 border-orange-200 rounded-large w-[80rem] h-[30rem]'>
                {/* <Typography sx={{ mt: 1, ml: 5 }} variant='h5'>
                3. Choose area in this shop
              </Typography> */}
                <h1 className='text-center text-primary font-semibold'>
                  Where would you want to book ?
                </h1>
                <div className='flex justify-center items-start  gap-9'>
                  {/* render area list */}
                  {areas.data
                    .slice(currentPage * 4, (currentPage + 1) * 4)
                    .map((area, idx) => {
                      return (
                        <div
                          key={idx}
                          className={`w-[23vw] ${
                            !area.isChildAllowed && children > 0
                              ? 'pointer-events-none opacity-50'
                              : ''
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
                                ? 'Child allowed'
                                : 'Child not allowed'
                            }
                            // secondInfo={
                            //   <>
                            //     {" "}
                            //     <HiBookOpen className="mr-1" size={25} />
                            //   </>
                            // }
                            classNameProps={
                              checkedArea === idx
                                ? ' my-12 px-6 py-6 border-2 border-orange-500 rounded-lg shadow-md flex md:flex-row sm:flex-col justify-between cursor-pointer hover:bg-gray-100'
                                : 'my-12 px-6 py-6 border-solid rounded-lg shadow-md flex md:flex-row sm:flex-col justify-between cursor-pointer hover:bg-gray-100'
                            }
                          >
                            <Button
                              variant='contained'
                              className='m-auto w-full'
                              color='primary'
                              onClick={(event) => {
                                event.stopPropagation();
                                console.log('Button clicked'); // A
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
                {/* Pagination */}
                {areas.data.length > 0 && (
                  <div>
                    <PaginationCustom
                      count={Math.ceil(areas.data.length / 4)}
                      page={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
              <div className='absolute left-0 bottom-0 ml-4 mb-4'>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className='bg-gray-300 px-4 py-2 rounded'
                >
                  Back
                </Button>
              </div>
              <div className='absolute right-0 bottom-0 mr-4 mb-4'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleNext}
                  className='bg-blue-500 text-white px-4 py-2 rounded'
                  disabled={checkedArea === null}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </Grid>
          </>
        );
      case 3:
        return (
          <>
            <Grid item md={6} xs={12}>
              <div className='px-6 border-solid border-2 border-orange-200 rounded-large w-[80rem] h-[30rem]'>
                <h1 className='text-center text-primary font-semibold'>
                  See available tables in this area
                </h1>
                <div className='mt-4 h-screen overflow-y-auto'>
                  <Grid container spacing={2}>
                    {tables.map((table, idx) => {
                      return (
                        <Grid key={idx} item md={12} xs={12}>
                          <div
                            key={idx}
                            onClick={() =>
                              handleCheckTable(idx, table.tableTypeId)
                            }
                            className={
                              'text-white bg-primary my-10 px-4 py-3 border-solid rounded-large shadow-md flex md:flex-col sm:flex-col justify-between items-center cursor-pointer hover:bg-secondary focus:ring-4 focus:ring-secondary'
                            }
                            style={
                              table.maxSeat <
                              (getValues('adult') || 0) +
                                (getValues('children') || 0)
                                ? {
                                    pointerEvents: 'none',
                                    backgroundColor: 'grey',
                                  }
                                : checkedTable === idx
                                ? { border: ' 2px solid #FF7828' }
                                : {}
                            }
                          >
                            <Typography variant='h6' fontWeight='bold'>
                              {table.name}
                            </Typography>
                            <Typography variant='h6' fontWeight='bold'>
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
              <div className='absolute left-0 bottom-0 ml-4 mb-4'>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className='bg-gray-300 px-4 py-2 rounded'
                >
                  Back
                </Button>
              </div>
              <div className='absolute right-0 bottom-0 mr-4 mb-4'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleNext}
                  className='bg-blue-500 text-white px-4 py-2 rounded'
                  disabled={checkedTable === null}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </Grid>
          </>
        );
      default:
        return <h1></h1>;
    }
  }

  const {
    isLoading,
    data: areas,
    error,
  } = useQuery({
    queryKey: ['areas', coffeeShopId],
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
      setValue('area', {
        _id: areas.data[checkedArea]._id,
        coffeeShopId: areas.data[checkedArea].coffeeShopId,
      });
    }
  }, [areas, checkedArea]);

  useEffect(() => {
    console.log('adult', adult, 'children', children);
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
  if (error) return 'An error has occurred: ' + error.message;

  const handleClick = (index) => {
    console.log(index);
    if (index !== buttonClicked) {
      setButtonClicked(index);
    } else {
      setButtonClicked(0);
    }
  };

  const handleCheckArea = async (check, areaId) => {
    setCheckedArea(check);
    setChosenAreaName(areas.data[check].name);
    console.log(areas.data[check].name);
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
    setChosenTableName(tables[check].name);
    setCheckedTable(check);
    setValue('tableTypeId', tableTypeId);
  };

  const handleSelectDate = async () => {
    const startTime = new Date(
      availableTime[buttonClicked - 1].startTime
    ).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const endTime = new Date(
      availableTime[buttonClicked - 1].endTime
    ).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    setValue('from', startTime);
    setValue('to', endTime);
    const response = await CreateBooking.mutateAsync(getValues());
    if (response.status === 200) {
      localStorage.setItem('booking', JSON.stringify(response.data));
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

    // setCheckedArea(null);
    // setCheckedTable(null);
    try {
      console.log('data', data);
      const response = await CreateBooking.mutateAsync(data);

      console.log('response', response);
      if (response.status === 200) {
        localStorage.setItem('booking', JSON.stringify(response.data));
        setOpenPopUp(1);
        reset();
      } else if (
        response.status === 'fail' &&
        response.message.includes('There is no table available in this time')
      ) {
        console.log(response.message);
        const res = await GetAvailableTime.mutateAsync(data);
        console.log('res', res);
        if (res.status === 200) {
          console.log('res', res);
          setIsBookingLoading(false);
          if (res.data.length === 0) {
            toastError('There is no table available in this time');
          } else {
            setAvailableTime(res.data);
            setOpenPopUp(2);
          }
        } else {
          setIsBookingLoading(false);
          console.log('error', res);
          toastError(res.message);
        }
      } else {
        setIsBookingLoading(false);
        console.log('error', response);
        toastError(response.message);
      }
    } catch (error) {
      console.log('Session is out please login again!!!', error);
      toastError('Session is out please login again!!!');
      navigate('/login');
    }
    setCheckedArea(null);
    setCheckedTable(null);
    setIsBookingLoading(false);
  };

  return (
    <PageTransition>
      {isBookingLoading && <Loading />}
      {/* <h1 className='text-xl font-bold '>More Page</h1> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='container mx-auto px-4'>
          <Stepper activeStep={activeStep} alternativeLabel className='my-8'>
            {steps.map((label) => (
              <Step key={label}>
                {/* <StepLabel>{label}</StepLabel> */}
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center relative'>
            {activeStep === steps.length ? (
              <div>
                {/* <Typography className='text-lg font-bold mb-4'>
                All steps completed
              </Typography> */}
                <BookingInfo
                  numberOfAdults={adult}
                  numberOfChildren={children}
                  coffeeShopName={coffeeShopName}
                  startTime={timeFrom}
                  endTime={timeTo}
                  chosenAreaName={chosenAreaName}
                  chosenTableName={chosenTableName}
                  date={getValues('date')}
                />
                <Button
                  type='submit'
                  variant='contained'
                  color='warning'
                  // disabled={checkedArea === null || checkedTable === null}
                  sx={{ width: '400px', mx: 'auto' }}
                  margin='normal'
                  endIcon={<HiOutlineChevronRight />}
                >
                  Book
                </Button>
                <Button
                  onClick={handleReset}
                  className='bg-blue-500 text-white px-4 py-2 rounded mt-4'
                >
                  Reset
                </Button>
              </div>
            ) : (
              <div>
                {/* <Typography className='text-lg font-bold mb-4'>
                {getStepContent(activeStep)}
              </Typography> */}

                <div>
                  {/* <div className="absolute left-0 bottom-0 ml-4 mb-4">
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      Back
                    </Button>
                  </div>
                  <div className="absolute right-0 bottom-0 mr-4 mb-4">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div> */}
                  <div
                    className={`transform transition-all duration-500 ${
                      trigger
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-0 opacity-100'
                    }`}
                  >
                    {getStepContent(activeStep)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Success booking */}
      <Dialog
        open={openPopUp === 1}
        onClose={() => setOpenPopUp(0)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        disableBackdropClick={true} // Disable closing dialog by clicking outside
        disableEscapeKeyDown={true} // Disable closing dialog by pressing Escape key
      >
        <div className='flex flex-col items-center justify-center'>
          <DialogTitle id='alert-dialog-title'>
            Your table have just been booked!
          </DialogTitle>
          <DialogContent className='flex flex-col items-center justify-center'>
            <HiOutlineCheckCircle size={80} color='green' />
            <DialogContentText id='alert-dialog-description'>
              Do you want to buy more item in our shop?
            </DialogContentText>
          </DialogContent>
        </div>
        <DialogActions>
          <Button
            color='warning'
            onClick={() => {
              setOpenPopUp(0);
              navigate('/purchase');
            }}
          >
            Check out my order
          </Button>
          <Button
            color='warning'
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
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        // disableBackdropClick={true} // Disable closing dialog by clicking outside
        disableEscapeKeyDown={true} // Disable closing dialog by pressing Escape key
      >
        <div className='flex flex-col items-center justify-center'>
          <DialogTitle id='alert-dialog-title'>
            Sorry, the time you want to book is currently unavailable!
          </DialogTitle>
          <DialogContent className='flex flex-col items-center justify-center'>
            <DialogContentText
              className='flex justify-center'
              id='alert-dialog-description'
            >
              Below are the available times in the store
            </DialogContentText>
            <br />
            <div className='grid grid-cols-3 justify-center text-center border-2 rounded-xl border-orange-200'>
              {(() => {
                let uniqueIdx = 1; // Create a counter outside of the map functions
                return [`Morning`, 'Evening', 'Night'].map(
                  (period, periodIdx) => (
                    <div key={period} className='border border-orange-200 '>
                      <Typography
                        variant='h6'
                        className='border border-orange-200  bg-orange-200 p-2'
                      >
                        {period}
                      </Typography>
                      <div className='mt-5'></div>
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
                                  ? 'contained'
                                  : 'outlined' // Use a unique value for each button
                              }
                              color='warning'
                              onClick={() => handleClick(currentIdx)}
                            >
                              {new Date(time.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(time.endTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
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
              color='warning'
              onClick={() => handleSelectDate()}
              style={{ border: '1px solid #ff9933' }} // Add border and background color here
            >
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Cat area detail */}
      {open && (
        <CustomDrawer
          styles={{ width: '40%' }}
          showModel={open}
          setShowModel={setOpen}
          renderBody={<Cats cats={cats} />}
          message={{ header: 'Cats in this area', primaryBtn: 'Done' }}
        />
      )}
    </PageTransition>
  );
};

export default Booking;
