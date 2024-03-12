import { useState, useEffect, useContext } from "react";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import GetImage from "../../../components/GetImage";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, set } from "react-hook-form";
import { HiChevronDown, HiOutlineMinus } from "react-icons/hi";
import { getAreasInAShop } from "../../../services/apiArea";
import { ManagerContext } from "../ManagerContext";
import dayjs from "dayjs";
import LazyLoadImage from "../../../components/LazyLoadImage";
import { getCatsInArea } from "../../../services/apiArea";

const AddCat = ({
  register,
  reset,
  watch,
  setValue,
  onFormUpdate,
  control,
}) => {
  const name = watch("name");
  const dob = watch("dateOfBirth");
  const breed = watch("breed");
  const description = watch("description");
  const favorite = watch("favorite");
  const gender = watch("gender");
  // const areaId = watch("areaId");
  // initialize images array to RENDER each image
  const [images, setImages] = useState([]);
  // key to choose image again after delete
  const [key1, setKey1] = useState(1);
  const [key2, setKey2] = useState(0);
  // const [cats, setCats] = useState([]);
  // const { data: areas } = useQuery({
  //   queryKey: ["areas", coffeeShopId],
  //   queryFn: () => getAreasInAShop(coffeeShopId),
  // });
  // const GetCatInArea = useMutation({ mutationFn: getCatsInArea });

  // reset form after submit
  useEffect(() => {
    reset({
      dateOfBirth: null,
      name: null,
      breed: null,
      description: null,
      favorite: null,
      gender: null,
      areaId: null,
      startTime: null,
      endTime: null,
    });
  }, []);

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

  // useEffect(() => {
  //   const fetchCatsInArea = async () => {
  //     if (areaId !== null) {
  //       const response = await GetCatInArea.mutateAsync([coffeeShopId, areaId]);
  //       console.log(response);
  //       if (response.status === 200) {
  //         setCats(response.data);
  //       }
  //     }
  //   };
  //   fetchCatsInArea();
  // }, [areaId]);

  // this use to check if all fields are filled
  useEffect(() => {
    const isFormFilled =
      images.filter((image) => image !== undefined).length >= 1 &&
      name !== "" &&
      dob &&
      breed !== "" &&
      description !== "" &&
      favorite !== "" &&
      gender !== "";
    onFormUpdate(isFormFilled); // pass isFormFilled to Cat.jsx
  }, [
    images,
    watch,
    name,
    dob,
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
              color="warning"
              fullWidth
              required
              margin="normal"
              {...register("name")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Breed</Typography>
            <TextField
              label="Breeds"
              color="warning"
              fullWidth
              required
              margin="normal"
              {...register("breed")}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{pb: 2}}>Date of Birth</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Date of Birth"
                    margin="normal"
                    format="DD/MM/YYYY"
                    sx={{ width: "100%" }}
                    disableFuture
                    value={value}
                    onChange={(date) => onChange(date || null)}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Description</Typography>
            <TextField
              label="Description"
              color="warning"
              fullWidth
              required
              margin="normal"
              multiline
              maxRows={6}
              {...register("description")}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Favorite</Typography>
            <TextField
              label="Favorite"
              color="warning"
              fullWidth
              required
              margin="normal"
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
                {...register("gender")}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* <Grid item xs={12}>
            <Accordion sx={{ my: 2 }}>
              <AccordionSummary expandIcon={<HiChevronDown />}>
                <Typography variant="h6">Assign area</Typography>
                <Typography
                  variant="h7"
                  alignSelf="center"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  (Optional)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="demo-simple-select-label">
                    Choose area
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Choose gender"
                    color="primary"
                    margin="normal"
                    {...register("areaId")}
                  >
                    {areas?.data &&
                      areas?.data.map((area) => (
                        <MenuItem key={area._id} value={area._id}>
                          {area.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    {cats.length > 0 ? (
                      cats.map((cat, idx) => (
                        <div key={idx} className="border-2 rounded-lg p-2">
                          <div className="w-full h-[20vh]">
                            <LazyLoadImage
                              src={cat.images[0].url}
                              className="rounded-full w-full h-full object-cover"
                            ></LazyLoadImage>
                          </div>
                          <div className="flex flex-col items-start justify-between gap-1 p-2">
                            <h1 className="text-primary text-2xl font-bold">
                              {cat.name}
                            </h1>
                            <Typography className="text-justify text-sm text-gray-700">
                              {cat.description}
                            </Typography>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>No cat in this area</>
                    )}
                  </Grid>
                </Grid>
                <p className="py-1 text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="flex justify-between items-center">
                    <Controller
                      name="startTime"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          label="Start time"
                          margin="normal"
                          format="DD/MM/YYYY"
                          sx={{ width: "100%" }}
                          value={value}
                          onChange={(date) => onChange(date || null)}
                        />
                      )}
                    />
                    <HiOutlineMinus className="mx-2" />
                    <Controller
                      name="endTime"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          label="End time"
                          margin="normal"
                          format="DD/MM/YYYY"
                          sx={{ width: "100%" }}
                          value={value}
                          onChange={(date) =>
                            onChange(
                              dayjs(startTime).isAfter(dayjs(date))
                                ? date
                                : null
                            )
                          }
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
                  If dont assign start time, the time will be set to current
                  time
                </p>
                <p className="text-center">
                  If dont assign end time, the time will be set to forever
                </p>
              </AccordionDetails>
            </Accordion>
          </Grid> */}

          <Grid item xs={12}>
            <Typography variant="h6">Images</Typography>
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
              {/* <Grid item xs={12} md={6}>
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
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default AddCat;
