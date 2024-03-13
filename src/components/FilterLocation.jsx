import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useProvinces } from "../hooks/useProvinces";
import { useState } from "react";
import { useDistricts } from "../hooks/useDistricts";

const FilterLocation = ({
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
  setFilterApplied,
}) => {
  const { allProvinces } = useProvinces();
  const { allDistricts } = useDistricts(
    selectedProvince ? selectedProvince : ""
  );

  return (
    <div className="  h-fit w-fit flex items-center gap-3 px-3 rounded-md ">
      <div className=" flex mr-4 gap-5">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={allProvinces}
          getOptionLabel={(option) => option.province_name}
          sx={{ minWidth: 220, maxWidth: "100%" }}
          renderInput={(params) => <TextField {...params} label="Cities" />}
          onChange={(event, newValue) => {
            setSelectedProvince(newValue);
            setSelectedDistrict(null); // Reset the district when the city changes
          }}
        />

        <Autocomplete
          disablePortal
          disabled={!selectedProvince}
          id="district-combo-box"
          options={allDistricts}
          getOptionLabel={(option) => option.district_name}
          sx={{ width: 200 }} // Reduced width
          renderInput={(params) => <TextField {...params} label="Districts" />}
          value={selectedDistrict}
          onChange={(event, newValue) => {
            setSelectedDistrict(newValue);
          }}
        />
        <div className="h-10 flex justify-center align-middle text-center items-center border-2 rounded-xl border-orange-400 my-auto mx-auto">
          <Button onClick={() => setFilterApplied(true)}>Apply now</Button>
        </div>
      </div>
    </div>
  );
};

export default FilterLocation;
