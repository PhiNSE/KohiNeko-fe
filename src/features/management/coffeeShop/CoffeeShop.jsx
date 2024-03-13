import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createShop,
  getShopByUserId,
  updateShop,
} from '../../../services/apiShops';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import EmptyBox from '../../../assets/empty_box.png';
import emptyImg from '../../../assets//EmptyImg.jpg';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import CustomDrawer from '../../../components/CustomDrawer';
import { useForm } from 'react-hook-form';
import AddShop from './AddShop';
import { toastError, toastSuccess } from '../../../components/Toast';
import { createShopImage, deleteShopImage } from '../../../services/apiImage';
import { ManagerContext } from '../ManagerContext';
import Splide from '@splidejs/splide';
import { SplideSlide } from '@splidejs/react-splide';
import CarouselImgae from '../../../components/CarouselImgae';
import {
  FaBookBookmark,
  FaBowlFood,
  FaCat,
  FaCreditCard,
  FaLocationDot,
  FaSquareParking,
  FaWifi,
} from 'react-icons/fa6';
import { MdTableBar } from 'react-icons/md';
import { HiLocationMarker, HiMail, HiPencilAlt, HiPhone } from 'react-icons/hi';
import UpdateShop from './UpdateShop';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { getPackageByShop } from '../../../services/apiPackage';
import FormatNumber from '../../../utils/NumberFormatter';
import { DateFormater, DateTimeFormater } from '../../../utils/DateFormater';
import Empty from '../../../components/Empty';

