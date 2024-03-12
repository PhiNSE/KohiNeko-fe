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

const UpdateCat = ({
  register,
  watch,
  setValue,
  onFormUpdate,
  selectedCat,
  control,
}) => {
  const name = watch("name") || "";
  const breed = watch("breed") || "";
  const gender = watch("gender") || "";
  const description = watch("description") || "";
  const favorite = watch("favorite") || "";
  const dateOfBirth = watch("dateOfBirth") || null;
  // initialize images array to RENDER each image
  const [images, setImages] = useState(
    selectedCat.images?.map((image) => image.url)
  );
  // key to choose image again after delete
  const [key1, setKey1] = useState(1);
  const [key2, setKey2] = useState(0);

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
      name !== "" &&
      dateOfBirth &&
      breed !== "" &&
      description !== "" &&
      favorite !== "" &&
      gender !== "";
    onFormUpdate(isFormFilled); // pass isFormFilled to Cat.jsx
  }, [
    images,
    watch,
    name,
    dateOfBirth,
    breed,
    description,
    favorite,
    gender,
    onFormUpdate,
  ]);

  return (
    <>
      <div className="mt-2">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Name</Typography>
            <TextField
              label="Name"
              required
              fullWidth
              margin="normal"
              color="warning"
              {...register("name")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Breed</Typography>
            <TextField
              label="Breed"
              required
              fullWidth
              margin="normal"
              color="warning"
              {...register("breed")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ pb: 2 }}>
              Date of Birth
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePicker
                      label="Date of Birth"
                      margin="normal"
                      format="DD/MM/YYYY"
                      sx={{ width: "100%" }}
                      disableFuture
                      value={value ? dayjs(value) : dayjs(dateOfBirth)}
                      onChange={(date) => onChange(date || null)}
                    />
                  );
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Description</Typography>
            <TextField
              label="Description"
              required
              fullWidth
              margin="normal"
              color="warning"
              multiline
              maxRows={6}
              {...register("description")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Favorite</Typography>
            <TextField
              label="Favorite"
              required
              fullWidth
              margin="normal"
              color="warning"
              {...register("favorite")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Gender</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-label">
                Choose gender
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Choose gender"
                color="warning"
                margin="normal"
                required
                value={gender}
                onChange={(event) => setValue("gender", event.target.value)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
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
              {images[0] && (
                <Grid item xs={12} md={6}>
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
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default UpdateCat;
