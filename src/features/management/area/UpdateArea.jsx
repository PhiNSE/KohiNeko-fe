import { useEffect, useState } from "react";
import { FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import GetImage from "../../../components/GetImage";

const UpdateArea = ({
  register,
  watch,
  setValue,
  onFormUpdate,
  selectedArea,
}) => {
  const areaName = watch("name") || "";
  const [checked, setChecked] = useState(selectedArea?.isChildAllowed);
  const [key, setKey] = useState(1);
  // initialize images array to RENDER each image
  const [images, setImages] = useState(
    selectedArea.images?.map((image) => image.url)
  );

  useEffect(() => {
    // initialize images array to STORE each image
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
  }, [images, watch, areaName, onFormUpdate]);

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

export default UpdateArea;
