import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import GetImage from "../../../components/GetImage";

const AddArea = ({ register, reset, setValue, watch, onFormUpdate }) => {
  const areaName = watch("name") || "";
  const [images, setImages] = useState([]);
  const [checked, setChecked] = useState(false);
  const [key, setKey] = useState(1);

  // reset form after submit
  useEffect(() => {
    reset({
      name: null,
      isChildAllowed: null,
      images: null,
    });
  }, []);

  useEffect(() => {
    const tempImageArray = [];
    images.map((image) => {
      if (image) {
        tempImageArray.push(image);
      }
    });
    setValue("images", tempImageArray);
  }, [images]);

  useEffect(() => {
    setValue("isChildAllowed", checked);
  }, [checked]);

  // this use to check if all fields are filled
  useEffect(() => {
    const isFormFilled =
      images.filter((image) => image !== undefined).length >= 1 &&
      areaName !== "";
    onFormUpdate(isFormFilled);
  }, [images, areaName, onFormUpdate]);

  return (
    <div className="flex flex-col space-y-2">
      <Typography variant="h6">Area</Typography>
      <TextField required label="Enter area name" {...register("name")} />
      <Typography variant="h6">Child Allowed</Typography>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={checked}
            onChange={() => {
              setChecked(!checked);
            }}
          />
        }
      />
      <Typography variant="h6">Image</Typography>
      <GetImage
        key={key}
        fileId={"1"}
        selectedFile={images[0]}
        setSelectedFile={(file) => {
          if (file !== images[0]) {
            setKey((prevKey) => prevKey + 1);
            setImages((prevImages) => [file, prevImages[1]]);
          }
        }}
      />
    </div>
  );
};

export default AddArea;
