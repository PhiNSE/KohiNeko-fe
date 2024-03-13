import {
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import GetImage from "../../../components/GetImage";
import RenderChooseTime from "./RenderChooseTime";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import SearchMap from "./SearchMap";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const UpdateShop = ({
  register,
  watch,
  setValue,
  errors,
  onFormUpdate,
  selectedShop,
  control,
}) => {
  const shopName = watch("shopName") || "";
  const description = watch("description") || "";
  const addressData = watch("address") || "";
  const email = watch("email") || "";
  // const houseNumber = watch("houseNumber") || "";
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState();
  const [selectedDayTime, setSelectedDayTime] = useState(
    selectedShop?.openTime || []
  );
  // initialize images array to RENDER each image
  const [images, setImages] = useState(
    selectedShop.images.map((image) => image.url)
  );
  const [houseNumber, setHouseNumber] = useState(
    selectedShop?.address?.houseNumber || ""
  );
  const [phone, setPhone] = useState(selectedShop.phone);
  const [choseAddress, setChoseAddress] = useState(selectedShop?.address || "");
  // const [openTime, setOpenTime] = useState(selectedShop?.openTime || []);
  // key to choose image again after delete
  const [key1, setKey1] = useState(1);
  const [key2, setKey2] = useState(0);
  const [key3, setKey3] = useState(10);
  const [key4, setKey4] = useState(20);
  const [key5, setKey5] = useState(30);
  const [key6, setKey6] = useState(40);
  const [checked, setChecked] = useState(false);
  const [errorDay, setErrorDay] = useState(false);
  const [disableDay, setDisableDay] = useState("");

  // useEffect(() => {
  //   let allEqual = true;
  //   for (let i = 1; i < selectedDayTime.length; i++) {
  //     if (
  //       selectedDayTime[i].openHour !== selectedDayTime[0].openHour ||
  //       selectedDayTime[i].closeHour !== selectedDayTime[0].closeHour
  //     ) {
  //       allEqual = false;
  //       break;
  //     }
  //   }
  //   setChecked(!allEqual);
  // }, [selectedDayTime]);

  useEffect(() => {
    if (selectedDayTime.length > 0) {
      setValue("openTime", selectedDayTime);
    }
  }, [selectedDayTime, setValue]);

  useEffect(() => {
    setValue("phone", phone);
  }, [phone]);
  useEffect(() => {
    setValue("houseNumber", houseNumber);
  }, [houseNumber]);

  useEffect(() => {
    // const address = "112 Chien Thang, Ward 9, Phu Nhuan, Ho Chi Minh city, Vietnam";
    // let houseNumber = "";
    let street = "";
    let ward = "";
    let district = "";
    let city = "";
    let postalCode = "";
    let country = "";
    if (address) {
      const addressArray = address.split(", ");
      // houseNumber = parseInt(addressArray[0].split(" ")[0]) || 1;
      street = addressArray[0].split(" ").slice(0).join(" ");
      ward = addressArray[1];
      district = addressArray[2];
      city = addressArray[3];
      postalCode = addressArray[4];
      country = addressArray[5];
      console.log(
        // houseNumber,
        street,
        ward,
        district,
        city,
        postalCode,
        country
      );
      const fullAddress = {
        // houseNumber: houseNumber,
        houseNumber: houseNumber,
        street: street,
        district: district,
        city: city,
        coordinates: coordinates ? coordinates : null,
      };
      setValue("address", fullAddress);
    }
  }, [address, coordinates, houseNumber, setValue]);

  useEffect(() => {
    // initialize images array to STORE each image
    const tempImageArray = [];
    images.map((image) => {
      if (image) {
        tempImageArray.push(image);
      }
    });
    setValue("images", tempImageArray); // store image array to form use setValue instead of register because <GetImage/> is not a form component
  }, [images]);

  // this use to check if all fields are filled
  useEffect(() => {
    const isFormFilled =
      images.filter((image) => image !== undefined).length >= 1 &&
      selectedDayTime.length > 0 &&
      errorDay === false &&
      shopName !== "" &&
      phone !== "" &&
      addressData &&
      houseNumber !== "" &&
      email !== "" &&
      description !== "";
    onFormUpdate(isFormFilled); // pass isFormFilled to Cat.jsx
  }, [
    images,
    selectedDayTime,
    errorDay,
    watch,
    checked,
    shopName,
    phone,
    email,
    addressData,
    houseNumber,
    description,
    onFormUpdate,
  ]);

  const handlePhoneChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setPhone(numericValue);
  };

  const handleDisableDay = (idx) => {
    // find the day in selectedDayTime that have the idx
    const selectedDayTimeIndex = selectedDayTime.findIndex(
      (item) => item.day === daysOfWeek[idx]
    );
    if (selectedDayTimeIndex !== -1) {
      setSelectedDayTime((prev) => {
        let newArr = [...prev];
        newArr.splice(selectedDayTimeIndex, 1);
        return newArr;
      });
    } 
    else {
      setSelectedDayTime((prev) => [
        ...prev,
        {
          day: daysOfWeek[idx],
          openHour: null,
          closeHour: null,
        },
      ]);
    }

    const updatedDisableDay = [...disableDay];
    updatedDisableDay[idx] = !updatedDisableDay[idx];
    setDisableDay(updatedDisableDay);
  };
  return (
    <>
      <div className="mt-2">
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Shop Name</Typography>
            <TextField
              label="Choose name for shop"
              color="primary"
              fullWidth
              required
              margin="normal"
              {...register("shopName")}
            />

            <Typography variant="h6">Address</Typography>
            <TextField
              label="Input house number"
              color="primary"
              fullWidth
              required
              margin="normal"
              value={houseNumber}
              onChange={(event) => setHouseNumber(event.target.value)}
            />
            <MapContainer
              center={[
                choseAddress?.coordinates.lat,
                choseAddress?.coordinates.lng,
              ]}
              zoom={13}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <SearchMap
                setAddress={setAddress}
                setCoordinates={setCoordinates}
                coordinates={choseAddress.coordinates}
              />
              <Marker
                position={[
                  choseAddress.coordinates.lat,
                  choseAddress.coordinates.lng,
                ]}
              >
                <Popup>Your address is here</Popup>
              </Marker>
            </MapContainer>

            <Typography variant="h6">Phone number</Typography>
            <TextField
              label="Add phone number"
              color="primary"
              fullWidth
              required
              margin="normal"
              onChange={(event) => handlePhoneChange(event)}
              value={phone}
            />

            <Typography variant="h6">Email</Typography>
            <TextField
              label="Enter email address"
              color="primary"
              fullWidth
              required
              margin="normal"
              multiline
              {...register("email")}
            />

            <Typography variant="h6">Description</Typography>
            <TextField
              label="Write some description"
              color="primary"
              fullWidth
              required
              margin="normal"
              multiline
              {...register("description")}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <div className="pl-2 border-l-2">
              <Typography variant="h5" fontWeight="bold">
                Set up open/close time
              </Typography>
              {daysOfWeek.map((day, idx) => (
                <div key={idx}>
                  <div className="flex justify-between">
                    <Typography variant="h6" sx={{ py: 1 }}>
                      {day}
                    </Typography>
                    <FormControlLabel
                      label="Disable this day"
                      control={
                        <Switch
                          color="primary"
                          checked={disableDay[idx]}
                          onChange={() => handleDisableDay(idx)}
                        />
                      }
                    />
                  </div>
                  <div className=" flex items-center">
                    <RenderChooseTime
                      control={control}
                      errors={errors}
                      selectedDayTime={selectedDayTime}
                      setSelectedDayTime={setSelectedDayTime}
                      day={day}
                      disableDay={disableDay[idx]}
                      setErrorDay={setErrorDay}
                    />
                  </div>
                </div>
              ))}
              {/* {checked === false ? (
                <>
                  <div className="flex items-center">
                    <RenderChooseTime
                      control={control}
                      errors={errors}
                      selectedDayTime={selectedDayTime[0]}
                      setSelectedDayTime={setSelectedDayTime}
                      // openTime={openTime[0]}
                    />
                  </div>
                </>
              ) : (
                <>
                  {daysOfWeek.map((day, idx) => (
                    <div key={idx}>
                      <Typography variant="h6" sx={{ py: 1 }}>
                        {day}
                      </Typography>
                      <div className=" flex items-center">
                        <RenderChooseTime
                          control={control}
                          errors={errors}
                          selectedDayTime={selectedDayTime[idx]}
                          setSelectedDayTime={setSelectedDayTime}
                          day={day}
                          // openTime={openTime[idx]}
                        />
                      </div>
                    </div>
                  ))}
                </>
              )} */}
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Image</Typography>
            <Typography variant="h7">Image avatar</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <GetImage
                  key={key1}
                  fileId={"1"}
                  selectedFile={images[0]}
                  setSelectedFile={(file) => {
                    if (file !== images[0]) {
                      setKey1((prevKey) => prevKey + 1);
                      setImages((prevImages) => [file, prevImages[1]]);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {images[0] && (
                  <GetImage
                    key={key2}
                    fileId={"2"}
                    selectedFile={images[1]}
                    setSelectedFile={(file) => {
                      if (file !== images[1]) {
                        setKey2((prevKey) => prevKey - 1);
                        setImages((prevImages) => [prevImages[0], file]);
                      }
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {images[0] && images[1] && (
                  <GetImage
                    key={key3}
                    fileId={"3"}
                    selectedFile={images[2]}
                    setSelectedFile={(file) => {
                      if (file !== images[2]) {
                        setKey3((prevKey) => prevKey + 1);
                        setImages((prevImages) => [
                          prevImages[0],
                          prevImages[1],
                          file,
                        ]);
                      }
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {images[0] && images[1] && images[2] && (
                  <GetImage
                    key={key4}
                    fileId={"4"}
                    selectedFile={images[3]}
                    setSelectedFile={(file) => {
                      if (file !== images[3]) {
                        setKey4((prevKey) => prevKey + 1);
                        setImages((prevImages) => [
                          prevImages[0],
                          prevImages[1],
                          prevImages[2],
                          file,
                        ]);
                      }
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {images[0] && images[1] && images[2] && images[3] && (
                  <GetImage
                    key={key5}
                    fileId={"5"}
                    selectedFile={images[4]}
                    setSelectedFile={(file) => {
                      if (file !== images[4]) {
                        setKey5((prevKey) => prevKey + 1);
                        setImages((prevImages) => [
                          prevImages[0],
                          prevImages[1],
                          prevImages[2],
                          prevImages[3],
                          file,
                        ]);
                      }
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {images[0] &&
                  images[1] &&
                  images[2] &&
                  images[3] &&
                  images[4] && (
                    <GetImage
                      key={key6}
                      fileId={"6"}
                      selectedFile={images[5]}
                      setSelectedFile={(file) => {
                        if (file !== images[5]) {
                          setKey6((prevKey) => prevKey + 1);
                          setImages((prevImages) => [
                            prevImages[0],
                            prevImages[1],
                            prevImages[2],
                            prevImages[3],
                            prevImages[4],
                            file,
                          ]);
                        }
                      }}
                    />
                  )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default UpdateShop;