const CoffeeShop = () => {
  const { coffeeShopId, setCoffeeShopId } = useContext(ManagerContext);
  const { data: coffeeShop, refetch: refetchCoffeeShop } = useQuery({
    queryKey: ['shop'],
    queryFn: () => getShopByUserId(),
  });
  const { data: packageSubscription, refetch: refetchPackage } = useQuery({
    queryKey: ['packageSubscription'],
    queryFn: () => getPackageByShop(),
  });
  const [showAddShop, setShowAddShop] = useState(false);
  const [showUpdateShop, setShowUpdateShop] = useState(false);
  const [isAddShopFormFilled, setIsAddShopFormFilled] = useState(false);
  const [isUpdateShopFormFilled, setIsUpdateShopFormFilled] = useState(false);
  const [shop, setShop] = useState({});

  // this is the form for add new shop
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1,
    setValue: setValue1,
    watch: watch1,
    control: control1,
    formState: { errors: errors1 },
  } = useForm();
  // this is the form for update shop
  const {
    register: register4,
    handleSubmit: handleSubmit4,
    reset: reset4,
    setValue: setValue4,
    watch: watch4,
    control: control4,
    formState: { errors: errors4 },
  } = useForm();
  useEffect(() => {
    reset4(shop);
  }, [shop, reset4]);
  const CreateShop = useMutation({ mutationFn: createShop });
  const CreateShopImage = useMutation({ mutationFn: createShopImage });
  const UpdateShopInfo = useMutation({ mutationFn: updateShop });
  const DeleteShopImage = useMutation({ mutationFn: deleteShopImage });

  const {
    address,
    images: shopImages,
    openTime,
    shopName,
    status,
    phone,
    email,
    description: shopDescription,
  } = coffeeShop?.data || {};

  const addressFull =
    address &&
    `${address.houseNumber}, ${address.street}, ${address.district}, ${address.city}`;

  const addNewShop = async (data) => {
    const { openHour, closeHour, images, ...rest } = data;
    console.log(rest);
    try {
      const response = await CreateShop.mutateAsync(rest);
      if (response.status === 200) {
        console.log(response.data._id, images);
        setCoffeeShopId(response.data._id);
        if (images.length > 0) {
          const res = await CreateShopImage.mutateAsync([
            response.data._id,
            images,
          ]);
          if (res.status === 200) {
            toastSuccess('Create shop successfully');
            refetchCoffeeShop();
          } else {
            toastError(res.message);
          }
        } else {
          toastSuccess('Create shop successfully');
          refetchCoffeeShop();
        }
      } else {
        toastError('Create shop failed');
      }
    } catch (error) {
      toastError(error.message);
    }
  };
  const updateShopInfo = async (data) => {
    const {
      _id,
      images,
      __v,
      houseNumber,
      createdAt,
      updatedAt,
      status,
      closeHour,
      openHour,
      items,
      address,
      ...rest
    } = data;
    const payload = {
      ...rest,
      address: {
        ...address,
        houseNumber: houseNumber,
      },
    };
    console.log(payload);
    try {
      const filterImages = shopImages.filter((image) =>
        images.includes(image.url)
      );
      if (filterImages.length === 0) {
        const deletedImages = shopImages
          .filter((image) => {
            return !images.some((newImage) => newImage === image.url);
          })
          .map((image) => image._id);
        const res = await DeleteShopImage.mutateAsync([
          coffeeShopId,
          deletedImages,
        ]);
        if (res.status === 200) {
          console.log('Delete image successfully');
        } else {
          toastError(res.message);
        }
        if (images.length > 0) {
          const res = await CreateShopImage.mutateAsync([coffeeShopId, images]);
          if (res.status === 200) {
            console.log('Create image successfully');
          } else {
            toastError(res.message);
          }
        }
      }
      if (filterImages.length > 0) {
        const newImages = images.filter((image) => {
          return !shopImages.some((oldImage) => oldImage.url === image);
        });
        if (newImages.length === 0) {
          const deletedImages = shopImages
            .filter((image) => {
              return !images.some((newImage) => newImage === image.url);
            })
            .map((image) => image._id);
          const res = await DeleteShopImage.mutateAsync([
            coffeeShopId,
            deletedImages,
          ]);
          if (res.status === 200) {
            console.log('Delete image successfully');
          } else {
            toastError(res.message);
          }
        }
        if (newImages.length > 0) {
          images.filter(async (image) => {
            if (typeof image === 'object') {
              if (images.length > 0) {
                const res = await CreateShopImage.mutateAsync([
                  coffeeShopId,
                  images,
                ]);
                if (res.status === 200) {
                  console.log('Create image successfully');
                  refetchCoffeeShop();
                } else {
                  toastError(res.message);
                }
              }
            }
          });
        }
      }

      const newInfo = Object.keys(payload).filter((key) => {
        return payload[key] !== coffeeShop.data[key];
      });
      if (newInfo.length > 0) {
        const response = await UpdateShopInfo.mutateAsync([payload, _id]);
        if (response.status === 200) {
          console.log('Update shop successfully');
          refetchCoffeeShop();
        } else {
          toastError(response.message);
        }
      }
      toastSuccess('Update shop successfully');
      refetchCoffeeShop();
    } catch (error) {
      toastError(error.message);
    }
  };
  return (
    <div className='h-fit w-full'>
      {coffeeShop?.message === 'User has no coffee shop' && (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
          <img src={EmptyBox} alt='empty box' />
          <Typography variant='h5'>You have not owned any shop yet</Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={() => setShowAddShop(true)}
          >
            First, please create a new shop
          </Button>
        </div>
      )}
      {coffeeShop.status === 200 && (
        <>
          {coffeeShop.data.status === 'unavailable' && (
            <div className='my-2'>
              <Stack spacing={2}>
                <Alert severity='info'>
                  <p className='flex text-2xl'>
                    Wait for admin to approve your shop
                  </p>
                </Alert>
              </Stack>
            </div>
          )}
          {!packageSubscription?.data && (
            <div className='w-full'>
              <Stack spacing={2}>
                <Alert
                  severity='info'
                  action={
                    <NavLink to='/management/coffeeShop/package'>
                      <Button variant='filled' color='inherit'>
                        Subscribe
                      </Button>
                    </NavLink>
                  }
                >
                  <p className='text-2xl'>
                    Please subscribe a package to publish your shop to customer
                  </p>
                </Alert>
              </Stack>
            </div>
          )}
          {packageSubscription?.data &&
            packageSubscription.data.endTimestamp <
              new Date().getTime() - 7 * 24 * 60 * 60 * 1000 && (
              <div className='w-full'>
                <Stack spacing={2}>
                  <Alert
                    severity='info'
                    action={
                      <NavLink to='/management/coffeeShop/package'>
                        <Button variant='filled' color='inherit'>
                          Subscribe
                        </Button>
                      </NavLink>
                    }
                  >
                    <p className='text-2xl'>
                      Your package is about to be expired, please subscribe a
                      new package to continue publish your shop to customer
                    </p>
                  </Alert>
                </Stack>
              </div>
            )}
          <div className='grid grid-cols-[1fr_1fr] px-[5rem] gap-2 pt-3 pb-10'>
            {/* Section 1 */}
            <div className='flex flex-col'>
              {/* Images + Shop */}
              <div className='bg-white px-5 flex flex-col gap-5'>
                {/* Slide */}
                {shopImages && shopImages.length === 0 ? (
                  // <Splide
                  //   options={{
                  //     type: 'loop',
                  //     gap: '3rem',
                  //     autoplay: shopImages.length > 0,
                  //     arrows: shopImages.length > 0,
                  //   }}
                  //   className='my-carousel'
                  // >
                  //   <SplideSlide
                  //     className={`flex justify-center items-center w-96 h-96`}
                  //   >
                  //     <img
                  //       src={emptyImg}
                  //       alt='No images available'
                  //       className='object-cover object-center w-full h-full'
                  //     />
                  //   </SplideSlide>
                  // </Splide>
                  <Empty object='Images' />
                ) : (
                  <CarouselImgae
                    images={shopImages}
                    altText={`${shop.shopName}`}
                  />
                )}

                {/* Shop Name */}
                <div>
                  {/* Name */}
                  <h1 className='text-4xl font-semibold'>{shopName}</h1>
                  {/* Address */}
                  <div className='my-2 flex items-center gap-3'>
                    <HiLocationMarker size={20} />
                    <p className='text-xl'>{addressFull}</p>
                  </div>
                  <div className='my-2 flex items-center gap-3'>
                    <FaBookBookmark size={20} />
                    <p className='text-xl'>{shopDescription}</p>
                  </div>
                  <div className='my-2 flex items-center gap-3'>
                    <HiMail size={20} />
                    <p className='text-xl'>{email}</p>
                  </div>
                  <div className='my-2 flex items-center gap-3'>
                    <HiPhone size={20} />
                    <p className='text-xl'>{phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className='h-auto w-auto flex flex-col gap-3 '>
              {/* Booking section */}
              {/* Opening time */}
              <div className='flex gap-5 justify-center align-middle'>
                {' '}
                <div className='bg-white w-[20rem] px-3 py-2'>
                  <h2 className='text-center text-3xl text-primary'>
                    Opening Times:{' '}
                  </h2>
                  <ul>
                    {openTime.map((time, index) => (
                      <li
                        key={index}
                        className='grid grid-cols-2 items-center text-secondary'
                      >
                        <span className='font-bold'>{time.day}:</span>
                        <span>
                          {' '}
                          {time.openHour} - {time.closeHour}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='bg-white w-[22rem] px-3 py-2'>
                  <h2 className='text-center text-3xl text-primary'>
                    Additional Information:{' '}
                  </h2>
                  <div className='grid grid-cols-2 text-secondary'>
                    <div>
                      <span className='flex items-center gap-2 text-xl'>
                        <FaSquareParking />
                        <Typography>Parking Lot</Typography>
                      </span>

                      <span className='flex items-center gap-2 text-xl'>
                        <FaWifi />
                        <Typography>Wifi Free</Typography>
                      </span>

                      <span className='flex items-center gap-2 text-xl'>
                        <MdTableBar />
                        <Typography>Outdoor Table</Typography>
                      </span>
                    </div>

                    <div>
                      <span className='flex items-center gap-2 text-xl'>
                        <FaCreditCard />
                        <Typography>Card Payment</Typography>
                      </span>

                      <span className='flex items-center gap-2 text-xl'>
                        <FaCat />
                        <Typography>Cute cats</Typography>
                      </span>

                      <span className='flex items-center gap-2 text-xl'>
                        <FaBowlFood />
                        <Typography>Food & drinks</Typography>
                      </span>
                    </div>
                  </div>
                  <h3 className='text-center'>
                    For more details contact us at{' '}
                    <span className='text-primary font-bold'>{phone}</span>
                  </h3>
                  <div className='flex justify-center'>
                    <Button
                      variant='contained'
                      color='primary'
                      startIcon={<HiPencilAlt />}
                      onClick={() => {
                        setShop(coffeeShop.data);
                        setShowUpdateShop(true);
                      }}
                    >
                      Update Shop Information
                    </Button>
                    {showUpdateShop && (
                      <form onSubmit={handleSubmit4(updateShopInfo)}>
                        <CustomDrawer
                          id='updateShopDrawer'
                          styles={{ width: '75%' }}
                          showModel={showUpdateShop}
                          setShowModel={setShowUpdateShop}
                          isFormFilled={isUpdateShopFormFilled}
                          renderBody={
                            // content of drawer
                            <UpdateShop
                              register={register4}
                              watch={watch4}
                              setValue={setValue4}
                              onFormUpdate={(newState) =>
                                setIsUpdateShopFormFilled(newState)
                              }
                              control={control4}
                              errors={errors4}
                              selectedShop={shop}
                            />
                          }
                          message={{
                            header: 'Update Shop',
                            primaryBtn: 'Done',
                          }}
                        />
                      </form>
                    )}
                  </div>
                </div>
              </div>
              <MapContainer
                center={[address?.coordinates.lat, address?.coordinates.lng]}
                zoom={50}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker
                  position={[
                    address?.coordinates.lat,
                    address?.coordinates.lng,
                  ]}
                >
                  <Popup>Your shop is here</Popup>
                </Marker>
              </MapContainer>
              {packageSubscription?.data && (
                <div className='bg-white'>
                  <p className='mx-4 text-3xl font-semibold'>
                    Current subscribe package
                  </p>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div className='p-4 flex flex-col gap-2 bg-white'>
                        <div className='flex justify-between'>
                          <h1 className='text-3xl font-bold'>
                            {packageSubscription?.data.packageId.name}
                          </h1>
                          <p className='text-2xl font-bold text-gray-500'>
                            đ{' '}
                            {FormatNumber(
                              packageSubscription?.data.packageId.price
                            )}
                            <span className='text-sm'>
                              /{packageSubscription?.data.packageId.duration}{' '}
                              day
                            </span>
                          </p>
                        </div>
                        <p>{packageSubscription?.data.packageId.description}</p>
                        <div className='flex justify-between'>
                          <p className='text-2xl font-semibold'>
                            Start date:{' '}
                            {DateFormater(packageSubscription?.data.startTime)}
                          </p>
                          <p className='text-2xl font-semibold'>
                            End date:{' '}
                            {DateFormater(packageSubscription?.data.endTime)}
                          </p>
                        </div>
                        <NavLink to='/management/coffeeShop/package'>
                          <Button variant='contained' color='primary' fullWidth>
                            To package
                          </Button>
                        </NavLink>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              )}
              {/* <div className="bg-white">
                <p className="mx-4 text-3xl font-semibold">Area</p>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<HiOutlinePlus />}
                  sx={{ m: 2 }}
                  onClick={() => setShowAddArea(true)}
                >
                  Add Area
                </Button>
                {showAddArea && (
                  <form onSubmit={handleSubmit2(addNewArea)}>
                    <CustomDrawer
                      id="addAreaDrawer"
                      styles={{ width: "25%" }}
                      showModel={showAddArea}
                      setShowModel={setShowAddArea}
                      isFormFilled={isAddAreaFormFilled}
                      renderBody={
                        // content of drawer
                        <AddArea
                          register={register2}
                          reset={reset2}
                          watch={watch2}
                          setValue={setValue2}
                          onFormUpdate={(newState) =>
                            setIsAddAreaFormFilled(newState)
                          }
                        />
                      }
                      message={{
                        header: "Add Area",
                        primaryBtn: "Done",
                      }}
                    />
                  </form>
                )}
                {showUpdateArea && (
                  <form onSubmit={handleSubmit3(editArea)}>
                    <CustomDrawer
                      id="updateAreaDrawer"
                      styles={{ width: "25%" }}
                      showModel={showUpdateArea}
                      setShowModel={setShowUpdateArea}
                      isFormFilled={isUpdateAreaFormFilled}
                      renderBody={
                        <UpdateArea
                          register={register3}
                          watch={watch3}
                          setValue={setValue3}
                          onFormUpdate={(newState) =>
                            setIsUpdateAreaFormFilled(newState)
                          }
                          selectedArea={selectedArea}
                        />
                      }
                      message={{
                        header: "Update Area",
                        primaryBtn: "Done",
                      }}
                    />
                  </form>
                )}
                <div className="w-full grid grid-cols-2">
                  {areas.data?.length > 0 ? (
                    areas?.data.map((area) => (
                      <div key={area._id} className="bg-white px-3 py-2">
                        <div className="border-2 rounded-lg p-2">
                          <div className="w-full h-[20vh]">
                            <LazyLoadImage
                              src={area.images[0].url}
                              className="rounded-full w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col items-start justify-between gap-1 p-2">
                            <h1 className="text-primary text-2xl font-bold">
                              {area.name}
                            </h1>
                            <p className="text-1xl text-gray-700">
                              {area.isChildAllowed
                                ? "Children allowed"
                                : "Children not allowed"}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<HiPencilAlt />}
                              onClick={() => {
                                setSelectedArea(area);
                                setShowUpdateArea(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<HiOutlineTrash />}
                              onClick={() => {
                                setSelectedArea(area);
                                setOpenPopUp(true);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text">There is no Area available</p>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </>
      )}
      {showAddShop && (
        <form onSubmit={handleSubmit1(addNewShop)}>
          <CustomDrawer
            id='addShopDrawer'
            styles={{ width: '75%' }}
            showModel={showAddShop} // show drawer
            setShowModel={setShowAddShop} // set show drawer
            isFormFilled={isAddShopFormFilled} // check if form is filled to show submit button
            renderBody={
              // content of drawer
              <AddShop
                register={register1} // get the register function from useForm
                reset={reset1} // reset data after submit
                watch={watch1} // get value of each field when it change
                setValue={setValue1} // set value for image field (if form don't contain image field, this line can be removed)
                onFormUpdate={(newState) => setIsAddShopFormFilled(newState)} // update form state to true if all fields are filled
                control={control1}
                errors={errors1}
              />
            }
            message={{
              header: 'Add New Shop',
              primaryBtn: 'Done', // text of submit button (show when isFormFilled is true)
            }}
          />
        </form>
      )}
      {/* <Dialog
        open={openPopUp}
        onClose={() => setOpenPopUp(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick={true} // Disable closing dialog by clicking outside
        disableEscapeKeyDown={true} // Disable closing dialog by pressing Escape key
      >
        <div className="flex flex-col items-center justify-center">
          <DialogTitle id="alert-dialog-title">
            <p className="text-3xl">Delete confirmation</p>
          </DialogTitle>
          <DialogContent className="flex flex-col items-center justify-center">
            <DialogContentText id="alert-dialog-description">
              <p className="text-2xl">Do you want to delete this area?</p>
            </DialogContentText>
          </DialogContent>
        </div>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              setOpenPopUp(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteAreaInfo()}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default CoffeeShop;
